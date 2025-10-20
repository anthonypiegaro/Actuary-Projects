"use client"

import { useState } from "react"

import { InvestmentCalculator } from "./investment-calculator"
import { InvestmentVisual } from "./investment-visual"

import { Investment } from "./types"

export function Wrapper() {
  const [investment, setInvestment] = useState<Investment>([])

  return (
    <div className="pb-20">
      <InvestmentCalculator onInvestmentChange={setInvestment} />
      <InvestmentVisual investment={investment} />
    </div>
  )
}