import { Construction } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TodoPage({
  title,
  tabs,
}: {
  title: string;
  tabs?: readonly string[];
}) {
  return (
    <main className="min-h-full bg-paper p-5 sm:p-32 lg:p-40">
      <div className="mx-auto max-w-6xl space-y-32">
        <PageHeader title={title} />
        {tabs && tabs.length > 0 ? (
          <Tabs className="w-fit border-mist border-b" defaultValue={tabs[0]}>
            <TabsList variant="line">
              {tabs.map((tab) => (
                <TabsTrigger key={tab} value={tab}>
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : null}
        <Card className="border-0 bg-snow">
          <CardHeader className="flex flex-col items-center justify-center gap-16 py-64 text-center">
            <span className="mb-3 flex size-14 items-center justify-center rounded-full bg-ice">
              <Construction className="size-6 text-electric-blue" />
            </span>
            <CardTitle className="text-subheading">Coming Soon</CardTitle>
            <CardDescription className="max-w-sm text-body">
              <span className="font-semibold text-ink">{title}</span> is not
              available yet. We are actively building this module — check back
              soon.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}
