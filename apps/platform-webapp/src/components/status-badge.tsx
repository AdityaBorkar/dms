import { cn } from "@/lib/utils";

type StatusTone = "default" | "success" | "warning" | "danger" | "info";

const toneClasses: Record<StatusTone, string> = {
  danger: "bg-red-500/10 text-red-700 ring-red-600/20 dark:text-red-400",
  default: "bg-muted text-muted-foreground",
  info: "bg-primary/10 text-primary ring-primary/20",
  success:
    "bg-emerald-500/10 text-emerald-700 ring-emerald-600/20 dark:text-emerald-400",
  warning:
    "bg-amber-500/10 text-amber-700 ring-amber-600/20 dark:text-amber-400",
};

function toneForStatus(status?: string): StatusTone {
  const s = status?.toLowerCase() ?? "";
  if (s.includes("active") || s.includes("enabled") || s === "ready") {
    return "success";
  }
  if (
    s.includes("inactive") ||
    s.includes("disabled") ||
    s.includes("suspended")
  ) {
    return "danger";
  }
  if (s.includes("pending") || s.includes("provision")) {
    return "warning";
  }
  return "default";
}

export function StatusBadge({ status }: { status?: string | null }) {
  const tone = toneForStatus(status ?? undefined);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-medium text-[11px] ring-1 ring-inset",
        toneClasses[tone],
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

export function EntityAvatar({
  name,
  className,
}: {
  name: string | null | undefined;
  className?: string;
}) {
  const safe = name ?? "?";
  const initials = safe
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/15 to-violet-500/15 font-semibold text-primary text-xs",
        className,
      )}
    >
      {initials || "?"}
    </span>
  );
}
