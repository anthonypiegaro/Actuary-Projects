"use client"

import { useState } from "react"

import { InvestmentCalculator } from "./investment-calculator"
import { InvestmentVisual } from "./investment-visual"

import { Investment } from "./types"

export function Wrapper() {
  const [investment, setInvestment] = useState<Investment>([])

  return (
    <>
      <InvestmentCalculator onInvestmentChange={setInvestment} />
      <InvestmentVisual investment={investment} />
    </>
  )
}