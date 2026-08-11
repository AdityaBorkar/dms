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
  loader: async () => {
    try {
      return await orpc.organizations.bySubdomain();
    } catch {
      return { organization: null, subdomain: null };
    }
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
      <div className="flex min-h-svh items-center justify-center bg-[#0d0d0d] p-4 text-[#e7e7e7]">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#151515] p-6 text-center shadow-2xl shadow-black/40">
          <span className="mx-auto mb-5 flex size-10 items-center justify-center rounded-full bg-[#e5e5e7] text-[#151515]">
            <Building2 className="size-5" />
          </span>
          <h1 className="font-medium text-lg tracking-tight">
            Organization: {subdomain}
          </h1>
          <p className="mt-2 text-[#a1a1a1] text-sm">
            This organization does not exist or is no longer active.
          </p>
          <a
            className="mt-6 flex h-11 w-full items-center justify-center rounded-full bg-[#6269d8] px-4 font-medium text-sm transition-colors hover:bg-[#7077e4]"
            href={apexUrl}
          >
            Return to Global Sign-In Page
          </a>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-[#0d0d0d] px-4 py-12 font-sans text-[#e7e7e7]">
      <div className="w-full max-w-72">
        <div className="flex flex-col items-center">
          <span className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-[#e5e5e7] bg-[repeating-linear-gradient(45deg,transparent_0_5px,#151515_5px_7px)]" />
          <h1 className="mt-9 font-medium text-lg tracking-tight">
            Log in to {organization?.name ?? "Tenant Application"}
          </h1>
        </div>

        {showEmailForm ? (
          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            {!!error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 font-medium text-red-200 text-xs">
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label
                  className="mb-1.5 block font-medium text-[#c9c9c9] text-xs"
                  htmlFor={emailId}
                >
                  Email
                </label>
                <Input
                  autoComplete="email"
                  className="h-11 rounded-xl border-white/10 bg-[#1b1b1b] px-3 text-[#e7e7e7] placeholder:text-[#777] focus-visible:border-[#6269d8] focus-visible:ring-[#6269d8]/30"
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
                  className="mb-1.5 block font-medium text-[#c9c9c9] text-xs"
                  htmlFor={passwordId}
                >
                  Password
                </label>
                <Input
                  autoComplete="current-password"
                  className="h-11 rounded-xl border-white/10 bg-[#1b1b1b] px-3 text-[#e7e7e7] focus-visible:border-[#6269d8] focus-visible:ring-[#6269d8]/30"
                  id={passwordId}
                  name="password"
                  onChange={handlePasswordChange}
                  required
                  type="password"
                  value={password}
                />
              </div>
            </div>

            <button
              className="flex h-11 w-full items-center justify-center rounded-full bg-[#6269d8] px-4 font-medium text-sm transition-colors hover:bg-[#7077e4] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
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
            </button>
            <button
              className="block w-full py-1 text-center text-[#a1a1a1] text-xs transition-colors hover:text-white"
              onClick={handleBackToOptions}
              type="button"
            >
              Back to sign-in options
            </button>
          </form>
        ) : (
          <div className="mt-5 space-y-4">
            {!!error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 font-medium text-red-200 text-xs">
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            )}
            <button
              className="flex h-11 w-full items-center justify-center rounded-full bg-[#6269d8] px-4 font-medium text-sm transition-colors hover:bg-[#7077e4]"
              onClick={handleGoogleOption}
              type="button"
            >
              Continue with Google
            </button>
            <button
              className="flex h-11 w-full items-center justify-center rounded-full bg-[#1b1b1b] px-4 font-medium text-[#e7e7e7] text-sm transition-colors hover:bg-[#242424]"
              onClick={handleEmailOption}
              type="button"
            >
              Continue with email
            </button>
            <button
              className="flex h-11 w-full items-center justify-center rounded-full bg-[#1b1b1b] px-4 font-medium text-[#e7e7e7] text-sm transition-colors hover:bg-[#242424]"
              onClick={handleSamlOption}
              type="button"
            >
              Continue with SAML SSO
            </button>
            <button
              className="flex h-11 w-full items-center justify-center rounded-full bg-[#1b1b1b] px-4 font-medium text-[#e7e7e7] text-sm transition-colors hover:bg-[#242424]"
              onClick={handlePasskeyOption}
              type="button"
            >
              Log in with passkey
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
