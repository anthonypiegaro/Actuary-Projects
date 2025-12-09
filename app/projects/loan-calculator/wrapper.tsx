"use client"

import { useState } from "react"

import { LoanCalculator } from "./loan-calculator"
import { LoanSchedule } from "./loan-schedule"

import { AmortizationSchedule } from "./types"

export function Wrapper() {
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationSchedule>([])

  return (
    <div className="pb-20">
      <LoanCalculator onLoanChange={setAmortizationSchedule} />
      <LoanSchedule amortizationSchedule={amortizationSchedule}/>
    </div>
  )
}