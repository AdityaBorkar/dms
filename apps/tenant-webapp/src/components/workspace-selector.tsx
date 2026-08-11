import { Popover } from "@base-ui/react/popover";
import { Link } from "@tanstack/react-router";
import { Building2, Check, ChevronDown, Settings } from "lucide-react";

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
            <Popover.Title className="px-2 py-1.5 font-semibold text-muted-foreground text-xs">
              Switch workspace
            </Popover.Title>
            <div className="space-y-1">
              <Link
                className="flex items-center gap-3 rounded-lg bg-accent px-2.5 py-2 text-sm"
                to="/dashboard"
              >
                {organization?.logo ? (
                  <img
                    alt=""
                    className="size-8 rounded-md object-cover"
                    src={organization.logo}
                  />
                ) : (
                  <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 font-semibold text-primary text-xs uppercase">
                    {organizationName.slice(0, 1)}
                  </span>
                )}
                <span className="min-w-0 flex-1 truncate font-medium">
                  {organizationName}
                </span>
                <Check className="size-4 text-primary" />
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-accent"
                to="/settings/general"
              >
                <span className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <Settings className="size-4" />
                </span>
                <span className="flex-1 font-medium">Settings</span>
              </Link>
            </div>
            <Popover.Description className="mt-2 flex items-center gap-1.5 px-2 text-[11px] text-muted-foreground">
              <Building2 className="size-3.5" />
              Manage this workspace
            </Popover.Description>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
