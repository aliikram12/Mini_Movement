import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShoppingBag, HiOutlineUser, HiOutlineMenu, HiOutlineX, HiOutlineLogout, HiOutlineViewGrid } from 'react-icons/hi';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';
import { logoutUser } from '../services/api';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();
  const navigate = useNavigate();
  const count = useCartStore(s => s.getItemCount());
  const { isAuthenticated, user, logout: storeLogout } = useAuthStore();
  const toast = useToastStore();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  useEffect(() => { setOpen(false); setUserMenuOpen(false); }, [loc]);

  const handleLogout = async () => {
    try {
      // 1. Tell backend to clear cookies
      await logoutUser();
      // 2. Clear store and UI state
      storeLogout();
      setUserMenuOpen(false);
      // 3. Hard Refresh + Redirect for a clean slate
      toast.success('Signed out safely. See you soon! 🧸👋');
      window.location.href = '/'; 
    } catch (e) {
      console.error("Logout error:", e);
      // Even if network fails, force client-side logout
      storeLogout();
      window.location.href = '/';
    }
  };

  const links = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
    { to: '/custom-order', label: 'Create Your Teddy' },
  ];

  return (
    <>
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'glass-strong shadow-soft py-3' : 'bg-transparent py-5'}`}>
        <div className="container-custom flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-hero-gradient flex items-center justify-center shadow-soft group-hover:shadow-pink transition-all">
              <span className="text-brand-dark font-playfair font-bold text-lg">M</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-playfair font-bold text-brand-dark text-lg leading-none">Mini Movements</h1>
              <p className="text-[9px] text-brand-muted tracking-[0.2em] uppercase">Keepsake Teddy Bears</p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {links.map(l => (
              <Link key={l.to} to={l.to} className={`text-sm font-medium relative group transition-all ${loc.pathname === l.to ? 'text-brand-dark' : 'text-brand-light hover:text-brand-dark'}`}>
                {l.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-gradient-to-r from-brand-warm to-baby-pink transition-all duration-300 ${loc.pathname === l.to ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link to="/cart" className="relative p-2.5 rounded-2xl hover:bg-baby-pink/20 transition-all group">
              <HiOutlineShoppingBag className="w-5 h-5 text-brand-medium group-hover:text-brand-dark" />
              {count > 0 && <motion.span initial={{scale:0}} animate={{scale:1}} className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-warm text-white text-[10px] font-bold rounded-full flex items-center justify-center">{count}</motion.span>}
            </Link>
            
            <div className="relative">
              <button 
                onClick={() => isAuthenticated ? setUserMenuOpen(!userMenuOpen) : navigate('/login')}
                className="p-2.5 rounded-2xl hover:bg-baby-blue/20 transition-all group"
              >
                <HiOutlineUser className={`w-5 h-5 transition-colors ${isAuthenticated ? 'text-brand-warm' : 'text-brand-medium group-hover:text-brand-dark'}`} />
              </button>

              <AnimatePresence>
                {userMenuOpen && isAuthenticated && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 glass-strong rounded-3xl shadow-soft-xl p-2 border border-white/40 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-baby-pink/10 mb-1">
                      <p className="text-xs text-brand-muted">Signed in as</p>
                      <p className="text-sm font-semibold text-brand-dark truncate">{user.name}</p>
                    </div>
                    
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm text-brand-medium hover:bg-baby-pink/20 hover:text-brand-dark transition-all">
                      <HiOutlineViewGrid className="w-4 h-4" /> Dashboard
                    </Link>

                    {user.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm text-brand-medium hover:bg-baby-blue/20 hover:text-brand-dark transition-all">
                        <span className="w-4 h-4 flex items-center justify-center text-[10px] font-bold border border-current rounded-md">A</span> Admin Panel
                      </Link>
                    )}

                    <hr className="my-1 border-baby-pink/10" />
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm text-red-400 hover:bg-red-50 transition-all"
                    >
                      <HiOutlineLogout className="w-4 h-4" /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => setOpen(!open)} className="lg:hidden p-2.5 rounded-2xl hover:bg-baby-pink/20">
              {open ? <HiOutlineX className="w-5 h-5" /> : <HiOutlineMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 top-[72px] z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div initial={{y:-20,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-20,opacity:0}} className="relative glass-strong m-4 rounded-3xl shadow-soft-xl p-6 flex flex-col gap-2">
              {links.map((l,i) => (
                <motion.div key={l.to} initial={{x:-20,opacity:0}} animate={{x:0,opacity:1}} transition={{delay:i*0.05}}>
                  <Link to={l.to} className={`block px-4 py-3 rounded-2xl text-sm font-medium ${loc.pathname===l.to?'bg-baby-pink/20 text-brand-dark':'text-brand-light hover:bg-cream/50'}`}>{l.label}</Link>
                </motion.div>
              ))}
              <hr className="border-baby-pink/20 my-1" />
              <Link to={isAuthenticated?'/dashboard':'/login'} className="block px-4 py-3 rounded-2xl text-sm font-medium text-brand-light hover:bg-cream/50">{isAuthenticated?'My Account':'Sign In'}</Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
