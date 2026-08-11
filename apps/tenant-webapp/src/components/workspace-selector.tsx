import { Link } from "@tanstack/react-router";
import {
  Building2,
  ChevronDown,
  ExternalLink,
  Settings,
  UserRound,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
    <Popover>
      <PopoverTrigger className="flex w-full min-w-0 items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-pulse/30">
        {organization?.logo ? (
          <Avatar className="size-9 rounded-lg">
            <AvatarImage
              alt={`${organizationName} logo`}
              className="rounded-lg object-cover"
              src={organization.logo}
            />
            <AvatarFallback className="rounded-lg bg-violet-pulse font-semibold text-sm text-white uppercase shadow-[var(--shadow-subtle),rgba(224,201,255,0.25)_0_0_16px_2px]">
              {organizationName.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="size-9">
            <AvatarFallback className="bg-violet-pulse font-semibold text-sm text-white uppercase shadow-[var(--shadow-subtle),rgba(224,201,255,0.25)_0_0_16px_2px]">
              {organizationName.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium text-graphite text-sm">
            {organizationName}
          </span>
          <span className="mt-0.5 block truncate text-smoke text-xs">
            Workspace
          </span>
        </span>
        <ChevronDown className="size-4 shrink-0 text-smoke" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-2" sideOffset={8}>
        <div className="space-y-0.5">
          <Link
            aria-label="Organization Settings"
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-bone"
            to="/settings"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded bg-lavender-wash text-indigo-ink">
              <Settings className="size-3.5" />
            </span>
            <span className="flex-1">Organization Settings</span>
          </Link>
          <Link
            aria-label="Account Settings (opens in a new tab)"
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-bone"
            rel="noreferrer"
            target="_blank"
            // @ts-expect-error URL Override
            to={`${BASE_URL}/account/settings`}
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded bg-lavender-wash text-indigo-ink">
              <UserRound className="size-3.5" />
            </span>
            <span className="flex-1">Account Settings</span>
            <ExternalLink className="size-3 text-smoke" />
          </Link>
          <Link
            aria-label="All Organizations (opens in a new tab)"
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-bone"
            rel="noreferrer"
            target="_blank"
            // @ts-expect-error URL Override
            to={`${BASE_URL}/account/organizations`}
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded bg-lavender-wash text-indigo-ink">
              <Building2 className="size-3.5" />
            </span>
            <span className="flex-1">All Organizations</span>
            <ExternalLink className="size-3 text-smoke" />
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
