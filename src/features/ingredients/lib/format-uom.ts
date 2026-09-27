import { INGREDIENT_UNITS } from '../types/ingredient.types'

const unitLabels = new Map(INGREDIENT_UNITS.map((u) => [u.code, u.label]))

export function getUnitLabel(code: string): string {
  return unitLabels.get(code) ?? code
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('id-ID').format(value)
}

export function describeConversion(
  baseUnit: string,
  largeUnit: string | null | undefined,
  conversionQty: number | null | undefined,
): string {
  if (!largeUnit || conversionQty == null) return ''
  return `1 ${getUnitLabel(largeUnit)} = ${formatNumber(conversionQty)} ${getUnitLabel(baseUnit)}`
}
