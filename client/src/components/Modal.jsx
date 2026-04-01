import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX } from 'react-icons/hi';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <AnimatePresence>{isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-brand-dark/30 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{opacity:0,scale:0.9,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.9,y:20}} transition={{type:'spring',duration:0.5}}
          className={`relative w-full ${sizes[size]} glass-strong rounded-3xl shadow-soft-xl p-6 md:p-8 max-h-[85vh] overflow-y-auto`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-brand-dark font-poppins">{title}</h3>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-baby-pink/20 transition-all"><HiOutlineX className="w-5 h-5 text-brand-light" /></button>
          </div>
          {children}
        </motion.div>
      </div>
    )}</AnimatePresence>
  );
};

export default Modal;
