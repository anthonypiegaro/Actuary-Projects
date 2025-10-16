"use client"

import { Area, AreaChart } from "recharts"

import { type ChartConfig, ChartContainer } from "@/components/ui/chart"

import { Investment } from "./types"

export function InvestmentAreaChart({
  investment
}: {
  investment: Investment
}) {
  const chartData = investment.map(period => ({
    ...period,
    amount: period.principal + period.interest
  }))

  const chartConfig = {
    principal: {
      label: "Principal",
      color: "var(--chart-1)"
    },
    amount: {
      label: "Amount",
      color: "var(--chart-2)"
    }
  } satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig} className="min-h-50 w-full">
      <AreaChart accessibilityLayer data={chartData}>
      <defs>
        <linearGradient id="fillPrincipal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="var(--color-principal)" stopOpacity={0.8} />
          <stop offset="95%" stopColor="var(--color-principal)" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="var(--color-amount)" stopOpacity={0.8} />
          <stop offset="95%" stopColor="var(--color-amount)" stopOpacity={0} />
        </linearGradient>
      </defs>
        <Area dataKey="principal" stroke="var(--color-principal)" fillOpacity={1} fill="url(#fillPrincipal)" />
        <Area dataKey="amount" stroke="var(--color-amount)" fillOpacity={1} fill="url(#fillAmount)" />
      </AreaChart>
    </ChartContainer>
  )
}