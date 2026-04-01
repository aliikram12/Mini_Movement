import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineLockClosed } from 'react-icons/hi';
import InputField from '../components/InputField';
import useCartStore from '../store/cartStore';
import useToastStore from '../store/toastStore';
import { createCheckoutSession, createOrder } from '../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const toast = useToastStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', street: '', city: '', state: '', zip: '', country: 'United States' });
  const total = getTotal(); const shipping = total > 75 ? 0 : 9.99; const tax = Number((total * 0.08).toFixed(2)); const grandTotal = (total + shipping + tax).toFixed(2);
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const payload = {
        items: items.map(i => ({ product: i._id, name: i.name, image: i.image, price: i.price, quantity: i.quantity, color: i.color, size: i.size })),
        shippingAddress: { fullName: form.fullName, email: form.email, phone: form.phone, street: form.street, city: form.city, state: form.state, zip: form.zip, country: form.country }
      };

      // Attempt secure Stripe Checkout Session
      try {
        const { data } = await createCheckoutSession(payload);
        if (data.url) { window.location.href = data.url; return; }
      } catch (stripeErr) {
        console.warn('Stripe checkout failed or no keys configured. Falling back to direct mock order.', stripeErr);
      }

      // Fallback: If Stripe is not configured via ENV, simulate the order directly (for preview)
      await createOrder(payload);
      clearCart(); toast.success('Order placed successfully! 🎉'); navigate('/payment-success');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to place order'); }
    finally { setLoading(false); }
  };

  if (!items.length) { navigate('/cart'); return null; }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream-light">
      <div className="container-custom">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-playfair text-3xl font-bold text-brand-dark mb-8">Secure Checkout</motion.h1>
        <form onSubmit={submit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 border-t-4 border-t-brand-warm">
                <h3 className="text-lg font-bold text-brand-dark mb-6 flex items-center gap-2">📦 Shipping Details</h3>
                <div className="grid md:grid-cols-2 gap-x-4">
                  <InputField label="Full Name" name="fullName" value={form.fullName} onChange={handle} required placeholder="Jane Doe" />
                  <InputField label="Email" name="email" type="email" value={form.email} onChange={handle} required placeholder="jane@example.com" />
                  <InputField label="Phone" name="phone" value={form.phone} onChange={handle} required placeholder="+1 (555) 123-4567" />
                  <InputField label="Country" name="country" value={form.country} onChange={handle} required />
                  <div className="md:col-span-2"><InputField label="Street Address" name="street" value={form.street} onChange={handle} required placeholder="123 Main Street" /></div>
                  <InputField label="City" name="city" value={form.city} onChange={handle} required placeholder="New York" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="State" name="state" value={form.state} onChange={handle} required placeholder="NY" />
                    <InputField label="ZIP" name="zip" value={form.zip} onChange={handle} required placeholder="10001" />
                  </div>
                </div>
              </motion.div>
              <div className="flex items-center gap-3 p-4 bg-brand-dark/5 rounded-2xl border border-brand-dark/10">
                <HiOutlineLockClosed className="w-8 h-8 text-brand-dark opacity-50" />
                <div>
                  <h4 className="font-bold text-brand-dark text-sm">Secure Payment</h4>
                  <p className="text-xs text-brand-medium">After clicking "Proceed to Payment", you will be securely redirected to Stripe to complete your purchase. We do not store your credit card details.</p>
                </div>
              </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="card p-6 sticky top-28 shadow-soft-xl">
                <h3 className="font-poppins text-lg font-bold text-brand-dark mb-6">Order Summary</h3>
                <div className="space-y-3 mb-6 max-h-[40vh] overflow-y-auto pr-2">{items.map(i => (
                  <div key={`${i._id}-${i.color}-${i.size}`} className="flex gap-3"><img src={i.image} alt={i.name} className="w-14 h-14 rounded-xl object-cover shadow-sm" /><div className="flex-1 min-w-0"><p className="text-sm font-semibold text-brand-dark line-clamp-1">{i.name}</p><p className="text-xs text-brand-muted">Qty: {i.quantity}</p></div><p className="text-sm font-bold text-brand-dark">${(i.price * i.quantity).toFixed(2)}</p></div>
                ))}</div>
                <hr className="border-cream-dark/30 mb-4" />
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm"><span className="text-brand-light">Subtotal</span><span className="font-medium text-brand-dark">${total.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-brand-light">Shipping</span><span className={shipping===0?'text-green-600 font-bold':'font-medium text-brand-dark'}>{shipping===0?'FREE':`$${shipping}`}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-brand-light">Tax</span><span className="font-medium text-brand-dark">${tax}</span></div>
                  <hr className="border-cream-dark/30" />
                  <div className="flex justify-between pt-2"><span className="text-lg font-bold text-brand-dark">Total</span><span className="text-2xl font-black text-brand-dark">${grandTotal}</span></div>
                </div>
                <button type="submit" disabled={loading} className="btn-accent w-full flex items-center justify-center gap-2 py-4 text-base">
                  {loading ? <><motion.div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:'linear'}} /> Preparing Secure Session...</> : <><HiOutlineLockClosed className="w-5 h-5" /> Proceed to Payment</>}
                </button>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
