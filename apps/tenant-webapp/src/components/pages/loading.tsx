import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function LoadingPage() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex items-center gap-3 px-8 py-6">
          <Loader2 className="size-5 animate-spin text-primary" />
          <span className="font-medium text-foreground text-sm">Loading…</span>
        </CardContent>
      </Card>
    </div>
  );
}
