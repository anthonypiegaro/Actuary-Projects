import { CompoundingFrequency, PaymentFrequency } from "./types"

export const getEffectiveRate = ({
  nominalRate,
  frequency
}: {
  nominalRate: number
  frequency: CompoundingFrequency
}) => {
  let periods: number

  switch (frequency) {
    case "annual":
      periods = 1
      break
    case "semiannual":
      periods = 2
      break
    case "quarterly":
      periods = 4
      break
    case "monthly":
      periods = 12
      break
    case "daily":
      periods = 365
      break
    case "continuous":
      return Math.exp(nominalRate) - 1
    default:
      periods = 1
      break
  }

  return (1 + (nominalRate / periods)) ** periods - 1
}

export const getPayment = ({
  amount,
  effectiveRate,
  term,
}: {
  amount: number
  effectiveRate: number
  term: number
}) => {
  return (amount * effectiveRate) / (1 - Math.pow(1 + effectiveRate, -1 * term))
}

export const formatUSD = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}