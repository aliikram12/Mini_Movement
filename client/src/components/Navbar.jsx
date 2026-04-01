import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShoppingBag, HiOutlineUser, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();
  const count = useCartStore(s => s.getItemCount());
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  useEffect(() => setOpen(false), [loc]);

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
            <Link to={isAuthenticated ? '/dashboard' : '/login'} className="p-2.5 rounded-2xl hover:bg-baby-blue/20 transition-all group">
              <HiOutlineUser className="w-5 h-5 text-brand-medium group-hover:text-brand-dark" />
            </Link>
            {isAuthenticated && user?.role === 'admin' && <Link to="/admin" className="hidden md:inline-flex btn-accent !py-2 !px-4 text-xs">Admin</Link>}
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
