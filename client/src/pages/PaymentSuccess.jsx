import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineCheckCircle, HiOutlineShoppingBag } from 'react-icons/hi';

const PaymentSuccess = () => (
  <div className="pt-32 pb-16 min-h-screen bg-cream-light flex items-center justify-center">
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', duration: 0.6 }} className="text-center max-w-md mx-auto px-4">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2, stiffness: 200 }} className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-50 flex items-center justify-center">
        <HiOutlineCheckCircle className="w-14 h-14 text-green-400" />
      </motion.div>
      <h1 className="font-playfair text-3xl font-bold text-brand-dark mb-3">Order Confirmed! 🎉</h1>
      <p className="text-brand-light mb-2">Thank you for your order! Your keepsake is being prepared with love.</p>
      <p className="text-sm text-brand-muted mb-8">You'll receive a confirmation email with tracking details soon.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/dashboard" className="btn-accent">View My Orders</Link>
        <Link to="/products" className="btn-secondary inline-flex items-center gap-2"><HiOutlineShoppingBag className="w-4 h-4" /> Continue Shopping</Link>
      </div>
    </motion.div>
  </div>
);

export default PaymentSuccess;
