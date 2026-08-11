import { Link, useMatches } from "@tanstack/react-router";
import { ChevronRight, Settings2 } from "lucide-react";
import { Fragment } from "react";

const breadcrumbLabels: Record<string, string> = {
  "/(tenant)/settings": "Settings",
  "/(tenant)/settings/access-history": "Access History",
  "/(tenant)/settings/audit-log": "Audit Log",
  "/(tenant)/settings/general": "General",
  "/(tenant)/settings/knowledge-base": "Knowledge Base",
  "/(tenant)/settings/preferences": "Preferences",
  "/(tenant)/settings/reports": "Reports",
  "/(tenant)/settings/roles": "Roles",
  "/(tenant)/settings/structure": "Organization Structure",
  "/(tenant)/settings/tickets": "Tickets",
  "/(tenant)/settings/users/": "Users",
  "/(tenant)/settings/users/$id/edit": "Edit",
  "/(tenant)/settings/users/new": "New user",
};

type Breadcrumb = {
  href: string;
  label: string;
};

type SettingsMatch = ReturnType<typeof useMatches>[number];

function resolveBreadcrumbLabel(match: SettingsMatch): string | null {
  const label = breadcrumbLabels[match.routeId];
  if (label) return label;

  if (match.routeId === "/(tenant)/settings/users/$id/") {
    const name = (
      match.loaderData as unknown as { name?: string } | null | undefined
    )?.name;
    return name ?? "User details";
  }

  return null;
}

function insertUsersCrumb(breadcrumbs: Breadcrumb[]) {
  if (breadcrumbs.some((crumb) => crumb.href === "/settings/users")) return;

  const needsUsers = breadcrumbs.some(
    (crumb, index) => index > 0 && crumb.href.startsWith("/settings/users/"),
  );
  if (!needsUsers) return;

  breadcrumbs.splice(1, 0, { href: "/settings/users", label: "Users" });
}

export function SettingsHeader() {
  const matches = useMatches();

  const breadcrumbs: Breadcrumb[] = [];

  for (const match of matches) {
    const label = resolveBreadcrumbLabel(match);
    if (label === null) continue;

    const rawHref = match.pathname;
    const href = rawHref === "/" ? rawHref : rawHref.replace(/\/+$/, "");
    if (breadcrumbs[breadcrumbs.length - 1]?.href === href) continue;

    breadcrumbs.push({ href, label });
  }

  insertUsersCrumb(breadcrumbs);

  return (
    <header className="sticky top-0 z-10 border-ash border-b bg-paper-white/80 backdrop-blur-md">
      <div className="flex h-14 items-center gap-2 px-4 sm:px-6">
        <Settings2 className="size-4 shrink-0 text-indigo-ink" />
        <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
          <ol className="flex min-w-0 items-center gap-1.5">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <Fragment key={crumb.href}>
                  {index > 0 ? (
                    <li
                      aria-hidden="true"
                      className="flex shrink-0 items-center"
                    >
                      <ChevronRight className="size-4 text-smoke" />
                    </li>
                  ) : null}
                  <li className={isLast ? "min-w-0" : "shrink-0"}>
                    {isLast ? (
                      <span
                        aria-current="page"
                        className="block truncate font-medium text-graphite"
                      >
                        {crumb.label}
                      </span>
                    ) : (
                      <Link
                        className="block truncate rounded px-1 py-0.5 text-smoke transition-colors hover:text-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-pulse/30"
                        to={crumb.href}
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                </Fragment>
              );
            })}
          </ol>
        </nav>
      </div>
    </header>
  );
}
