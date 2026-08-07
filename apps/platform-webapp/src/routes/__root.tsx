import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import { Devtools } from "@/components/devtools.tsx";
import { TooltipProvider } from "@/components/ui/tooltip";
import css from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    links: [{ href: css, rel: "stylesheet" }],
    meta: [
      { charSet: "utf-8" },
      { content: "width=device-width, initial-scale=1", name: "viewport" },
      { title: "Platform" },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-yellow-500!">
        <TooltipProvider>{children}</TooltipProvider>
        <Devtools />
        <Scripts />
      </body>
    </html>
  );
}
