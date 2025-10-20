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

import { CompoundingFrequency, Investment } from "./types"
import { getEffectiveRate } from "./utils"

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

export function InvestmentCalculator({
  onInvestmentChange
}: {
  onInvestmentChange: (investment: Investment) => void
}) {
  const [initialPrincipal, setInitialPrincipal] = useState<string>("")
  const [initialPrincipalError, setInitialPrincipalError] = useState<null | string>(null)
  const [interestRate, setInterestRate] = useState<string>("")
  const [interestRateError, setInterestRateError] = useState<null | string>(null)
  const [compoundingFrequency, setCompoundingFrequency] = useState<CompoundingFrequency>("annual")
  const [lengthOfInvestment, setLengthOfInvestment] = useState<string>("")
  const [lengthOfInvestmentError, setLengthOfInvestmentError] = useState<null | string>(null)
  // add annuities
  // add inflation
  // add real vs nominal growth

  const handleInitialPrincipalInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    if (initialPrincipal === "" || !isNaN(Number(initialPrincipal))) {
      setInitialPrincipalError(null)
    }

    setInitialPrincipal(value)
  }

  const handleInitialPrincipleInputBlur = () => {
    if (initialPrincipal !== "" && isNaN(Number(initialPrincipal))) {
      setInitialPrincipalError("Initial principal must be a valid number.")
    }
  }

  const handleInterestRateInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    if (interestRate === "" || !isNaN(Number(interestRate))) {
      setInterestRateError(null)
    }

    setInterestRate(value)
  }

  const handleInterestRateInputBlur = () => {
    if (interestRate !== "" && isNaN(Number(interestRate))) {
      setInterestRateError("Interest rate must be a valid number.")
    }
  }

  const handleLengthOfInvestmentInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    if (lengthOfInvestment === "" || !isNaN(Number(lengthOfInvestment))) {
      setLengthOfInvestmentError(null)
    }

    setLengthOfInvestment(value)
  }

  const handleLengthOfInvestmentInputBlur = () => {
    if (lengthOfInvestment !== "" && isNaN(Number(lengthOfInvestment))) {
      setLengthOfInvestmentError("Length of investment must be a valid number.")
    }
  }

  const formValid = (
    initialPrincipal !== "" && !isNaN(Number(initialPrincipal))
    && interestRate !== "" && !isNaN(Number(interestRate))
    && lengthOfInvestment !== "" && !isNaN(Number(lengthOfInvestment))
  )

  const handleInvestmentChange = () => {
    if (!formValid) {
      return
    }

    const principal = Number(initialPrincipal)
    const nominalRate = Number(interestRate) / 100
    const time = Number(lengthOfInvestment)

    const effectiveRate = getEffectiveRate({
      nominalRate,
      frequency: compoundingFrequency
    })

    const investment: Investment = [{ year: 1, principal: principal, interest: 0 }]
    let accumulatedPrincipal = principal
    let accumulatedInterest = 0
    let accumulatedAmount = principal

    for (let i = 2; i <= time; i++) {
      // no annuities, so the principal stays the same
      const interest = accumulatedAmount * effectiveRate
      accumulatedInterest += interest
      accumulatedAmount += interest

      investment.push({
        year: i,
        principal: Number(accumulatedPrincipal.toFixed(2)),
        interest: Number(accumulatedInterest.toFixed(2))
      })
    }

    onInvestmentChange(investment)
  }

  return (
    <div>
      <Card className="max-w-2xl mx-auto mt-30 max-sm:bg-transparent max-sm:border-transparent">
        <CardHeader>
          <CardTitle>Investment Calculator</CardTitle>
          <CardDescription>Estimate the value of your investment by adding your initial principal, interest rate, etc.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <Label>Initial Principal</Label>
            {initialPrincipalError && <p className="text-sm text-destructive">{initialPrincipalError}</p>}
            <InputGroup className="max-w-sm">
              <InputGroupAddon>
                <InputGroupText>$</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                aria-invalid={initialPrincipalError ? true : false}
                placeholder="0.00" 
                value={initialPrincipal} 
                onChange={handleInitialPrincipalInputChange}
                onBlur={handleInitialPrincipleInputBlur}
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
                          className="w-64"
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
            <Label>Length of Investment</Label>
            {lengthOfInvestmentError && <p className="text-sm text-destructive">{lengthOfInvestmentError}</p>}
            <InputGroup className="max-w-sm">
              <InputGroupInput
                aria-invalid={lengthOfInvestmentError ? true : false}
                placeholder="0" 
                value={lengthOfInvestment} 
                onChange={handleLengthOfInvestmentInputChange}
                onBlur={handleLengthOfInvestmentInputBlur}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>years</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
          <Button type="button" disabled={!formValid} className="ml-auto" onClick={handleInvestmentChange}>
            Calculate
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}