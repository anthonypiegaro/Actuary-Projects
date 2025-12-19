export type InvestmentPeriod = { 
  year: number
  nominalPrincipal: number
  nominalInterest: number
  realPrincipal: number
  realInterest: number
}

export type ChartDataEntry = {
  year: number
  principal: number
  interest: number
  amount: number
}

export type ChartData = ChartDataEntry[]

export type Investment = InvestmentPeriod[]

export type CompoundingFrequency = "annual" | "semiannual" | "quarterly" | "monthly" | "daily" | "continuous"

export type AnnuityTiming = "immediate" | "due"

export type AnnuityFrequency = "annual" | "monthly"