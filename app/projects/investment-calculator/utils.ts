import { 
  AnnuityFrequency, 
  AnnuityTiming, 
  CompoundingFrequency 
} from "./types"

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

/**
 * 
 * @param params
 * @param params.payment - The amount of each annuity payment
 * @param params.frequency - How often payments occur
 * @param params.timing - The timing of the payment
 * @param params.effectiveRate - The effective annual rate of interest
 * @returns An object containing the principal and interest of the annuity for a single year
 */
export const getAnnuityPrincipalAndInterest = ({
  payment,
  frequency,
  timing,
  effectiveRate
}: {
  payment: number
  frequency: AnnuityFrequency
  timing: AnnuityTiming
  effectiveRate: number
}) => {
  if (frequency === "monthly") {
    const effectiveMonthlyRate = Math.pow(1 + effectiveRate, 1/12) - 1

    if (timing === "immediate") {
      return ({
        principal: payment * 12,
        interest: payment * ((Math.pow(1 + effectiveMonthlyRate, 12) - 1) / (effectiveMonthlyRate)) - (payment * 12)
      })
    }

    return ({
      principal: payment * 12,
      interest: payment * ((Math.pow(1 + effectiveMonthlyRate, 12) - 1) / (effectiveMonthlyRate)) * (1 + effectiveMonthlyRate) - (payment * 12)
    })
  }

  // Annual Annuity
  if (timing === "immediate") {
    return {
      principal: payment,
      interest: 0
    }
  }

  return ({
    principal: payment,
    interest: payment * effectiveRate
  })
}