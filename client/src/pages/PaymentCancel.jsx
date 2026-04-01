import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineXCircle, HiOutlineRefresh } from 'react-icons/hi';

const PaymentCancel = () => (
  <div className="pt-32 pb-16 min-h-screen bg-cream-light flex items-center justify-center">
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto px-4">
      <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-red-50 flex items-center justify-center"><HiOutlineXCircle className="w-14 h-14 text-red-400" /></div>
      <h1 className="font-playfair text-3xl font-bold text-brand-dark mb-3">Payment Cancelled</h1>
      <p className="text-brand-light mb-8">Your payment was not processed. Your cart items are still saved.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/checkout" className="btn-accent inline-flex items-center gap-2"><HiOutlineRefresh className="w-4 h-4" /> Try Again</Link>
        <Link to="/cart" className="btn-secondary">Return to Cart</Link>
      </div>
    </motion.div>
  </div>
);

export default PaymentCancel;
