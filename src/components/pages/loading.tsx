import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function LoadingPage() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-paper p-6">
      <Card className="border-0 bg-snow shadow-[var(--shadow-subtle)]">
        <CardContent className="flex items-center gap-3 px-32 py-6">
          <Loader2 className="size-5 animate-spin text-electric-blue" />
          <span className="font-semibold text-ink text-sm">Loading...</span>
        </CardContent>
      </Card>
    </div>
  );
}
