import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  size?: string;
  color?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
          );
          
          if (existingItem) {
            return {
              items: state.items.map((i) => 
                i.productId === item.productId && i.size === item.size && i.color === item.color
                  ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) } 
                  : i
              ),
            };
          }
          
          return {
            items: [...state.items, { ...item, id: Math.random().toString(36).substr(2, 9) }],
          };
        });
      },
      
      removeItem: (productId, size, color) => {
        set((state) => ({
          items: state.items.filter((i) => !(i.productId === productId && i.size === size && i.color === color)),
        }));
      },
      
      updateQuantity: (productId, quantity, size, color) => {
        set((state) => ({
          items: state.items.map((i) => 
            i.productId === productId && i.size === size && i.color === color
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) } 
              : i
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'giftora-cart',
    }
  )
);
