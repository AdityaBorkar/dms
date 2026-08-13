import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-12">
      <div className="min-w-0">
        <p className="mb-2 font-semibold text-electric-blue text-eyebrow uppercase tracking-[0.02em]">
          Workspace
        </p>
        <h1 className="font-semibold text-3xl text-ink tracking-[-0.03em] sm:text-heading">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-body-sm text-smoke">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
