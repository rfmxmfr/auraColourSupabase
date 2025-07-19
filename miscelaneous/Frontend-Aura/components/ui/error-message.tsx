
"use client"

import { AlertCircle, XCircle } from "lucide-react"
import * as React from "react"

import { cn} from "@/lib/utils"
import { Button } from "./button"


interface ErrorMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  message: string
  variant?: "warning" | "error"
  dismissable?: boolean
  onDismiss?: () => void
}

export function ErrorMessage({
  title,
  message,
  variant = "error",
  dismissable = true,
  onDismiss,
  className,
  ...props
}: ErrorMessageProps) {
  const [visible, setVisible] = React.useState(true)

  const handleDismiss = () => {
    setVisible(false)
    onDismiss?.()
  }

  if (!visible) return null

  return (
    <div
      className={ cn(
        "flex items-start gap-3 rounded-md p-4",
        variant === "error" ? "bg-destructive/15 text-destructive" : "bg-amber-100 text-amber-800",
        className
      ) }
      role="alert"
      { ...props }
    >
      { variant === "error" ? (
        <XCircle className="h-5 w-5 shrink-0" />
      ) : (
        <AlertCircle className="h-5 w-5 shrink-0" />
      ) }
      <div className="flex-1">
        { title && <h5 className="font-medium">{ title }</h5> }
        <p className="text-sm">{ message }</p>
      </div>
      { dismissable && (
        <Button
          variant="ghost"
          size="icon"
          className="h-auto p-0 hover:bg-transparent"
          onClick={ handleDismiss }
        >
          <span className="sr-only">Dismiss</span>
          <XCircle className="h-4 w-4" />
        </Button>
      ) }
    </div>
  )
}
