import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useId, useState } from "react";
import { z } from "zod/v4";

import { p } from "@/aspen/client";
import { getSession } from "@/rpc/get-session";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const data = await getSession();
    console.log({ data });
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

  async function handleSubmit(e: FormEvent) {
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
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="font-bold text-3xl text-gray-900">Platform</h1>
          <p className="mt-2 text-gray-500 text-sm">Sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!!error && (
            <div className="rounded-md bg-red-50 p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                className="block font-medium text-gray-700 text-sm"
                htmlFor={emailId}
              >
                Email
              </label>
              <input
                autoComplete="email"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                id={emailId}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                value={email}
              />
            </div>

            <div>
              <label
                className="block font-medium text-gray-700 text-sm"
                htmlFor={passwordId}
              >
                Password
              </label>
              <input
                autoComplete="current-password"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                id={passwordId}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                value={password}
              />
            </div>
          </div>

          <button
            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-sm text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={loading}
            type="submit"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
