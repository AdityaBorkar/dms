import { valibotResolver } from "@hookform/resolvers/valibot";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import type { ChangeEvent } from "react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import type { InferInput } from "valibot";

import { NewEntityPage } from "@/components/pages/new-entity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { orpc } from "@/lib/orpc";
import { slugify } from "@/lib/utils";
import { ProvisionTenantSchema } from "@/schemas/tenants";

export const Route = createFileRoute("/(app)/organizations/new")({
  component: NewOrganizationPage,
});

type FormValues = InferInput<typeof ProvisionTenantSchema>;

function NewOrganizationPage() {
  const router = useRouter();
  const titleId = useId();
  const slugId = useId();
  const planId = useId();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      plan: "",
      slug: "",
    },
    resolver: valibotResolver(ProvisionTenantSchema),
  });

  const [slugTouched, setSlugTouched] = useState(false);

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    if (!slugTouched) {
      setValue("slug", slugify(event.target.value), { shouldValidate: true });
    }
  }

  async function onSubmit(values: FormValues) {
    setError(null);
    try {
      await orpc.tenants.onboard({
        name: values.name,
        plan: values.plan || null,
        slug: values.slug,
      });
      await router.invalidate();
      await router.navigate({ to: "/organizations" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create organization",
      );
    }
  }

  return (
    <NewEntityPage
      backHref="/organizations"
      description="Provision a new organization (tenant) on the platform."
      domain="organizations"
      icon={Building2}
      title="Create organization"
    >
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-1.5">
          <label className="font-medium text-xs" htmlFor={titleId}>
            Name
          </label>
          <Input
            aria-invalid={!!errors.name}
            id={titleId}
            placeholder="Acme Corp"
            {...register("name", { onChange: handleNameChange })}
          />
          {errors.name ? (
            <p className="text-destructive text-xs">{errors.name.message}</p>
          ) : null}
        </div>
        <div className="grid gap-1.5">
          <label className="font-medium text-xs" htmlFor={slugId}>
            Slug
          </label>
          <Input
            aria-invalid={!!errors.slug}
            id={slugId}
            placeholder="acme-corp"
            {...register("slug", {
              onChange: () => setSlugTouched(true),
            })}
          />
          {errors.slug ? (
            <p className="text-destructive text-xs">{errors.slug.message}</p>
          ) : null}
        </div>
        <div className="grid gap-1.5">
          <label className="font-medium text-xs" htmlFor={planId}>
            Plan
          </label>
          <Input id={planId} placeholder="Optional" {...register("plan")} />
        </div>
        {error ? <p className="text-destructive text-xs">{error}</p> : null}
        <div className="flex justify-end gap-2 border-t pt-4">
          <Button
            nativeButton={false}
            render={<Link to="/organizations" />}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Creating…" : "Create organization"}
          </Button>
        </div>
      </form>
    </NewEntityPage>
  );
}
