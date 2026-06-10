// ──────────────────────────────────────────────────────────────
// Central market / locale config — US edition
// Single source of truth for currency, locale, phone, geography.
// Change values here to re-localize the whole product.
// ──────────────────────────────────────────────────────────────

export const MARKET = {
  country: "United States",
  countryCode: "US",
  currency: "USD",
  currencySymbol: "$",
  locale: "en-US",
  phoneCode: "+1",
  phonePlaceholder: "(555) 123-4567",
  areaUnit: "sq ft",
  // Used for demo data, AI examples, and placeholder copy
  cities: ["New York", "Los Angeles", "Miami", "Austin", "Chicago", "Dallas", "Seattle", "Boston"],
  // Major US listing portals (replaces Bayut/PropertyFinder/99acres etc.)
  portals: ["Zillow", "Realtor.com", "Redfin", "MLS", "Trulia"],
  // Mortgage defaults for affordability/EMI-style calculators
  mortgage: {
    downPaymentPct: 20,
    annualInterestPct: 7,
    termYears: 30,
  },
} as const;

/** Full currency string, e.g. "$1,250,000" */
export function formatPrice(value: number | string | null | undefined): string {
  const num = toNumber(value);
  if (num == null) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num);
}

/** Compact currency string, e.g. "$1.2M", "$850K" — for cards, stats, charts */
export function formatPriceShort(value: number | string | null | undefined): string {
  const num = toNumber(value);
  if (num == null) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
}

/** Plain number with US grouping, e.g. "1,250,000" (no symbol) */
export function formatNumber(value: number | string | null | undefined): string {
  const num = toNumber(value);
  if (num == null) return "0";
  return new Intl.NumberFormat("en-US").format(num);
}

function toNumber(value: number | string | null | undefined): number | null {
  if (value == null) return null;
  const num = typeof value === "string" ? parseFloat(value.replace(/[^0-9.]/g, "")) : value;
  return isNaN(num) ? null : num;
}
