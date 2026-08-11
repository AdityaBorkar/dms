import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type NewEntityPageProps = {
  title: string;
  description: string;
  domain: string;
  backHref: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
};

export function NewEntityPage({
  title,
  description,
  domain,
  backHref,
  icon: Icon,
  children,
}: NewEntityPageProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        actions={
          <Button
            nativeButton={false}
            render={<Link to={backHref} />}
            variant="outline"
          >
            <ArrowLeft /> Back
          </Button>
        }
        description={description}
        title={title}
      />
      <Card className="shadow-subtle">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Icon className="size-5 text-steel" />
            <span className="rounded-full bg-lavender-wash px-2.5 py-0.5 font-medium text-[11px] text-indigo-ink uppercase">
              {domain}
            </span>
          </div>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
