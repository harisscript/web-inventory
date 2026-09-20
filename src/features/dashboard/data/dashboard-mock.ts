import type {
  DashboardSummary,
  RecentActivityItem,
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
  { id: 'a1', name: 'Daging', currentStock: 8, minStock: 10, unit: 'Kg', severity: 'low' },
  { id: 'a2', name: 'Keju', currentStock: 2, minStock: 5, unit: 'Kg', severity: 'low' },
  { id: 'a3', name: 'Telur', currentStock: 12, minStock: 24, unit: 'Butir', severity: 'low' },
  { id: 'a4', name: 'Kaldu', currentStock: 0, minStock: 10, unit: 'Pcs', severity: 'out' },
  { id: 'a5', name: 'Bawang', currentStock: 0, minStock: 5, unit: 'Kg', severity: 'out' },
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

export const recentActivityMock: RecentActivityItem[] = [
  {
    id: 'r1',
    type: 'stockOut',
    title: 'Stok Keluar — Daging Sapi',
    description: 'Outlet Sudirman menggunakan 2.5 Kg untuk shift siang',
    outlet: 'Outlet Sudirman',
    amount: '-2.5 Kg',
    timestamp: '2026-09-20T08:42:00Z',
  },
  {
    id: 'r2',
    type: 'stockIn',
    title: 'Stok Masuk — Keju Cheddar',
    description: 'Penerimaan purchase order dari supplier Cool Dairy',
    outlet: 'Gudang Pusat',
    amount: '+15 Kg',
    timestamp: '2026-09-20T07:55:00Z',
  },
  {
    id: 'r3',
    type: 'adjustment',
    title: 'Penyesuaian Stok — Kaldu Blok',
    description: 'Stok opname ditemukan selisih 2 Pcs',
    outlet: 'Outlet Kemang',
    amount: '-2 Pcs',
    timestamp: '2026-09-19T22:10:00Z',
  },
  {
    id: 'r4',
    type: 'transfer',
    title: 'Transfer Bahan — Telur Ayam',
    description: 'Pengiriman dari Gudang Pusat ke Outlet Senopati',
    outlet: 'Outlet Senopati',
    amount: '48 Butir',
    timestamp: '2026-09-19T18:35:00Z',
  },
  {
    id: 'r5',
    type: 'purchase',
    title: 'Purchase Order — Tepung Terigu',
    description: 'PO #PO-2026-0921 dibuat oleh Purchasing',
    outlet: 'Pusat',
    amount: 'Rp 1.250.000',
    timestamp: '2026-09-19T16:20:00Z',
  },
]
