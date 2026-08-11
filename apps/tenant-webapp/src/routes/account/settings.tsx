import { createFileRoute } from "@tanstack/react-router";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/account/settings")({
  component: RouteComponent,
});

const sections = [
  { description: "Your name and contact details.", title: "Profile" },
  { description: "Interface preferences and defaults.", title: "Preferences" },
  { description: "Password and authentication settings.", title: "Security" },
  { description: "Manage active sessions and devices.", title: "Sessions" },
];

function RouteComponent() {
  return (
    <main className="bg-paper-white p-4 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="font-medium text-2xl text-graphite tracking-[-0.048px]">
            Account settings
          </h1>
          <p className="mt-1 text-sm text-steel">
            Manage your personal account and preferences.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {sections.map((section) => (
            <Card
              className="shadow-[var(--shadow-subtle-4)]"
              key={section.title}
            >
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
