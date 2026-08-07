import { ShieldX } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md border-slate-200 text-center shadow-sm">
        <CardHeader className="items-center pt-10 pb-2 text-center">
          <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-amber-500/10">
            <ShieldX className="size-6 text-amber-600" />
          </span>
          <CardTitle className="text-lg">Access denied</CardTitle>
          <CardDescription className="max-w-sm text-sm">
            You don&apos;t have permission to view this resource. Contact your
            administrator if you believe this is a mistake.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10" />
      </Card>
    </div>
  );
}
