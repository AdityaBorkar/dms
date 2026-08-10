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
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Icon className="size-5 text-muted-foreground" />
            <span className="rounded-md bg-primary/10 px-2 py-0.5 font-semibold text-[10px] text-primary uppercase">
              {domain}
            </span>
          </div>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
