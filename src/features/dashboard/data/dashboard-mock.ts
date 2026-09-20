import type {
  DashboardSummary,
  StockAlertItem,
  StockMovementPoint,
  TopUsedIngredient,
} from '../types/dashboard.types'

export const dashboardSummaryMock: DashboardSummary = {
  totalOutlets: 5,
  totalIngredients: 128,
  lowStock: 12,
  outOfStock: 4,
  todayPurchase: 2500000,
  todayUsage: 18,
}

export const stockAlertMock: StockAlertItem[] = [
  { id: 'a1', name: 'Daging', amount: 2.5, unit: 'Kg', severity: 'low' },
  { id: 'a2', name: 'Keju', amount: 800, unit: 'Gram', severity: 'low' },
  { id: 'a3', name: 'Telur', amount: 15, unit: 'Butir', severity: 'low' },
  { id: 'a4', name: 'Kaldu', amount: 0, unit: 'Pcs', severity: 'out' },
]

export const stockMovementMock: StockMovementPoint[] = [
  { day: 'Mon', stockIn: 12, stockOut: 18, adjustment: 2 },
  { day: 'Tue', stockIn: 25, stockOut: 22, adjustment: 4 },
  { day: 'Wed', stockIn: 32, stockOut: 28, adjustment: 1 },
  { day: 'Thu', stockIn: 18, stockOut: 30, adjustment: 5 },
  { day: 'Fri', stockIn: 28, stockOut: 26, adjustment: 3 },
  { day: 'Sat', stockIn: 35, stockOut: 24, adjustment: 2 },
  { day: 'Sun', stockIn: 14, stockOut: 20, adjustment: 1 },
]

export const topUsedIngredientsMock: TopUsedIngredient[] = [
  { id: 't1', name: 'Daging', amount: 125, unit: 'Kg' },
  { id: 't2', name: 'Telur', amount: 890, unit: 'pcs' },
  { id: 't3', name: 'Tepung', amount: 72, unit: 'Kg' },
  { id: 't4', name: 'Mie', amount: 65, unit: 'Kg' },
  { id: 't5', name: 'Keju', amount: 38, unit: 'Kg' },
]
