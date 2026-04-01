import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useToastStore from '../../store/toastStore';
import { getAllCustomOrders, updateCustomOrderStatus } from '../../services/api';

const sc = { pending:'bg-yellow-50 text-yellow-600', outfit_received:'bg-blue-50 text-blue-600', in_progress:'bg-indigo-50 text-indigo-600', dressing:'bg-pink-50 text-pink-600', quality_check:'bg-amber-50 text-amber-600', ready:'bg-teal-50 text-teal-600', shipped:'bg-purple-50 text-purple-600', delivered:'bg-green-50 text-green-600' };
const statuses = ['pending','outfit_received','in_progress','dressing','quality_check','ready','shipped','delivered'];

const AdminCustomOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToastStore();
  const fetch = () => { setLoading(true); getAllCustomOrders().then(r => setOrders(r.data)).catch(console.error).finally(() => setLoading(false)); };
  useEffect(fetch, []);
  const update = async (id, status) => { try { await updateCustomOrderStatus(id, { status }); toast.success('Updated!'); fetch(); } catch { toast.error('Failed'); } };

  return (
    <div>
      <div className="mb-8"><h1 className="font-playfair text-2xl font-bold text-brand-dark">Custom Orders</h1><p className="text-sm text-brand-light">{orders.length} requests</p></div>
      {loading ? <div className="card p-12 text-center text-brand-muted">Loading...</div>
      : orders.length === 0 ? <div className="card p-12 text-center"><p className="text-5xl mb-3">✨</p><p className="text-brand-light">No custom orders yet</p></div>
      : <div className="space-y-4">{orders.map((o,i) => (
        <motion.div key={o._id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }} className="card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div className="flex gap-4">
              <img src={o.teddyProduct?.images?.[0]} alt="" className="w-16 h-16 rounded-2xl object-cover" />
              <div>
                <p className="font-poppins font-semibold text-brand-dark">{o.teddyProduct?.name}</p>
                <p className="text-sm text-brand-light">Baby: <span className="font-medium text-brand-dark">{o.babyName}</span></p>
                <p className="text-xs text-brand-muted">By: {o.user?.name} ({o.user?.email})</p>
              </div>
            </div>
            <span className={`badge ${sc[o.status]}`}>{o.status.replace(/_/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}</span>
          </div>
          {o.customMessage && <div className="mb-4 p-3 bg-baby-pink/10 rounded-xl"><p className="text-xs text-brand-muted mb-1">Message:</p><p className="text-sm text-brand-medium italic">"{o.customMessage}"</p></div>}
          {o.outfitImages?.length > 0 && (
            <div className="mb-4"><p className="text-xs text-brand-muted mb-2">Outfit Photos:</p><div className="flex gap-2 flex-wrap">{o.outfitImages.map((img,idx) => <img key={idx} src={img} alt="" className="w-20 h-20 rounded-xl object-cover shadow-soft cursor-pointer hover:scale-105 transition-transform" />)}</div></div>
          )}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-cream-dark/20">
            <div className="flex-1"><p className="text-sm text-brand-light">Price: <span className="font-bold text-brand-dark">${o.price}</span></p><p className="text-xs text-brand-muted">{new Date(o.createdAt).toLocaleDateString()}</p></div>
            <select value={o.status} onChange={e=>update(o._id,e.target.value)} className="text-xs border border-cream-dark/20 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-baby-pink">{statuses.map(s=><option key={s} value={s}>{s.replace(/_/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}</option>)}</select>
          </div>
        </motion.div>
      ))}</div>}
    </div>
  );
};

export default AdminCustomOrders;
