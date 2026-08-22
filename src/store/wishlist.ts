import { create } from 'zustand';

export interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    mrp: number;
    slug: string;
    images: { url: string }[];
    stock: number;
  };
}

interface WishlistStore {
  items: WishlistItem[];
  loading: boolean;
  initialized: boolean;
  setItems: (items: WishlistItem[]) => void;
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  setLoading: (loading: boolean) => void;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlist = create<WishlistStore>((set, get) => ({
  items: [],
  loading: false,
  initialized: false,
  
  setItems: (items) => set({ items, initialized: true }),
  
  addItem: (item) => set((state) => {
    if (state.items.some(i => i.productId === item.productId)) {
      return state;
    }
    return { items: [...state.items, item] };
  }),
  
  removeItem: (productId) => set((state) => ({
    items: state.items.filter(i => i.productId !== productId)
  })),
  
  setLoading: (loading) => set({ loading }),
  
  fetchWishlist: async () => {
    if (get().loading) return;
    set({ loading: true });
    
    try {
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        set({ items: data.items, initialized: true });
      } else if (res.status === 401) {
        set({ items: [], initialized: true }); // Not logged in
      }
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
    } finally {
      set({ loading: false });
    }
  },
  
  addToWishlist: async (productId: string) => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      
      if (res.ok) {
        const data = await res.json();
        get().addItem(data.item);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to add to wishlist', error);
      return false;
    }
  },
  
  removeFromWishlist: async (productId: string) => {
    try {
      // Optimistic update
      const previousItems = [...get().items];
      get().removeItem(productId);
      
      const res = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        // Revert on failure
        set({ items: previousItems });
        return false;
      }
      return true;
    } catch (error) {
      console.error('Failed to remove from wishlist', error);
      return false;
    }
  },
  
  isInWishlist: (productId: string) => {
    return get().items.some(i => i.productId === productId);
  },
}));
