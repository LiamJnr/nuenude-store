import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Each item: { id, name, size, price, qty }
// price is in whole currency units (e.g. 24.99), converted to cents at checkout time.

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.id === product.id && i.size === product.size
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i === existing ? { ...i, qty: i.qty + 1 } : i
              ),
            }
          }
          return { items: [...state.items, { ...product, qty: 1 }] }
        }),

      removeItem: (id, size) =>
        set((state) => ({
          items: state.items.filter((i) => !(i.id === id && i.size === size)),
        })),

      updateQty: (id, size, qty) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id && i.size === size ? { ...i, qty } : i))
            .filter((i) => i.qty > 0),
        })),

      clear: () => set({ items: [] }),

      total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    { name: 'cart-storage' }
  )
)
