"use client"

import { ChangeEvent, useState } from "react"
import { ChevronDownIcon, InfoIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

import { DatePicker } from "./date-picker"

import { AmortizationSchedule, CompoundingFrequency, PaymentFrequency } from "./types"
import { getEffectiveRate, getPayment } from "./utils"

const compoundingFrequencies: { frequency: CompoundingFrequency, description: string }[] = [
  {
    frequency: "annual",
    description: "Interest is compounded once per year.",
  },
  {
    frequency: "semiannual",
    description: "Interest is compounded twice per year (every 6 months).",
  },
  {
    frequency: "quarterly",
    description: "Interest is compounded four times per year (every 3 months).",
  },
  {
    frequency: "monthly",
    description: "Interest is compounded 12 times per year (once each month).",
  },
  {
    frequency: "daily",
    description: "Interest is compounded every day of the year (365 times).",
  },
  {
    frequency: "continuous",
    description: "Interest is compounded continuously, using the natural exponential function.",
  }
]

export function LoanCalculator({
  onLoanChange,
}: {
  onLoanChange: (amortizationSchedule: AmortizationSchedule) => void
}) {
  const [loanAmount, setLoanAmount] = useState<string>("")
  const [loanAmountError, setLoanAmountError] = useState<null | string>(null)
  const [interestRate, setInterestRate] = useState<string>("")
  const [interestRateError, setInterestRateError] = useState<null | string>(null)
  const [compoundingFrequency, setCompoundingFrequency] = useState<CompoundingFrequency>("annual")
  const [term, setTerm] = useState<string>("")
  const [termError, setTermError] = useState<null | string>(null)
  const [paymentFrequency, setPaymentFrequency] = useState<PaymentFrequency>("monthly")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())

  const handleLoanAmountInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    if (value === "" || !isNaN(Number(value.replace(/,/g, "")))) {
      setLoanAmountError(null)
    }

    setLoanAmount(value)
  }

  const handleLoanAmountInputBlur = () => {
    if (loanAmount !== "" && isNaN(Number(loanAmount.replace(/,/g, "")))) {
      setLoanAmountError("Initial principal must be a valid number.")
    }
  }

  const handleInterestRateInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    if (value === "" || !isNaN(Number(value))) {
      setInterestRateError(null)
    }

    setInterestRate(value)
  }

  const handleInterestRateInputBlur = () => {
    if (interestRate !== "" && isNaN(Number(interestRate))) {
      setInterestRateError("Interest rate must be a valid number.")
    }
  }

  const handleTermInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    if (value === "" || !isNaN(Number(value))) {
      setTermError(null)
    }

    setTerm(value)
  }

  const handleTermInputBlur = () => {
    if (term !== "" && isNaN(Number(term))) {
      setTermError("Length of investment must be a valid number.")
    }
  }

  const formValid = (
    loanAmount !== "" && !isNaN(Number(loanAmount.replace(/,/g, "")))
    && interestRate !== "" && !isNaN(Number(interestRate))
    && term !== "" && !isNaN(Number(term))
  )

  const handleLoanChange = () => {
    if (!formValid) {
      return
    }

    let outstandingBalance = Number(loanAmount.replace(/,/g, ""))
    const nominalRate = Number(interestRate) / 100
    const time = paymentFrequency === "annual" ? Number(term) : Number(term) * 12
    const date = startDate ? new Date(startDate) : undefined

    const effectiveAnnualRate = getEffectiveRate({
      nominalRate,
      frequency: compoundingFrequency
    })

    const effectiveRate = paymentFrequency === "annual" ? effectiveAnnualRate : Math.pow(1 + effectiveAnnualRate, 1/12) - 1

    const payment = getPayment({
      amount: outstandingBalance,
      term: time,
      effectiveRate
    })

    const amortizationSchedule: AmortizationSchedule = []

    amortizationSchedule.push({
      date: date ? new Date(date) : undefined,
      payment: 0,
      principal: 0,
      interest: 0,
      outstandingBalance: outstandingBalance
    })

    for (let i = 0; i < time; i++) {
      const interest = outstandingBalance * effectiveRate
      const principal = payment - interest
      outstandingBalance = outstandingBalance - principal
      
      if (date) {
        if (paymentFrequency === "annual") {
          date.setFullYear(date.getFullYear() + 1)
        } else {
          date.setMonth(date.getMonth() + 1)
        }
      }

      const paymentDate = date ? new Date(date) : undefined

      amortizationSchedule.push({
        date: paymentDate,
        payment: Math.round(payment * 100) / 100,
        principal: Math.round(principal * 100) / 100,
        interest: Math.round(interest * 100) / 100,
        outstandingBalance: Math.round(outstandingBalance * 100) / 100
      })
    }

    onLoanChange(amortizationSchedule)
  }

  return (
    <Card className="max-w-2xl mx-auto mt-30 max-sm:bg-transparent max-sm:border-transparent">
      <CardHeader>
        <CardTitle>Loan Calculator</CardTitle>
        <CardDescription>
          View an estimated amortization schedule by entering your loan amount, interest rate, and term.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-2">
          <Label>Loan Amount</Label>
          {loanAmountError && <p className="text-sm text-destructive">{loanAmountError}</p>}
          <InputGroup className="max-w-sm">
            <InputGroupAddon>
              <InputGroupText>$</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              aria-invalid={loanAmountError ? true : false}
              placeholder="0.00" 
              value={loanAmount} 
              onChange={handleLoanAmountInputChange}
              onBlur={handleLoanAmountInputBlur}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>USD</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="flex flex-col gap-y-2">
          <Label>
            Interest Rate
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
                    <h4 className="text-sm font-medium">Interest Rate</h4>
                    <p className="text-sm text-muted-foreground">
                      The interest rate represents the percentage of return earned (or paid) on an investment or loan over a specific period
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
          </Label>
          <InputGroup className="max-w-sm">
              <InputGroupAddon>
                <InputGroupText>%</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                aria-invalid={interestRateError ? true : false}
                placeholder="0.0" 
                value={interestRate} 
                onChange={handleInterestRateInputChange}
                onBlur={handleInterestRateInputBlur}
              />
              <InputGroupAddon align="inline-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <InputGroupButton variant="ghost" className="!pr-1.5 text-xs">
                      {compoundingFrequency} <ChevronDownIcon className="size-3" />
                    </InputGroupButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {compoundingFrequencies.map(freq => (
                      <HoverCard key={freq.frequency} openDelay={100} closeDelay={150}>
                        <HoverCardTrigger asChild>
                          <DropdownMenuItem
                            className={cn(compoundingFrequency === freq.frequency && "bg-accent")}
                            onClick={() => setCompoundingFrequency(freq.frequency)}
                          >
                            {freq.frequency}
                          </DropdownMenuItem>
                        </HoverCardTrigger>
                        <HoverCardContent
                          side="right"
                          align="start"
                          className="w-64 max-sm:hidden"
                        >
                          <div className="space-y-1">
                            <h4 className="text-sm font-medium">{freq.frequency}</h4>
                            <p className="text-sm text-muted-foreground">
                              {freq.description}
                            </p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </InputGroupAddon>
            </InputGroup>
        </div>
        <div className="flex flex-col gap-y-2">
          <Label>Term</Label>
          {termError && <p className="text-sm text-destructive">{termError}</p>}
          <InputGroup className="max-w-sm">
            <InputGroupInput
              aria-invalid={termError ? true : false}
              placeholder="0" 
              value={term} 
              onChange={handleTermInputChange}
              onBlur={handleTermInputBlur}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>years</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="flex flex-col gap-y-2">
          <Label>Payment Frequency</Label>
          <div className="relative overflow-hidden w-fit flex justify-between rounded-[8px] border border-input dark:bg-input/30 bg-transparent text-muted-foreground text-sm font-medium cursor-pointer">
            <div 
              onClick={() => setPaymentFrequency("monthly")}
              className={cn(
                "px-2 py-1 transition",
                paymentFrequency === "monthly" ? "text-accent-foreground bg-input" : "hover:bg-input/30"
              )}
            >
              Monthly
            </div>
            <div 
              onClick={() => setPaymentFrequency("annual")}
              className={cn(
                "px-2 py-1 transition",
                paymentFrequency === "annual" ? "text-accent-foreground bg-input" : "hover:bg-input/30"
              )}
            >
              Annual
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <DatePicker date={startDate} onDateChange={setStartDate} />
        </div>
        <Button type="button" disabled={!formValid} className="ml-auto" onClick={handleLoanChange}>
          Calculate
        </Button>
      </CardContent>
    </Card>
  )
}