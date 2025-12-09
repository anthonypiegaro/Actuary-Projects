"use client"

import { Card } from "@/components/ui/card"

import { AmortizationSchedule } from "./types"
import { formatUSD } from "./utils"

export function LoanSchedule({
  amortizationSchedule,
}: {
  amortizationSchedule: AmortizationSchedule
}) {
  if (amortizationSchedule.length === 0) {
    return (
      <Card className="max-w-4xl mx-auto mt-10 px-1 lg:px-4 xl:px-8 max-sm:bg-transparent max-sm:border-transparent">
        <h1 className="text-center text-4xl">
          Add loan details.
        </h1>
      </Card>
    )
  }
  const totals = amortizationSchedule.reduce((acc, payment) => {
    acc.interest = acc.interest + payment.interest
    acc.principal = acc.principal + payment.principal
    return acc
  }, { interest: 0, principal: 0 })

  const totalPaid = formatUSD(Math.round((totals.interest + totals.principal) * 100) / 100)
  const totalInterest = formatUSD(Math.round(totals.interest * 100) / 100)
  const totalPrincipal = formatUSD(Math.round(totals.principal * 100) / 100)

  return (
    <Card className="max-sm:max-w-full max-w-4xl overflow-scroll scrollbar-hidden mx-auto mt-10 px-1 lg:px-4 xl:px-8 max-sm:bg-transparent max-sm:border-transparent">
      <table>
        <thead>
          <tr className="md:text-2xl [&>*]:font-normal [&>*]:text-left">
            <th>Date</th>
            <th>Payment</th>
            <th>Principal Paid</th>
            <th>Interest Paid</th>
            <th>Outstanding Balance</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {
            amortizationSchedule.map((payment, index) => (
              <tr key={index} className="[&>*]:pt-3 [&>*]:px-1 pb-2 md:text-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition duration-50">
                <td>{payment.date ? formatDateMMYY(payment.date) : index}</td>
                <td>{formatUSD(payment.payment)}</td>
                <td>{formatUSD(payment.principal)}</td>
                <td>{formatUSD(payment.interest)}</td>
                <td>{formatUSD(payment.outstandingBalance)}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <div className="my-4 w-full flex flex-wrap justify-center gap-4">
        <QuickStat label={"Total Principal"} value={totalPrincipal} />
        <QuickStat label={"Total Interest"} value={totalInterest} />
        <QuickStat label={"Total Paid"} value={totalPaid} />
      </div>
      <div className="text-muted-foreground text-sm">
        Note<span className="text-destructive">*</span> Totals may be off by a penny or few due to rounding errors.
      </div>
    </Card>
  )
}

function QuickStat({
  value,
  label
}: {
  value: string
  label: string
}) {
  return (
    <div className="bg-accent rounded-lg min-w-35 p-4">
      <div className="text-2xl font-medium leading-none">
        {value}
      </div>
      <div className="text-sm">
        {label}
      </div>
    </div>
  )
}

function formatDateMMYY(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = String(date.getFullYear()).slice(-2)
  return `${month}/${year}`
}