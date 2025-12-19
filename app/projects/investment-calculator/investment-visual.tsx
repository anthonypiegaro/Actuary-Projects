"use client"

import { useState } from "react"
import { InfoIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

import { Investment } from "./types"
import { InvestmentAreaChart } from "./area-chart"
import { InvestmentBarChart } from "./bar-chart"
import { InvestmentPieChart } from "./pie-chart"

type Chart = "area" | "bar" | "pie"
const charts: Chart[] = ["area", "bar", "pie"]

export function InvestmentVisual({ 
  investment
}: {
  investment: Investment
}) {
  const [chart, setChart] = useState<Chart>("area")
  const [showRealRate, setShowRealRate] = useState(false)

  if (investment.length === 0) {
    return (
      <Card className="max-w-4xl mx-auto mt-10 h-75 max-sm:bg-transparent max-sm:border-transparent">
        {investment.length === 0 && <h2 className="text-4xl m-auto">Add an investment</h2>}
      </Card>
    )
  }

  const chartData = investment.map(period => ({
    year: period.year,
    principal: showRealRate ? period.realPrincipal : period.nominalPrincipal,
    interest: showRealRate ? period.realInterest : period.nominalInterest,
    amount: showRealRate ? period.realPrincipal + period.realInterest : period.nominalPrincipal + period.nominalInterest
  }))

  return (
    <Card className="relative max-w-4xl mx-auto mt-10 px-1 lg:px-4 xl:px-8 max-sm:bg-transparent max-sm:border-transparent">
      <div className="absolute top-6 right-6 flex items-center space-x-2">
        <Switch id="real-rate" onCheckedChange={checked => setShowRealRate(checked)} />
        <Label htmlFor="real-rate">Real Rate</Label>
        <HoverCard openDelay={100} closeDelay={150}>
          <HoverCardTrigger>
            <InfoIcon className="h-3.5 w-3.5" />
          </HoverCardTrigger>
          <HoverCardContent
            side="right"
            align="start"
            className="w-64"
          >
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Real Rate</h4>
              <p className="text-sm text-muted-foreground">
                Real rate reflects your investment’s growth after removing the effects of inflation. It shows the increase in actual purchasing power over time.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
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
      {chart === "area" && <InvestmentAreaChart chartData={chartData} />}
      {chart === "bar" && <InvestmentBarChart chartData={chartData} />}
      {chart === "pie" && <InvestmentPieChart principal={chartData[chartData.length - 1].principal} interest={chartData[chartData.length - 1].interest} />}
    </Card>
  )
}