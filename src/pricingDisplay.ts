export type Billing = "annual" | "monthly";

/** Per user reference: monthly / annual (/mo) base amounts before global discount */
export const PLAN_RATES: Record<string, { monthly: number; annual: number }> = {
  Basic: { monthly: 25, annual: 16 },
  Core: { monthly: 36, annual: 23 },
  Plus: { monthly: 56, annual: 39 },
};

export const ADVANCED_RATES = { monthly: 139, annual: 99 } as const;

export type DisplayPrice = { strike: string; price: string; savings: string };

export function applyGlobalDiscount(basePrice: number, discountApplies: boolean): number {
  return discountApplies ? Math.round(basePrice * 0.8) : basePrice;
}

export function formatUsd(amount: number): string {
  return `$${amount}`;
}

export function annualSavingsPercent(rates: { monthly: number; annual: number }): number {
  if (rates.monthly <= 0) return 0;
  return Math.round((1 - rates.annual / rates.monthly) * 100);
}

/** Blue savings line under price — same for all promo / strike states */
export function listedPlanAnnualSavingsLine(
  rates: { monthly: number; annual: number },
  billing: Billing,
  savingsPctDisplay?: number,
): string {
  const pct = savingsPctDisplay ?? annualSavingsPercent(rates);
  if (billing === "monthly") {
    return `Pay annually for ${pct}% more savings`;
  }
  return `Includes ${pct}% annual savings`;
}

export function planDisplayPrices(
  rates: { monthly: number; annual: number },
  billing: Billing,
  discountAppliesToListedPrice: boolean,
  savingsPctDisplay?: number,
): DisplayPrice {
  const useMonthly = billing === "monthly";
  const base = useMonthly ? rates.monthly : rates.annual;
  const finalAmount = applyGlobalDiscount(base, discountAppliesToListedPrice);

  if (!discountAppliesToListedPrice) {
    return {
      strike: "",
      price: formatUsd(base),
      savings: listedPlanAnnualSavingsLine(rates, billing, savingsPctDisplay),
    };
  }

  return {
    strike: formatUsd(base),
    price: formatUsd(finalAmount),
    savings: listedPlanAnnualSavingsLine(rates, billing, savingsPctDisplay),
  };
}

export function planBaseAmount(
  rates: { monthly: number; annual: number },
  billing: Billing,
): number {
  return billing === "monthly" ? rates.monthly : rates.annual;
}

export function discountedAmount20(base: number): number {
  return Math.round(base * 0.8);
}
