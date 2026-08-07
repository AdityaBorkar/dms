import { Construction } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TodoPage({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} />
      <Card className="border-slate-300 border-dashed bg-slate-50/50 shadow-none">
        <CardHeader className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-muted">
            <Construction className="size-6 text-muted-foreground" />
          </span>
          <CardTitle className="text-lg">
            Scheduled for Future Release
          </CardTitle>
          <CardDescription className="max-w-sm text-sm">
            <span className="font-medium">{title}</span> is not implemented yet.
            The team is actively building this module — check back soon.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
