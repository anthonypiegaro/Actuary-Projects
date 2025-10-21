export type InvestmentPeriod = { 
  year: number
  principal: number
  interest: number
}

export type Investment = InvestmentPeriod[]

export type CompoundingFrequency = "annual" | "semiannual" | "quarterly" | "monthly" | "daily" | "continuous"

export type AnnuityTiming = "immediate" | "due"

export type AnnuityFrequency = "annual" | "monthly"