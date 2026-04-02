import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCartDB, syncCartDB, clearCartDB } from '../services/api';

const useCartStore = create(persist((set, get) => ({
  items: [],
  addItem: async (product, qty = 1, color = '', size = '') => {
    const items = get().items;
    const idx = items.findIndex(i => i._id === product._id && i.color === color && i.size === size);
    let newItems;
    if (idx > -1) { 
      newItems = [...items]; 
      newItems[idx].quantity += qty; 
    } else { 
      newItems = [...items, { _id: product._id, name: product.name, price: product.price, image: product.images?.[0] || '', quantity: qty, color, size, stock: product.stock }];
    }
    set({ items: newItems });
    if (localStorage.getItem('auth-storage')) {
      try { await syncCartDB(newItems); } catch (e) { console.error('Cart sync failed', e); }
    }
  },
  removeItem: async (id, color = '', size = '') => {
    const newItems = get().items.filter(i => !(i._id === id && i.color === color && i.size === size));
    set({ items: newItems });
    if (localStorage.getItem('auth-storage')) {
      try { await syncCartDB(newItems); } catch (e) { console.error('Cart sync failed', e); }
    }
  },
  updateQuantity: async (id, qty, color = '', size = '') => {
    if (qty < 1) return;
    const newItems = get().items.map(i => i._id === id && i.color === color && i.size === size ? { ...i, quantity: Math.min(qty, i.stock || 99) } : i);
    set({ items: newItems });
    if (localStorage.getItem('auth-storage')) {
      try { await syncCartDB(newItems); } catch (e) { console.error('Cart sync failed', e); }
    }
  },
  clearCart: async () => {
    set({ items: [] });
    if (localStorage.getItem('auth-storage')) {
      try { await clearCartDB(); } catch (e) { console.error('Cart clear failed', e); }
    }
  },
  fetchCart: async () => {
    try {
      const { data } = await getCartDB();
      const items = data.map(item => ({
        _id: item.product?._id,
        name: item.product?.name,
        price: item.product?.price,
        image: item.product?.images?.[0] || '',
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        stock: item.product?.stock
      })).filter(i => i._id); // Filter out any deleted products
      set({ items });
    } catch (e) { console.error('Failed to fetch cart', e); }
  },
  getTotal: () => get().items.reduce((t, i) => t + i.price * i.quantity, 0),
  getItemCount: () => get().items.reduce((c, i) => c + i.quantity, 0),
}), { name: 'cart-storage' }));

export default useCartStore;
