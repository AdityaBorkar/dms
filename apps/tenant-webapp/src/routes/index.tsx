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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      <main className="flex min-h-svh items-center justify-center bg-paper-white px-4 py-12 font-sans text-iron">
        <div className="w-full max-w-sm rounded-lg border border-ash bg-paper-white p-6 text-center shadow-[var(--shadow-subtle-8)]">
          <span className="mx-auto mb-5 flex size-10 items-center justify-center rounded-full bg-bone text-graphite">
            <Building2 className="size-5" />
          </span>
          <h1 className="font-medium text-graphite text-lg tracking-[-0.048px]">
            Organization: {subdomain}
          </h1>
          <p className="mt-2 text-sm text-steel">
            This organization does not exist or is no longer active.
          </p>
          <a
            className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-violet-pulse px-5 font-medium text-sm text-white shadow-[var(--shadow-subtle),rgba(224,201,255,0.25)_0_0_16px_2px] transition-colors hover:bg-violet-pulse/90"
            href={apexUrl}
          >
            Return to Global Sign-In Page
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-paper-white px-4 py-12 font-sans text-iron">
      <div className="w-full max-w-72">
        <div className="flex flex-col items-center">
          <span className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-graphite text-paper-white">
            <Building2 className="size-5" />
          </span>
          <h1 className="mt-9 font-medium text-graphite text-lg tracking-[-0.048px]">
            Log in to {organization?.name ?? "Tenant Application"}
          </h1>
        </div>

        {showEmailForm ? (
          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            {!!error && (
              <div className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 font-medium text-destructive text-xs">
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label
                  className="mb-1.5 block font-medium text-slate text-xs"
                  htmlFor={emailId}
                >
                  Email
                </label>
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
                <label
                  className="mb-1.5 block font-medium text-slate text-xs"
                  htmlFor={passwordId}
                >
                  Password
                </label>
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
            <button
              className="block w-full py-1 text-center text-smoke text-xs transition-colors hover:text-graphite"
              onClick={handleBackToOptions}
              type="button"
            >
              Back to sign-in options
            </button>
          </form>
        ) : (
          <div className="mt-5 space-y-4">
            {!!error && (
              <div className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 font-medium text-destructive text-xs">
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </div>
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
