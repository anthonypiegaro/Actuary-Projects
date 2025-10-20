"use client"

import { 
  Pie, 
  PieChart,
  Label
} from "recharts"

import { 
  type ChartConfig, 
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

import { Investment } from "./types"

export function InvestmentPieChart({
  investment
}: {
  investment: Investment
}) {
  const chartData = [
    { type: "Principal", value: investment[investment.length - 1].principal, fill: "url(#fillPrincipal)" },
    { type: "Interest", value: investment[investment.length - 1].interest, fill: "url(#fillInterest)" },
  ]

  const amount = investment[investment.length - 1].principal + investment[investment.length - 1].interest

  const chartConfig = {
    interest: {
      label: "Interest",
      color: "var(--chart-2)"
    },
    principal: {
      label: "Principal",
      color: "var(--chart-1)"
    },
  } satisfies ChartConfig

  return (
    <>
      <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
        <PieChart accessibilityLayer data={chartData}>
          <defs>
            <linearGradient id="fillPrincipal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-principal)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-principal)" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillInterest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-interest)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-interest)" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Pie
                data={chartData}
                dataKey="value"
                nameKey="type"
                innerRadius={90}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className={cn(
                              "fill-foreground text-3xl font-bold",
                              amount >= 100_000 && "text-2xl",
                              amount >= 1_000_000 && "text-xl"
                            )}
                          >
                            ${amount.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Total
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
        </PieChart>
      </ChartContainer>
      <div className="flex justify-center gap-6 flex-wrap">
        <SmallLegendItem color="var(--chart-1)" name="Principal" value={investment[investment.length - 1].principal} />
        <SmallLegendItem color="var(--chart-2)" name="Interest" value={investment[investment.length - 1].interest} />
      </div>
    </>
  )
}

function SmallLegendItem({
  color,
  name,
  value
}: {
  color: string
  name: string
  value: number
}) {
  return (
    <div className="flex items-center gap-x-1 text-sm text-muted-foreground">
      <div style={{ background: color }} className="h-4 w-4 rounded-sm" />
      <div>{name}:</div>
      <div>${value.toLocaleString()}</div>
    </div>
  )
}