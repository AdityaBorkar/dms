import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding font-medium text-sm/normal whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-electric-blue/30 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default:
          "h-9 gap-1.5 px-5 text-sm has-data-[icon=inline-end]:pr-16 has-data-[icon=inline-start]:pl-16 [&_svg:not([class*='size-'])]:size-4",
        icon: "size-9 [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-10 [&_svg:not([class*='size-'])]:size-4",
        "icon-sm": "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        lg: "h-10 gap-1.5 px-6 text-sm has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5 [&_svg:not([class*='size-'])]:size-4",
        sm: "h-32 gap-1 px-16 text-xs has-data-[icon=inline-end]:pr-12 has-data-[icon=inline-start]:pl-12 [&_svg:not([class*='size-'])]:size-3.5",
        xs: "h-7 gap-1 rounded-full px-3 text-[0.6875rem] has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3",
      },
      variant: {
        default:
          "bg-midnight text-paper shadow-[var(--shadow-subtle-2)] hover:bg-carbon",
        destructive:
          "bg-coral/10 text-carbon hover:bg-coral/20 focus-visible:ring-coral/30",
        ghost:
          "text-smoke hover:bg-snow hover:text-ink aria-expanded:bg-snow aria-expanded:text-ink",
        link: "text-electric-blue underline-offset-4 hover:text-ink hover:underline",
        outline:
          "border-mist bg-paper text-ink hover:bg-snow aria-expanded:bg-snow",
        secondary:
          "bg-snow text-ink hover:bg-concrete aria-expanded:bg-concrete",
      },
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ className, size, variant }))}
      data-slot="button"
      {...props}
    />
  );
}

export { Button, buttonVariants };
