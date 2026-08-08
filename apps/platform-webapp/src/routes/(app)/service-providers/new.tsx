import { valibotResolver } from "@hookform/resolvers/valibot";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Handshake } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import type { InferInput } from "valibot";

import { NewEntityPage } from "@/components/pages/new-entity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { orpc } from "@/lib/orpc";
import { CreateServiceProviderSchema } from "@/schemas/service-providers";

export const Route = createFileRoute("/(app)/service-providers/new")({
  component: NewServiceProviderPage,
});

type FormValues = InferInput<typeof CreateServiceProviderSchema>;

function NewServiceProviderPage() {
  const router = useRouter();
  const nameId = useId();
  const slugId = useId();
  const emailId = useId();
  const websiteId = useId();
  const descriptionId = useId();
  const phoneId = useId();
  const addressId = useId();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      address: "",
      description: "",
      email: "",
      name: "",
      phone: "",
      slug: "",
      website: "",
    },
    resolver: valibotResolver(CreateServiceProviderSchema),
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    try {
      await orpc.management.serviceProviders.create({
        address: values.address || null,
        description: values.description || null,
        email: values.email,
        name: values.name,
        phone: values.phone || null,
        slug: values.slug,
        website: values.website,
      });
      await router.invalidate();
      await router.navigate({ to: "/service-providers" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create provider",
      );
    }
  }

  return (
    <NewEntityPage
      backHref="/service-providers"
      description="Provision a new service provider on the platform."
      domain="service-providers"
      icon={Handshake}
      title="Create service provider"
    >
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-1.5">
          <label className="font-medium text-xs" htmlFor={nameId}>
            Name
          </label>
          <Input
            aria-invalid={!!errors.name}
            id={nameId}
            placeholder="Acme Shared Services"
            {...register("name")}
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
            placeholder="acme-shared"
            {...register("slug")}
          />
          {errors.slug ? (
            <p className="text-destructive text-xs">{errors.slug.message}</p>
          ) : null}
        </div>
        <div className="grid gap-1.5">
          <label className="font-medium text-xs" htmlFor={emailId}>
            Email
          </label>
          <Input
            aria-invalid={!!errors.email}
            id={emailId}
            placeholder="sp@acme.com"
            type="email"
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-destructive text-xs">{errors.email.message}</p>
          ) : null}
        </div>
        <div className="grid gap-1.5">
          <label className="font-medium text-xs" htmlFor={websiteId}>
            Website
          </label>
          <Input
            aria-invalid={!!errors.website}
            id={websiteId}
            placeholder="https://acme.com"
            type="url"
            {...register("website")}
          />
          {errors.website ? (
            <p className="text-destructive text-xs">{errors.website.message}</p>
          ) : null}
        </div>
        <div className="grid gap-1.5">
          <label className="font-medium text-xs" htmlFor={descriptionId}>
            Description
          </label>
          <Input
            id={descriptionId}
            placeholder="Optional"
            {...register("description")}
          />
        </div>
        <div className="grid gap-1.5">
          <label className="font-medium text-xs" htmlFor={phoneId}>
            Phone
          </label>
          <Input id={phoneId} placeholder="Optional" {...register("phone")} />
        </div>
        <div className="grid gap-1.5">
          <label className="font-medium text-xs" htmlFor={addressId}>
            Address
          </label>
          <Input
            id={addressId}
            placeholder="Optional"
            {...register("address")}
          />
        </div>
        {error ? <p className="text-destructive text-xs">{error}</p> : null}
        <div className="flex justify-end gap-2 border-t pt-4">
          <Button
            nativeButton={false}
            render={<Link to="/service-providers" />}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Creating…" : "Create provider"}
          </Button>
        </div>
      </form>
    </NewEntityPage>
  );
}
