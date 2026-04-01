import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineInformationCircle, HiOutlineX } from 'react-icons/hi';
import useToastStore from '../store/toastStore';

const icons = { success: <HiOutlineCheckCircle className="w-5 h-5 text-green-500" />, error: <HiOutlineXCircle className="w-5 h-5 text-red-500" />, info: <HiOutlineInformationCircle className="w-5 h-5 text-blue-500" /> };
const bg = { success: 'bg-green-50 border-green-100', error: 'bg-red-50 border-red-100', info: 'bg-blue-50 border-blue-100' };

const Toast = () => {
  const { toasts, removeToast } = useToastStore();
  return (
    <div className="fixed top-24 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id} initial={{opacity:0,x:100,scale:0.9}} animate={{opacity:1,x:0,scale:1}} exit={{opacity:0,x:100,scale:0.9}} transition={{type:'spring',duration:0.4}}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-2xl border shadow-soft-lg backdrop-blur-sm ${bg[t.type]}`}>
            {icons[t.type]}
            <p className="flex-1 text-sm font-medium text-brand-dark">{t.message}</p>
            <button onClick={() => removeToast(t.id)} className="p-1 rounded-lg hover:bg-white/50"><HiOutlineX className="w-4 h-4 text-brand-muted" /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
