"use client"

import * as React from "react"

import { cn} from "@/lib/utils"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "primary" | "secondary"
}

export function LoadingSpinner({
  size = "md",
  variant = "default",
  className,
  ...props
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
  }

  const variantClasses = {
    default: "border-t-foreground/20 border-foreground/60",
    primary: "border-t-primary/20 border-primary",
    secondary: "border-t-secondary/20 border-secondary",
  }

  return (
    <div
      className={ cn(
        "animate-spin rounded-full",
        sizeClasses[size],
        variantClasses[variant],
        className
      ) }
      { ...props }
    />
  )
}