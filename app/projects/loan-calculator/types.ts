export type AmortizationSchedule = {
  date?: Date
  payment: number
  principal: number
  interest: number
  outstandingBalance: number
}[]

export type CompoundingFrequency = "annual" | "semiannual" | "quarterly" | "monthly" | "daily" | "continuous"

export type PaymentFrequency = "monthly" | "annual"