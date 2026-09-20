export { DashboardPage } from './pages/dashboard-page'
export { RecentActivityCard } from './components/recent-activity-card'
export { StockAlertCard } from './components/stock-alert-card'
export { StockMovementCard } from './components/stock-movement-card'
export { SummaryCard } from './components/summary-card'
export { TopUsedIngredientsCard } from './components/top-used-ingredients-card'
export {
  dashboardSummaryMock,
  recentActivityMock,
  stockAlertMock,
  stockMovementMock,
  topUsedIngredientsMock,
} from './data/dashboard-mock'
export type {
  DashboardSummary,
  RecentActivityItem,
  RecentActivityType,
  StockAlertItem,
  StockAlertSeverity,
  StockMovementPoint,
  StockMovementType,
  TopUsedIngredient,
} from './types/dashboard.types'
