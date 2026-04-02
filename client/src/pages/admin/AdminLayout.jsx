import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineChartBar, HiOutlineCube, HiOutlineClipboardList, HiOutlineSparkles, HiOutlineUsers, HiOutlineArrowLeft, HiOutlineLogout, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import { logoutUser } from '../../services/api';

const links = [
  { path: '/admin', label: 'Dashboard', icon: <HiOutlineChartBar className="w-5 h-5" />, exact: true },
  { path: '/admin/products', label: 'Products', icon: <HiOutlineCube className="w-5 h-5" /> },
  { path: '/admin/orders', label: 'Orders', icon: <HiOutlineClipboardList className="w-5 h-5" /> },
  { path: '/admin/custom-orders', label: 'Custom Orders', icon: <HiOutlineSparkles className="w-5 h-5" /> },
  { path: '/admin/users', label: 'Users', icon: <HiOutlineUsers className="w-5 h-5" /> },
];

const Sidebar = ({ className = '', loc, setSidebarOpen, handleLogout, user }) => (
  <div className={`w-64 bg-white border-r border-cream-dark/20 flex flex-col ${className}`}>
    <div className="p-6 border-b border-cream-dark/20">
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo.jpeg" alt="Logo" className="w-9 h-9 object-contain rounded-xl" />
        <div>
          <h2 className="text-sm font-bold text-brand-dark leading-none font-poppins">Mini Movements</h2>
          <p className="text-[9px] text-brand-muted tracking-[0.15em] uppercase">Admin Panel</p>
        </div>
      </Link>
    </div>
    <nav className="flex-1 p-4 space-y-1">
      {links.map(l => {
        const active = l.exact ? loc.pathname === l.path : loc.pathname.startsWith(l.path);
        return (
          <Link 
            key={l.path} 
            to={l.path} 
            onClick={() => setSidebarOpen(false)} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? 'bg-baby-pink/20 text-brand-dark shadow-sm' : 'text-brand-light hover:bg-cream hover:text-brand-dark'}`}
          >
            {l.icon}{l.label}
          </Link>
        );
      })}
    </nav>
    <div className="p-4 border-t border-cream-dark/20 space-y-1">
      <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-brand-light hover:bg-cream transition-all"><HiOutlineArrowLeft className="w-5 h-5" /> Back to Store</Link>
      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 transition-all"><HiOutlineLogout className="w-5 h-5" /> Sign Out</button>
      <div className="flex items-center gap-3 px-4 py-2">
        <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center text-xs font-bold text-brand-dark">{user?.name?.[0]}</div>
        <div className="min-w-0"><p className="text-xs font-medium text-brand-dark truncate">{user?.name}</p><p className="text-[10px] text-brand-muted truncate">{user?.email}</p></div>
      </div>
    </div>
  </div>
);

const AdminLayout = () => {
  const loc = useLocation();
  const navigate = useNavigate();
  const { user, logout: storeLogout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => { try { await logoutUser(); } catch {} storeLogout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-cream-light flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-40">
        <Sidebar loc={loc} setSidebarOpen={setSidebarOpen} handleLogout={handleLogout} user={user} />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-50 glass-strong border-b border-cream-dark/20 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-baby-pink/20"><HiOutlineMenu className="w-5 h-5" /></button>
        <h2 className="font-poppins font-bold text-brand-dark text-sm">Admin Panel</h2>
        <div className="w-9" />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm" 
              onClick={() => setSidebarOpen(false)} 
            />
            <motion.div 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative h-full w-72 max-w-[80vw]"
            >
              <Sidebar className="h-full" loc={loc} setSidebarOpen={setSidebarOpen} handleLogout={handleLogout} user={user} />
              <button 
                onClick={() => setSidebarOpen(false)} 
                className="absolute top-4 -right-12 p-2.5 bg-white rounded-xl shadow-soft text-brand-dark hover:scale-110 transition-all focus:outline-none"
              >
                <HiOutlineX className="w-6 h-6" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8"><Outlet /></main>
    </div>
  );
};

export default AdminLayout;
