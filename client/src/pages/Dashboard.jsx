import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineUser, HiOutlineShoppingBag, HiOutlineCog, HiOutlineLogout, HiOutlineSparkles } from 'react-icons/hi';
import InputField from '../components/InputField';
import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';
import { getMyOrders, getMyCustomOrders, updateProfile, logoutUser } from '../services/api';

const statusColors = { pending:'bg-yellow-50 text-yellow-600', processing:'bg-blue-50 text-blue-600', shipped:'bg-purple-50 text-purple-600', delivered:'bg-green-50 text-green-600', cancelled:'bg-red-50 text-red-600', outfit_received:'bg-blue-50 text-blue-600', in_progress:'bg-indigo-50 text-indigo-600', dressing:'bg-pink-50 text-pink-600', quality_check:'bg-amber-50 text-amber-600', ready:'bg-teal-50 text-teal-600' };

const tabs = [
  { id:'profile', label:'Profile', icon:<HiOutlineUser className="w-4 h-4" /> },
  { id:'orders', label:'Orders', icon:<HiOutlineShoppingBag className="w-4 h-4" /> },
  { id:'custom', label:'Custom Orders', icon:<HiOutlineSparkles className="w-4 h-4" /> },
  { id:'settings', label:'Settings', icon:<HiOutlineCog className="w-4 h-4" /> },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout: storeLogout } = useAuthStore();
  const toast = useToastStore();
  const [tab, setTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });

  useEffect(() => {
    // Instant Load for all data
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [o, co] = await Promise.all([getMyOrders(), getMyCustomOrders()]);
        setOrders(o.data);
        setCustomOrders(co.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      storeLogout();
      toast.success('Safe travels! 🧸👋');
      window.location.href = '/'; 
    } catch (e) {
      storeLogout();
      window.location.href = '/'; 
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try { await updateProfile(profileForm); toast.success('Profile updated!'); } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream-light">
      <div className="container-custom">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="mb-8">
          <h1 className="font-playfair text-3xl font-bold text-brand-dark">My Account</h1>
          <p className="text-brand-light mt-1">Welcome back, {user?.name} 🧸</p>
        </motion.div>
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}>
            <div className="card p-4">
              <div className="text-center p-4 mb-4">
                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-hero-gradient flex items-center justify-center shadow-soft"><span className="text-2xl font-bold text-brand-dark font-playfair">{user?.name?.[0]}</span></div>
                <h3 className="font-poppins font-semibold text-brand-dark">{user?.name}</h3>
                <p className="text-xs text-brand-muted">{user?.email}</p>
              </div>
              <div className="space-y-1">
                {tabs.map(t => (<button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${tab === t.id ? 'bg-baby-pink/20 text-brand-dark' : 'text-brand-light hover:bg-cream'}`}>{t.icon}{t.label}</button>))}
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 transition-all"><HiOutlineLogout className="w-4 h-4" /> Sign Out</button>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="lg:col-span-3">
            {tab === 'profile' && (
              <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="card p-6">
                <h3 className="font-poppins text-lg font-bold text-brand-dark mb-6">Profile</h3>
                <form onSubmit={handleProfileUpdate}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <InputField label="Name" name="name" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />
                    <InputField label="Email" value={user?.email||''} disabled />
                    <InputField label="Phone" name="phone" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} placeholder="+1 (555) 123-4567" />
                    <InputField label="Role" value={user?.role||'user'} disabled />
                  </div>
                  <button type="submit" className="btn-warm mt-4">Save Changes</button>
                </form>
              </motion.div>
            )}
            {tab === 'orders' && (
              <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="space-y-4">
                <h3 className="font-poppins text-lg font-bold text-brand-dark">Order History</h3>
                {loading ? <div className="card p-8 text-center text-brand-muted">Loading...</div>
                : orders.length === 0 ? <div className="card p-8 text-center"><p className="text-5xl mb-3">📦</p><p className="text-brand-light">No orders yet</p></div>
                : orders.map(o => (
                  <div key={o._id} className="card p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div><p className="text-xs text-brand-muted font-mono">#{o._id.slice(-8).toUpperCase()}</p><p className="text-xs text-brand-muted">{new Date(o.createdAt).toLocaleDateString()}</p></div>
                      <span className={`badge ${statusColors[o.status]}`}>{o.status.charAt(0).toUpperCase()+o.status.slice(1)}</span>
                    </div>
                    <div className="space-y-3">{o.items.map((it,i) => (<div key={i} className="flex items-center gap-3"><img src={it.image} alt={it.name} className="w-12 h-12 rounded-xl object-cover" /><div className="flex-1"><p className="text-sm font-medium text-brand-dark">{it.name}</p><p className="text-xs text-brand-muted">Qty: {it.quantity}</p></div><p className="text-sm font-semibold text-brand-dark">${(it.price*it.quantity).toFixed(2)}</p></div>))}</div>
                    <hr className="border-cream-dark/20 my-4" />
                    <div className="flex justify-between"><span className="text-sm text-brand-light">Total</span><span className="font-bold text-brand-dark">${o.totalAmount?.toFixed(2)}</span></div>
                  </div>
                ))}
              </motion.div>
            )}
            {tab === 'custom' && (
              <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="space-y-4">
                <h3 className="font-poppins text-lg font-bold text-brand-dark">Custom Orders</h3>
                {loading ? <div className="card p-8 text-center text-brand-muted">Loading...</div>
                : customOrders.length === 0 ? <div className="card p-8 text-center"><p className="text-5xl mb-3">✨</p><p className="text-brand-light">No custom orders yet</p></div>
                : customOrders.map(o => (
                  <div key={o._id} className="card p-6">
                    <div className="flex flex-wrap justify-between gap-3 mb-4">
                      <div className="flex gap-3"><img src={o.teddyProduct?.images?.[0]} alt="" className="w-14 h-14 rounded-xl object-cover" /><div><p className="font-semibold text-brand-dark text-sm">{o.teddyProduct?.name}</p><p className="text-xs text-brand-muted">For: {o.babyName}</p></div></div>
                      <span className={`badge ${statusColors[o.status]}`}>{o.status.replace(/_/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}</span>
                    </div>
                    {o.outfitImages?.length>0 && <div className="flex gap-2 mb-3">{o.outfitImages.map((img,i) => <img key={i} src={img} alt="" className="w-16 h-16 rounded-xl object-cover" />)}</div>}
                    <div className="flex justify-between"><span className="text-sm text-brand-light">Total</span><span className="font-bold text-brand-dark">${o.price}</span></div>
                  </div>
                ))}
              </motion.div>
            )}
            {tab === 'settings' && (
              <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="card p-6">
                <h3 className="font-poppins text-lg font-bold text-brand-dark mb-6">Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-cream-light">
                    <div><p className="text-sm font-semibold text-brand-dark">Email Notifications</p><p className="text-xs text-brand-muted">Order updates & promotions</p></div>
                    <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" defaultChecked className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-brand-warm after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" /></label>
                  </div>
                  <div className="p-4 rounded-2xl border border-red-100 bg-red-50/30">
                    <p className="text-sm font-semibold text-red-500 mb-1">Delete Account</p><p className="text-xs text-brand-muted mb-3">This cannot be undone.</p>
                    <button className="text-xs text-red-400 font-medium hover:text-red-500">Delete my account</button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
