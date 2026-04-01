import { create } from 'zustand';

const useToastStore = create((set, get) => ({
  toasts: [],
  addToast: (message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    set({ toasts: [...get().toasts, { id, message, type }] });
    setTimeout(() => set({ toasts: get().toasts.filter(t => t.id !== id) }), duration);
  },
  removeToast: (id) => set({ toasts: get().toasts.filter(t => t.id !== id) }),
  success: (m) => get().addToast(m, 'success'),
  error: (m) => get().addToast(m, 'error'),
  info: (m) => get().addToast(m, 'info'),
}));

export default useToastStore;
