import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Building2, Loader2 } from "lucide-react";
import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useId,
  useState,
} from "react";
import { object, optional, string } from "valibot";

import { p } from "@/aspen/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { env } from "@/env";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const data = await orpc.auth.getSession();
    if (data?.session && data?.user) {
      throw redirect({ to: "/dashboard" });
    }
    return data;
  },
  component: LoginPage,
  loader: async ({ location }) => {
    const redirectTo = new URL(
      location.href,
      "http://tenant-application.local",
    ).searchParams.get("redirect");
    const data = await orpc.organizations.bySubdomain().catch(() => ({
      organization: null,
      subdomain: null,
    }));
    if (!data.subdomain) {
      throw redirect({
        search: redirectTo ? { redirect: redirectTo } : {},
        to: "/account/organizations",
      });
    }
    return data;
  },
  validateSearch: object({ redirect: optional(string()) }),
});

function LoginPage() {
  const navigate = useNavigate();
  const data = Route.useLoaderData();
  const { redirect: redirectTo } = Route.useSearch();
  const { organization, subdomain } = data;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const emailId = useId();
  const passwordId = useId();

  const handleEmailChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
    [],
  );
  const handlePasswordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
    [],
  );

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      const { error } = await p.auth.client.signIn.email({ email, password });
      if (error) {
        setError(error.message ?? "Login failed");
      } else {
        const target =
          redirectTo?.startsWith("/") && !redirectTo.startsWith("//")
            ? redirectTo
            : "/dashboard";
        navigate({ to: target });
      }

      setLoading(false);
    },
    [email, password, navigate, redirectTo],
  );

  const showUnavailableMethod = useCallback((method: string) => {
    setError(`${method} sign-in is not configured for this workspace.`);
  }, []);
  const handleBackToOptions = useCallback(() => {
    setError(null);
    setShowEmailForm(false);
  }, []);
  const handleEmailOption = useCallback(() => {
    setError(null);
    setShowEmailForm(true);
  }, []);
  const handleGoogleOption = useCallback(
    () => showUnavailableMethod("Google"),
    [showUnavailableMethod],
  );
  const handleSamlOption = useCallback(
    () => showUnavailableMethod("SAML SSO"),
    [showUnavailableMethod],
  );
  const handlePasskeyOption = useCallback(
    () => showUnavailableMethod("Passkey"),
    [showUnavailableMethod],
  );

  if (subdomain && !organization) {
    const apexUrl = `${env.PUBLIC_WEB_SSL ? "https" : "http"}://${env.PUBLIC_WEB_DOMAIN}${env.PUBLIC_WEB_PORT ? `:${env.PUBLIC_WEB_PORT}` : ""}`;

    return (
      <main className="flex min-h-svh items-center justify-center bg-snow px-16 py-12 font-sans text-ink">
        <Card className="w-full max-w-sm border-0 p-6 text-center shadow-[var(--shadow-subtle)]">
          <span className="mx-auto mb-5 flex size-10 items-center justify-center rounded-full bg-ice text-ink">
            <Building2 className="size-5" />
          </span>
          <h1 className="font-semibold text-ink text-subheading tracking-[-0.03em]">
            Organization: {subdomain}
          </h1>
          <p className="mt-2 text-body-sm text-smoke">
            This organization does not exist or is no longer active.
          </p>
          <Button
            className="mt-6 w-full"
            nativeButton={false}
            render={<a href={apexUrl} />}
            size="lg"
          >
            Return to Global Sign-In Page
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-snow px-16 py-12 font-sans text-ink">
      <div className="w-full max-w-md rounded-3xl bg-paper p-6 shadow-[var(--shadow-subtle)] sm:p-10">
        <div className="flex flex-col items-center">
          <span className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-midnight text-paper">
            <Building2 className="size-5" />
          </span>
          <p className="mt-7 font-semibold text-electric-blue text-eyebrow uppercase tracking-[0.02em]">
            Secure workspace
          </p>
          <h1 className="mt-3 text-center font-semibold text-3xl text-ink tracking-[-0.03em]">
            Log in to {organization?.name ?? "Tenant Application"}
          </h1>
        </div>

        {showEmailForm ? (
          <form className="mt-5 space-y-16" onSubmit={onSubmit}>
            {!!error && (
              <Alert variant="destructive">
                <AlertCircle className="size-4 shrink-0" />
                <AlertDescription className="font-medium text-carbon">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <div>
                <Label
                  className="mb-1.5 block font-semibold text-[11px] text-smoke uppercase tracking-[0.02em]"
                  htmlFor={emailId}
                >
                  Email
                </Label>
                <Input
                  autoComplete="email"
                  className="h-11"
                  id={emailId}
                  name="email"
                  onChange={handleEmailChange}
                  placeholder="you@company.com"
                  required
                  type="email"
                  value={email}
                />
              </div>

              <div>
                <Label
                  className="mb-1.5 block font-semibold text-[11px] text-smoke uppercase tracking-[0.02em]"
                  htmlFor={passwordId}
                >
                  Password
                </Label>
                <Input
                  autoComplete="current-password"
                  className="h-11"
                  id={passwordId}
                  name="password"
                  onChange={handlePasswordChange}
                  required
                  type="password"
                  value={password}
                />
              </div>
            </div>

            <Button
              className="w-full"
              disabled={loading}
              size="lg"
              type="submit"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Continue"
              )}
            </Button>
            <Button
              className="block w-full py-1 text-center text-fog text-xs hover:text-ink"
              onClick={handleBackToOptions}
              size="xs"
              type="button"
              variant="ghost"
            >
              Back to sign-in options
            </Button>
          </form>
        ) : (
          <div className="mt-5 space-y-16">
            {!!error && (
              <Alert variant="destructive">
                <AlertCircle className="size-4 shrink-0" />
                <AlertDescription className="font-medium text-carbon">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            <Button
              className="w-full"
              onClick={handleGoogleOption}
              size="lg"
              type="button"
            >
              Continue with Google
            </Button>
            <Button
              className="w-full"
              onClick={handleEmailOption}
              size="lg"
              type="button"
              variant="secondary"
            >
              Continue with email
            </Button>
            <Button
              className="w-full"
              onClick={handleSamlOption}
              size="lg"
              type="button"
              variant="outline"
            >
              Continue with SAML SSO
            </Button>
            <Button
              className="w-full"
              onClick={handlePasskeyOption}
              size="lg"
              type="button"
              variant="outline"
            >
              Log in with passkey
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
