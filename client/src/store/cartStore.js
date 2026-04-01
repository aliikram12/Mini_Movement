import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(persist((set, get) => ({
  items: [],
  addItem: (product, qty = 1, color = '', size = '') => {
    const items = get().items;
    const idx = items.findIndex(i => i._id === product._id && i.color === color && i.size === size);
    if (idx > -1) { const u = [...items]; u[idx].quantity += qty; set({ items: u }); }
    else { set({ items: [...items, { _id: product._id, name: product.name, price: product.price, image: product.images?.[0] || '', quantity: qty, color, size, stock: product.stock }] }); }
  },
  removeItem: (id, color = '', size = '') => set({ items: get().items.filter(i => !(i._id === id && i.color === color && i.size === size)) }),
  updateQuantity: (id, qty, color = '', size = '') => {
    if (qty < 1) return;
    set({ items: get().items.map(i => i._id === id && i.color === color && i.size === size ? { ...i, quantity: Math.min(qty, i.stock || 99) } : i) });
  },
  clearCart: () => set({ items: [] }),
  getTotal: () => get().items.reduce((t, i) => t + i.price * i.quantity, 0),
  getItemCount: () => get().items.reduce((c, i) => c + i.quantity, 0),
}), { name: 'cart-storage' }));

export default useCartStore;
