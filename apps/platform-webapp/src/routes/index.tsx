import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useId,
  useState,
} from "react";
import { z } from "zod/v4";

import { p } from "@/aspen/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const data = await orpc.getSession();
    if (data?.session && data?.user) {
      throw redirect({ to: "/dashboard" });
    }
    return data;
  },
  component: LoginPage,
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>("");
  const [loading, setLoading] = useState(false);
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
        navigate({ to: "/dashboard" });
      }

      setLoading(false);
    },
    [email, password, navigate],
  );

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-slate-50 p-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_-10%,oklch(0.92_0.05_262),transparent),radial-gradient(40%_35%_at_85%_20%,oklch(0.9_0.08_295),transparent)]"
      />
      <Card className="w-full max-w-md border-slate-200 bg-white/80 shadow-slate-900/5 shadow-xl backdrop-blur-xl">
        <CardHeader className="items-center pb-2 text-center">
          <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-500/30 shadow-lg">
            <span className="font-bold text-white text-xl">P</span>
          </span>
          <CardTitle className="font-semibold text-2xl tracking-tight">
            DMS Platform
          </CardTitle>
          <CardDescription className="text-sm">
            Sign in to the management console
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="mt-2 space-y-4" onSubmit={onSubmit}>
            {!!error && (
              <div className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 font-medium text-destructive text-xs">
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label
                  className="mb-1.5 block font-medium text-foreground text-xs"
                  htmlFor={emailId}
                >
                  Email
                </label>
                <Input
                  autoComplete="email"
                  className="h-9"
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
                  className="mb-1.5 block font-medium text-foreground text-xs"
                  htmlFor={passwordId}
                >
                  Password
                </label>
                <Input
                  autoComplete="current-password"
                  className="h-9"
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
              className="h-9 w-full text-sm"
              disabled={loading}
              size="lg"
              type="submit"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className="absolute right-4 bottom-4 text-slate-400 text-xs">
        © {new Date().getFullYear()} DMS Platform
      </p>
    </div>
  );
}
