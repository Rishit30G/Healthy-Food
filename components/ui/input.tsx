import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
      type={type}
      className={cn(
        "flex h-10 w-full outfit-medium text-green-700 bg-background px-3 py-2 text-base placeholder:text-green-700/60 md:text-sm rounded-md focus:outline-none",
        className
      )}

      ref={ref}
      {...props}
    />
    )
  }
)
Input.displayName = "Input"

export { Input }
