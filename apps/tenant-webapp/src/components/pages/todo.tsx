import { Construction } from "lucide-react";
import type { MouseEvent } from "react";
import { useCallback, useState } from "react";

import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TodoPage({
  title,
  tabs,
}: {
  title: string;
  tabs?: readonly string[];
}) {
  const [activeTab, setActiveTab] = useState(tabs?.[0]);
  const pageId = title.toLowerCase().replaceAll(" ", "-");
  const activeTabId = activeTab
    ? `${pageId}-${activeTab.toLowerCase().replaceAll(" ", "-")}`
    : undefined;
  const handleTabClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setActiveTab(event.currentTarget.dataset.tab);
  }, []);

  return (
    <main className="min-h-svh bg-background p-4 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader title={title} />
        {tabs && tabs.length > 0 ? (
          <div
            aria-label={`${title} sections`}
            className="flex gap-6 overflow-x-auto border-border border-b"
            role="tablist"
          >
            {tabs.map((tab) => {
              const tabId = `${pageId}-${tab.toLowerCase().replaceAll(" ", "-")}`;

              return (
                <button
                  aria-controls={`${pageId}-panel`}
                  aria-selected={activeTab === tab}
                  className="-mb-px shrink-0 border-transparent border-b-2 px-1 pb-3 font-medium text-muted-foreground text-sm transition-colors hover:border-primary/40 hover:text-foreground aria-selected:border-primary aria-selected:text-primary"
                  id={tabId}
                  key={tab}
                  onClick={handleTabClick}
                  role="tab"
                  type="button"
                >
                  {tab}
                </button>
              );
            })}
          </div>
        ) : null}
        <Card
          aria-labelledby={activeTabId}
          className="border-slate-300 border-dashed bg-slate-50/50 shadow-none"
          id={activeTabId ? `${pageId}-panel` : undefined}
          role={activeTabId ? "tabpanel" : undefined}
        >
          <CardHeader className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-muted">
              <Construction className="size-6 text-muted-foreground" />
            </span>
            <CardTitle className="text-lg">Coming Soon</CardTitle>
            <CardDescription className="max-w-sm text-sm">
              <span className="font-medium">{title}</span> is not available yet.
              We are actively building this module — check back soon.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}
