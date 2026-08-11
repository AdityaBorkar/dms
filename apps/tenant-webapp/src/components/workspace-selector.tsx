import { Popover } from "@base-ui/react/popover";
import { Link } from "@tanstack/react-router";
import {
  Building2,
  ChevronDown,
  ExternalLink,
  Settings,
  UserRound,
} from "lucide-react";

import { BASE_URL } from "@/lib/utils";

type Organization = {
  logo: string | null;
  name: string;
};

export function WorkspaceSelector({
  organization,
}: {
  organization: Organization | null;
}) {
  const organizationName = organization
    ? organization.name
    : "Your organization";

  return (
    <Popover.Root>
      <Popover.Trigger className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
        {organization?.logo ? (
          <img
            alt={`${organizationName} logo`}
            className="size-9 rounded-lg object-cover"
            src={organization.logo}
          />
        ) : (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary font-semibold text-sidebar-primary-foreground text-sm uppercase shadow-sm">
            {organizationName.slice(0, 1)}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-sm">
            {organizationName}
          </span>
          <span className="mt-0.5 block truncate text-sidebar-foreground/55 text-xs">
            Workspace
          </span>
        </span>
        <ChevronDown className="size-4 shrink-0 text-sidebar-foreground/55" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner className="z-50" sideOffset={8}>
          <Popover.Popup className="w-64 rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-xl outline-none">
            <div className="space-y-0.5">
              <Link
                aria-label="Organization Settings"
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                to="/settings"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
                  <Settings className="size-3.5" />
                </span>
                <span className="flex-1">Organization Settings</span>
              </Link>
              <Link
                aria-label="Account Settings (opens in a new tab)"
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                rel="noreferrer"
                target="_blank"
                // @ts-expect-error URL Override
                to={`${BASE_URL}/account/settings`}
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
                  <UserRound className="size-3.5" />
                </span>
                <span className="flex-1">Account Settings</span>
                <ExternalLink className="size-3 text-muted-foreground" />
              </Link>
              <Link
                aria-label="All Organizations (opens in a new tab)"
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                rel="noreferrer"
                target="_blank"
                // @ts-expect-error URL Override
                to={`${BASE_URL}/account/organizations`}
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
                  <Building2 className="size-3.5" />
                </span>
                <span className="flex-1">All Organizations</span>
                <ExternalLink className="size-3 text-muted-foreground" />
              </Link>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
