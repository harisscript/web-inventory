import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface RestaurantSelectionState {
  selectedRestaurantId: string | null
  setSelectedRestaurant: (id: string) => void
  clearSelection: () => void
}

export const useRestaurantSelectionStore = create<RestaurantSelectionState>()(
  persist(
    (set) => ({
      selectedRestaurantId: null,
      setSelectedRestaurant: (id) => set({ selectedRestaurantId: id }),
      clearSelection: () => set({ selectedRestaurantId: null }),
    }),
    {
      name: 'inventory.restaurant.selection',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ selectedRestaurantId: state.selectedRestaurantId }),
    },
  ),
)
