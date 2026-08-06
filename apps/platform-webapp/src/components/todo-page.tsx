import { Construction } from "lucide-react";

import { Card } from "@/components/ui/card";

export function TodoPage({ title }: { title: string }) {
  return (
    <Card className="mx-auto max-w-2xl items-center justify-center p-12 text-center">
      <Construction className="mx-auto size-10 text-muted-foreground" />
      <h2 className="mt-4 font-semibold text-xl">{title}</h2>
      <p className="mt-2 text-muted-foreground text-sm">
        This page is a TODO — the implementation is not written yet.
      </p>
    </Card>
  );
}
