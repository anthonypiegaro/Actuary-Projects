export type InvestmentPeriod = { 
  year: number
  principal: number
  interest: number
}

export type Investment = InvestmentPeriod[]

export type CompoundingFrequency = "annual" | "semiannual" | "quarterly" | "monthly" | "daily" | "continuous"