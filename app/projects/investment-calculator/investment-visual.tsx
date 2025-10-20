"use client"

import { useState } from "react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { Investment } from "./types"
import { InvestmentAreaChart } from "./area-chart"

type Chart = "area" | "bar" | "pie"
const charts: Chart[] = ["area", "bar", "pie"]

export function InvestmentVisual({ 
  investment
}: {
  investment: Investment
}) {
  const [chart, setChart] = useState<Chart>("area")

  if (investment.length === 0) {
    return (
      <Card className="max-w-4xl mx-auto mt-10 h-75 max-sm:bg-transparent max-sm:border-transparent">
        {investment.length === 0 && <h2 className="text-4xl m-auto">Add an investment</h2>}
      </Card>
    )
  }

  return (
    <Card className="max-w-4xl mx-auto mt-10 px-1 lg:px-4 xl:px-8 max-sm:bg-transparent max-sm:border-transparent">
      <div className="flex border rounded-[18px] p-1 mx-auto">
        {charts.map(chartType => (
          <div
            key={chartType}
            className={cn("transition-all duration-300 cursor-pointer px-4 py-2 rounded-[17px] hover:bg-accent/80", chart === chartType && "bg-accent hover:bg-accent")}
            onClick={() => setChart(chartType)}
          >
            {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
          </div>
        ))}
      </div>
      {investment.length === 0 && <h2 className="text-4xl m-auto">Add an investment</h2>}
      {chart === "area" && <InvestmentAreaChart investment={investment} />}
    </Card>
  )
}