import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useToastStore from '../../store/toastStore';
import { getAllOrders, updateOrderStatus } from '../../services/api';

const sc = { pending:'bg-yellow-50 text-yellow-600', processing:'bg-blue-50 text-blue-600', shipped:'bg-purple-50 text-purple-600', delivered:'bg-green-50 text-green-600', cancelled:'bg-red-50 text-red-600' };

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToastStore();
  const fetch = () => { setLoading(true); getAllOrders().then(r => setOrders(r.data)).catch(console.error).finally(() => setLoading(false)); };
  useEffect(fetch, []);
  const update = async (id, status) => { try { await updateOrderStatus(id, { status }); toast.success(`Updated to ${status}`); fetch(); } catch { toast.error('Failed'); } };

  return (
    <div>
      <div className="mb-8"><h1 className="font-playfair text-2xl font-bold text-brand-dark">Orders</h1><p className="text-sm text-brand-light">{orders.length} total</p></div>
      <div className="card overflow-hidden"><div className="overflow-x-auto"><table className="w-full">
        <thead><tr className="bg-cream/50">{['Order','Customer','Items','Total','Status','Date','Action'].map(h=><th key={h} className="px-5 py-4 text-left text-xs font-semibold text-brand-medium uppercase tracking-wider">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-cream-dark/10">
          {loading ? <tr><td colSpan="7" className="px-6 py-12 text-center text-brand-muted">Loading...</td></tr>
          : orders.length === 0 ? <tr><td colSpan="7" className="px-6 py-12 text-center text-brand-muted">No orders</td></tr>
          : orders.map((o,i) => (
            <motion.tr key={o._id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}} className="hover:bg-cream-light/50">
              <td className="px-5 py-4 text-sm font-medium text-brand-dark font-mono">#{o._id.slice(-8).toUpperCase()}</td>
              <td className="px-5 py-4"><p className="text-sm font-medium text-brand-dark">{o.user?.name||'N/A'}</p><p className="text-xs text-brand-muted">{o.user?.email}</p></td>
              <td className="px-5 py-4 text-sm text-brand-light">{o.items?.length} items</td>
              <td className="px-5 py-4 text-sm font-semibold text-brand-dark">${o.totalAmount?.toFixed(2)}</td>
              <td className="px-5 py-4"><span className={`badge ${sc[o.status]}`}>{o.status?.charAt(0).toUpperCase()+o.status?.slice(1)}</span></td>
              <td className="px-5 py-4 text-xs text-brand-muted">{new Date(o.createdAt).toLocaleDateString()}</td>
              <td className="px-5 py-4"><select value={o.status} onChange={e=>update(o._id,e.target.value)} className="text-xs border border-cream-dark/20 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-baby-pink">{['pending','processing','shipped','delivered','cancelled'].map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}</select></td>
            </motion.tr>
          ))}
        </tbody>
      </table></div></div>
    </div>
  );
};

export default AdminOrders;
