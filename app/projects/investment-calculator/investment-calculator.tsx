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

import { AnnuityFrequency, AnnuityTiming, CompoundingFrequency, Investment } from "./types"
import { getAnnuityPrincipalAndInterest, getEffectiveRate } from "./utils"

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
const annuityFrequencies: { frequency: AnnuityFrequency, description: string }[] = [
  {
    frequency: "annual",
    description: "Payments or contributions made once per year (1 time per year)."
  },
  {
    frequency: "monthly",
    description:"Payments or contributions made every month (12 times per year)."
  }
]
const annuityTimings: { timing: AnnuityTiming; description: string }[] = [
  { timing: "immediate", description: "Payments occur at the end of each period (ordinary annuity)." },
  { timing: "due", description: "Payments occur at the beginning of each period (annuity due)." }
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
  const [annuityPayment, setAnnuityPayment] = useState<string>("")
  const [annuityPaymentError, setAnnuityPaymentError] = useState<null | string>(null)
  const [annuityTiming, setAnnuityTiming] = useState<AnnuityTiming>("immediate")
  const [annuityFrequency, setAnnuityFrequency] = useState<AnnuityFrequency>("annual")
  const [inflationRate, setInflationRate] = useState<string>("2.00")
  const [inflationRateError, setInflationRateError] = useState<null | string>(null)
  // add real vs nominal growth

  const handleInitialPrincipalInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    if (value === "" || !isNaN(Number(value.replace(/,/g, "")))) {
      setInitialPrincipalError(null)
    }

    setInitialPrincipal(value)
  }

  const handleInitialPrincipleInputBlur = () => {
    if (initialPrincipal !== "" && isNaN(Number(initialPrincipal.replace(/,/g, "")))) {
      setInitialPrincipalError("Initial principal must be a valid number.")
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

  const handleInflationRateInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    if (value === "" || !isNaN(Number(value))) {
      setInflationRateError(null)
    }

    setInflationRate(value)
  }

  const handleInflationRateInputBlur = () => {
    if (inflationRate !== "" && isNaN(Number(inflationRate))) {
      setInflationRateError("Inflation rate must be a valid number.")
    }
  }

  const handleLengthOfInvestmentInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    if (value === "" || !isNaN(Number(value))) {
      setLengthOfInvestmentError(null)
    }

    setLengthOfInvestment(value)
  }

  const handleLengthOfInvestmentInputBlur = () => {
    if (lengthOfInvestment !== "" && isNaN(Number(lengthOfInvestment))) {
      setLengthOfInvestmentError("Length of investment must be a valid number.")
    }
  }

  const handleAnnuityPaymentInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    if (value === "" || !isNaN(Number(value.replace(/,/g, "")))) {
      setAnnuityPaymentError(null)
    }

    setAnnuityPayment(value)
  }

  const handleAnnuityPaymentInputBlur = () => {
    if (annuityPayment !== "" && isNaN(Number(annuityPayment.replace(/,/g, "")))) {
      setAnnuityPaymentError("Initial principal must be a valid number.")
    }
  }

  const formValid = (
    initialPrincipal !== "" && !isNaN(Number(initialPrincipal.replace(/,/g, "")))
    && interestRate !== "" && !isNaN(Number(interestRate))
    && inflationRate !== "" && !isNaN(Number(interestRate))
    && lengthOfInvestment !== "" && !isNaN(Number(lengthOfInvestment))
    && annuityPayment === "" || !isNaN(Number(annuityPayment.replace(/,/g, "")))
  )

  const handleInvestmentChange = () => {
    if (!formValid) {
      return
    }

    const principal = Number(initialPrincipal.replace(/,/g, ""))
    const nominalRate = Number(interestRate) / 100
    const inflationR = Number(inflationRate) / 100
    const time = Number(lengthOfInvestment)
    const recurringPayment = Number(annuityPayment.replace(/,/g, ""))

    const effectiveRate = getEffectiveRate({
      nominalRate,
      frequency: compoundingFrequency
    })

    const realRate = (effectiveRate - inflationR) / (1 + inflationR)

    const investment: Investment = [{ 
      year: 0, 
      nominalPrincipal: principal, 
      nominalInterest: 0,
      realPrincipal: principal,
      realInterest: 0
    }]
    const { principal: nominalAnnuityPrincipal, interest: nominalAnnuityInterest } = getAnnuityPrincipalAndInterest({
      payment: recurringPayment,
      frequency: annuityFrequency,
      timing: annuityTiming,
      effectiveRate
    })
    const { principal: realAnnuityPrincipal, interest: realAnnuityInterest } = getAnnuityPrincipalAndInterest({
      payment: recurringPayment,
      frequency: annuityFrequency,
      timing: annuityTiming,
      effectiveRate: realRate
    })
    let accumulatedNominalPrincipal = principal
    let accumulatedNominalInterest = 0
    let accumulatedNominalAmount = principal
    let accumulatedRealPrincipal = principal
    let accumulatedRealInterest = 0
    let accumulatedRealAmount = principal

    for (let i = 1; i <= time; i++) {
      accumulatedNominalPrincipal += nominalAnnuityPrincipal
      const nominalInterest = accumulatedNominalAmount * effectiveRate + nominalAnnuityInterest
      accumulatedNominalInterest += nominalInterest
      accumulatedNominalAmount += nominalInterest + nominalAnnuityPrincipal

      accumulatedRealPrincipal += realAnnuityPrincipal
      const realInterest = accumulatedRealAmount * realRate + realAnnuityInterest
      accumulatedRealInterest += realInterest
      accumulatedRealAmount += realInterest + realAnnuityPrincipal

      investment.push({
        year: i,
        nominalPrincipal: Number(accumulatedNominalPrincipal.toFixed(2)),
        nominalInterest: Number(accumulatedNominalInterest.toFixed(2)),
        realPrincipal: Number(accumulatedRealPrincipal.toFixed(2)),
        realInterest: Number(accumulatedRealInterest.toFixed(2))
      })
    }

    onInvestmentChange(investment.slice(1))
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
                      The interest rate represents the percentage of return earned (or paid) on an investment or loan over a specific period.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </Label>
            {interestRateError && <p className="text-sm text-destructive">{interestRateError}</p>}
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
            <Label>
              Inflation Rate
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
                    <h4 className="text-sm font-medium">Inflation Rate</h4>
                    <p className="text-sm text-muted-foreground">
                      The inflation rate represents how the purchasing power of money
                      decreases over time.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </Label>
            {inflationRateError && <p className="text-sm text-destructive">{inflationRateError}</p>}
            <InputGroup className="max-w-sm">
              <InputGroupAddon>
                <InputGroupText>%</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                aria-invalid={inflationRateError ? true : false}
                placeholder="0.0" 
                value={inflationRate} 
                onChange={handleInflationRateInputChange}
                onBlur={handleInflationRateInputBlur}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>years</InputGroupText>
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
          <div className="flex flex-col gap-y-2">
            <Label>
              Recurring Contributions
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
                    <h4 className="text-sm font-medium">Recurring Contributions (Anuity)</h4>
                    <p className="text-sm text-muted-foreground">
                      Regular payments made into (or withdrawn from) an investment at equal
                      time intervals. Common examples include monthly savings deposits or
                      annual retirement contributions.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </Label>
            <InputGroup className="max-w-sm">
              <InputGroupAddon>
                <InputGroupText>$</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                aria-invalid={annuityPaymentError ? true : false}
                placeholder="0.00" 
                value={annuityPayment} 
                onChange={handleAnnuityPaymentInputChange}
                onBlur={handleAnnuityPaymentInputBlur}
              />
              <InputGroupAddon align="inline-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <InputGroupButton variant="ghost" className="!pr-1.5 text-xs">
                      {annuityFrequency} <ChevronDownIcon className="size-3" />
                    </InputGroupButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {annuityFrequencies.map(freq => (
                      <HoverCard key={freq.frequency} openDelay={100} closeDelay={150}>
                        <HoverCardTrigger asChild>
                          <DropdownMenuItem
                            className={cn(annuityFrequency === freq.frequency && "bg-accent")}
                            onClick={() => setAnnuityFrequency(freq.frequency)}
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
              <InputGroupAddon align="inline-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <InputGroupButton variant="ghost" className="!pr-1.5 text-xs">
                      {annuityTiming} <ChevronDownIcon className="size-3" />
                    </InputGroupButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {annuityTimings.map(timing => (
                      <HoverCard key={timing.timing} openDelay={100} closeDelay={150}>
                        <HoverCardTrigger asChild>
                          <DropdownMenuItem
                            className={cn(annuityTiming === timing.timing && "bg-accent")}
                            onClick={() => setAnnuityTiming(timing.timing)}
                          >
                            {timing.timing}
                          </DropdownMenuItem>
                        </HoverCardTrigger>
                        <HoverCardContent
                          side="right"
                          align="start"
                          className="w-64 max-sm:hidden"
                        >
                          <div className="space-y-1">
                            <h4 className="text-sm font-medium">{timing.timing}</h4>
                            <p className="text-sm text-muted-foreground">
                              {timing.description}
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
          <Button type="button" disabled={!formValid} className="ml-auto" onClick={handleInvestmentChange}>
            Calculate
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}