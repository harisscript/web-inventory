export interface DashboardSummary {
  totalOutlets: number
  totalIngredients: number
  lowStock: number
  outOfStock: number
  todayPurchase: number
  todayUsage: number
}

export type StockAlertSeverity = 'low' | 'out'

export interface StockAlertItem {
  id: string
  name: string
  currentStock: number
  minStock: number
  unit: string
  severity: StockAlertSeverity
}

export type StockMovementType = 'stockIn' | 'stockOut' | 'adjustment'

export interface StockMovementPoint {
  day: string
  stockIn: number
  stockOut: number
  adjustment: number
}

export interface TopUsedIngredient {
  id: string
  name: string
  amount: number
  unit: string
}

export type RecentActivityType = 'stockIn' | 'stockOut' | 'adjustment' | 'transfer' | 'purchase'

export interface RecentActivityItem {
  id: string
  type: RecentActivityType
  title: string
  description: string
  outlet?: string
  amount?: string
  timestamp: string
}
