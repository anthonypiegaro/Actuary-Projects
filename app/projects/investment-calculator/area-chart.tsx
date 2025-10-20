"use client"

import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  XAxis 
} from "recharts"

import { 
  type ChartConfig, 
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"

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

  console.log(chartData)

  const chartConfig = {
    amount: {
      label: "Amount",
      color: "var(--chart-2)"
    },
    interest: {
      label: "Interest"
    },
    principal: {
      label: "Principal",
      color: "var(--chart-1)"
    },
  } satisfies ChartConfig

  return (
    <>
      <div className="my-4 w-full flex flex-wrap justify-center gap-4">
        <QuickStat label={"Principal"} value={investment[investment.length - 1].principal} />
        <QuickStat label={"Interest"} value={investment[investment.length - 1].interest} />
        <QuickStat label={"Total"} value={chartData[chartData.length - 1].amount} />
      </div>
      <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
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
          <CartesianGrid vertical={false} />
          <XAxis 
            dataKey="year"
            tickLine={false}
            tickMargin={10}
          />
          <ChartTooltip content={<ChartTooltipContent label="Value" />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Area dataKey="amount" stroke="var(--color-amount)" fillOpacity={1} fill="url(#fillAmount)" />
          <Area dataKey="interest" fillOpacity={0} strokeOpacity={0} />
          <Area dataKey="principal" stroke="var(--color-principal)" fillOpacity={1} fill="url(#fillPrincipal)" />
        </AreaChart>
      </ChartContainer>
    </>
  )
}

function QuickStat({
  value,
  label
}: {
  value: number
  label: string
}) {
  return (
    <div className="bg-accent rounded-lg min-w-35 p-4">
      <div className="text-2xl font-medium leading-none">
        ${value.toLocaleString()}
      </div>
      <div className="text-sm">
        {label}
      </div>
    </div>
  )
}