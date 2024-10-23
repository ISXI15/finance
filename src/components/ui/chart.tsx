"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ChartContainerProps {
  children: React.ReactNode
  className?: string
}

export function ChartContainer({ children, className }: ChartContainerProps) {
  return (
    <div className={cn("w-full h-full", className)}>
      {children}
    </div>
  )
}