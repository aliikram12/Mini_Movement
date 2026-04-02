import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineTrash, HiOutlinePlus, HiOutlineMinus, HiOutlineShoppingBag, HiArrowRight } from 'react-icons/hi';
import useCartStore from '../store/cartStore';

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const total = getTotal();
  const shipping = total > 75 ? 0 : 9.99;
  const tax = Number((total * 0.08).toFixed(2));
  const grandTotal = (total + shipping + tax).toFixed(2);

  if (items.length === 0) return (
    <div className="pt-32 pb-16 min-h-screen bg-cream-light flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
        <div className="text-6xl mb-6">🧸</div>
        <h2 className="font-playfair text-2xl font-bold text-brand-dark mb-3">Your cart is empty</h2>
        <p className="text-brand-light mb-8">Looks like you haven't added any keepsake bears yet</p>
        <Link to="/products" className="btn-warm inline-flex items-center gap-2"><HiOutlineShoppingBag className="w-5 h-5" /> Browse Bears</Link>
      </motion.div>
    </div>
  );

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream-light">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 text-center sm:text-left">
          <div>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-brand-dark">Your Cart</h1>
            <p className="text-sm text-brand-light mt-1">{items.length} {items.length === 1 ? 'item' : 'items'} in your bag</p>
          </div>
          <button onClick={clearCart} className="text-sm font-medium text-brand-muted hover:text-red-500 transition-colors px-4 py-2 bg-white rounded-xl border border-baby-pink/20 shadow-sm">Clear All</button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="popLayout">
              {items.map((item, i) => (
                <motion.div key={`${item._id}-${item.color}-${item.size}`} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: i * 0.05 }} className="card p-4 sm:p-5 mb-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left">
                    <img src={item.image} alt={item.name} className="w-28 h-28 sm:w-24 sm:h-24 rounded-2xl object-cover flex-shrink-0 shadow-soft" />
                    <div className="flex-1 min-w-0 w-full">
                      <Link to={`/product/${item._id}`} className="font-poppins font-bold text-lg sm:text-base text-brand-dark hover:text-brand-warm transition-colors line-clamp-1">{item.name}</Link>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-1">
                        {item.color && <span className="text-xs font-medium text-brand-muted bg-cream px-2 py-0.5 rounded-lg">{item.color}</span>}
                        {item.size && <span className="text-xs font-medium text-brand-muted bg-cream px-2 py-0.5 rounded-lg">Size: {item.size}</span>}
                      </div>
                      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                        <div className="flex items-center bg-cream-light rounded-xl overflow-hidden border border-baby-pink/20 shadow-sm">
                          <button onClick={() => updateQuantity(item._id, item.quantity - 1, item.color, item.size)} className="p-2.5 hover:bg-baby-pink/20 transition-colors"><HiOutlineMinus className="w-4 h-4" /></button>
                          <span className="px-5 py-2 text-base font-bold text-brand-dark min-w-[40px] text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1, item.color, item.size)} className="p-2.5 hover:bg-baby-pink/20 transition-colors"><HiOutlinePlus className="w-4 h-4" /></button>
                        </div>
                        <div className="flex items-center gap-6">
                          <p className="font-bold text-xl sm:text-lg text-brand-dark">${(item.price * item.quantity).toFixed(2)}</p>
                          <button onClick={() => removeItem(item._id, item.color, item.size)} className="p-2.5 rounded-xl text-brand-muted hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"><HiOutlineTrash className="w-5 h-5" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="card p-6 sticky top-28">
              <h3 className="font-poppins text-lg font-bold text-brand-dark mb-6">Order Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm"><span className="text-brand-light">Subtotal</span><span className="text-brand-dark">${total.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-brand-light">Shipping</span><span className={shipping === 0 ? 'text-green-500 font-medium' : 'text-brand-dark'}>{shipping === 0 ? 'FREE' : `$${shipping}`}</span></div>
                <div className="flex justify-between text-sm"><span className="text-brand-light">Tax</span><span className="text-brand-dark">${tax}</span></div>
                <hr className="border-cream-dark/20" />
                <div className="flex justify-between pt-1"><span className="font-semibold text-brand-dark">Total</span><span className="text-xl font-bold text-brand-dark">${grandTotal}</span></div>
              </div>
              {shipping > 0 && <p className="text-xs text-brand-warm bg-brand-warm/5 rounded-xl p-3 mb-4 text-center">🚚 Add ${(75 - total).toFixed(2)} more for free shipping!</p>}
              <Link to="/checkout" className="btn-warm w-full flex items-center justify-center gap-2">Proceed to Checkout <HiArrowRight className="w-4 h-4" /></Link>
              <Link to="/products" className="block text-center text-sm text-brand-light mt-4 hover:text-brand-dark transition-colors">Continue Shopping</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
