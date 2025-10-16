"use client"

import { useState } from "react"

import { Investment } from "./types"
import { InvestmentAreaChart } from "./area-chart"

type Chart = "area" | "bar" | "pie"

export function InvestmentVisual({ 
  investment
}: {
  investment: Investment
}) {
  const [chart, setChart] = useState<Chart>("area")

  return (
    <>
      {chart === "area" && <InvestmentAreaChart investment={investment} /> }
    </>
  )
}