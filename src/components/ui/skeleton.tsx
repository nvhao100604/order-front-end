import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent bg-gradient-to-br from-10% from-gray-200 to-80% to-gray-300 animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
