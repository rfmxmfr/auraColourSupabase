"use client"

import * as React from "react"

import { cn} from "@/lib/utils"

import { LoadingSpinner } from "./loading-spinner"

interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "overlay" | "inline" | "skeleton"
  text?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingState({
  variant = "inline",
  text = "Loading...",
  size = "md",
  className,
  ...props
}: LoadingStateProps) {
  if (variant === "overlay") {
    return (
      <div
        className={ cn(
          "absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10",
          className
        ) }
        { ...props }
      >
        <LoadingSpinner size={ size } />
        { text && <p className="mt-2 text-sm font-medium">{ text }</p> }
      </div>
    )
  }

  if (variant === "skeleton") {
    return (
      <div
        className={ cn(
          "w-full h-full min-h-[100px] rounded-md bg-muted animate-pulse",
          className
        ) }
        { ...props }
      />
    )
  }

  // Default: inline
  return (
    <div
      className={ cn(
        "flex items-center justify-center gap-2 py-4",
        className
      ) }
      { ...props }
    >
      <LoadingSpinner size={ size } />
      { text && <p className="text-sm font-medium">{ text }</p> }
    </div>
  )
}