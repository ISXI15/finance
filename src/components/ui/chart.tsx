"use client"

import * as React from "react"
import { TooltipProps } from "recharts"

import { cn } from "@/lib/utils"

// ... (ChartTooltip component remains unchanged)

export function ChartContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  )
}