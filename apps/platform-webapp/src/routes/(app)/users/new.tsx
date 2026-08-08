import { valibotResolver } from "@hookform/resolvers/valibot";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { UsersRound } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import type { InferInput } from "valibot";

import { NewEntityPage } from "@/components/pages/new-entity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { orpc } from "@/lib/orpc";
import { CreatePlatformUserSchema } from "@/schemas/users";

export const Route = createFileRoute("/(app)/users/new")({
  component: NewUserPage,
});

const ROLES = [
  { label: "Platform Admin", value: "platform_admin" },
  { label: "Service Provider User", value: "sp_user" },
  { label: "Tenant Admin", value: "tenant_admin" },
  { label: "Tenant User", value: "tenant_user" },
] as const;

type FormValues = InferInput<typeof CreatePlatformUserSchema>;

const selectClass =
  "h-7 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 md:text-xs/relaxed";

function NewUserPage() {
  const router = useRouter();
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const roleId = useId();
  const spIdFieldId = useId();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      role: "platform_admin",
      spId: "",
    },
    resolver: valibotResolver(CreatePlatformUserSchema),
  });

  const requiresSp = watch("role") === "sp_user";

  async function onSubmit(values: FormValues) {
    setError(null);
    try {
      await orpc.management.users.create({
        email: values.email,
        name: values.name,
        password: values.password,
        role: values.role,
        spId: requiresSp ? values.spId || null : null,
      });
      await router.invalidate();
      await router.navigate({ to: "/users" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    }
  }

  return (
    <NewEntityPage
      backHref="/users"
      description="Provision a new platform user with a role."
      domain="users"
      icon={UsersRound}
      title="Create user"
    >
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-1.5">
          <label className="font-medium text-xs" htmlFor={nameId}>
            Name
          </label>
          <Input
            aria-invalid={!!errors.name}
            id={nameId}
            placeholder="Jane Doe"
            {...register("name")}
          />
          {errors.name ? (
            <p className="text-destructive text-xs">{errors.name.message}</p>
          ) : null}
        </div>
        <div className="grid gap-1.5">
          <label className="font-medium text-xs" htmlFor={emailId}>
            Email
          </label>
          <Input
            aria-invalid={!!errors.email}
            id={emailId}
            placeholder="jane@acme.com"
            type="email"
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-destructive text-xs">{errors.email.message}</p>
          ) : null}
        </div>
        <div className="grid gap-1.5">
          <label className="font-medium text-xs" htmlFor={passwordId}>
            Password
          </label>
          <Input
            aria-invalid={!!errors.password}
            id={passwordId}
            placeholder="Temporary password"
            type="password"
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-destructive text-xs">
              {errors.password.message}
            </p>
          ) : null}
        </div>
        <div className="grid gap-1.5">
          <label className="font-medium text-xs" htmlFor={roleId}>
            Role
          </label>
          <select className={selectClass} id={roleId} {...register("role")}>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        {requiresSp ? (
          <div className="grid gap-1.5">
            <label className="font-medium text-xs" htmlFor={spIdFieldId}>
              Service Provider ID
            </label>
            <Input
              aria-invalid={!!errors.spId}
              id={spIdFieldId}
              placeholder="sp_…"
              {...register("spId", {
                required: "Service Provider ID is required",
              })}
            />
            {errors.spId ? (
              <p className="text-destructive text-xs">{errors.spId.message}</p>
            ) : null}
          </div>
        ) : null}
        {error ? <p className="text-destructive text-xs">{error}</p> : null}
        <div className="flex justify-end gap-2 border-t pt-4">
          <Button
            nativeButton={false}
            render={<Link to="/users" />}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Creating…" : "Create user"}
          </Button>
        </div>
      </form>
    </NewEntityPage>
  );
}
