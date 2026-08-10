import { CircleAlert } from "lucide-react";
import { useCallback } from "react";

import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ErrorPage() {
  const reload = useCallback(() => window.location.reload(), []);

  return (
    <div className="space-y-6">
      <PageHeader description="Something went wrong." title="Error" />
      <Card className="border-destructive/20 shadow-sm">
        <CardHeader className="items-center pt-10 pb-2 text-center">
          <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-destructive/10">
            <CircleAlert className="size-6 text-destructive" />
          </span>
          <CardTitle className="text-lg">Something went wrong</CardTitle>
          <CardDescription className="max-w-sm text-sm">
            An unexpected error occurred while loading this page. Please try
            again.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-10">
          <button
            className="rounded-md bg-primary px-3.5 py-1.5 font-medium text-primary-foreground text-sm hover:bg-primary/90"
            onClick={reload}
            type="button"
          >
            Reload page
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
