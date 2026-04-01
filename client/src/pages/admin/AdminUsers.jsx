import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUsers } from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getUsers().then(r => setUsers(r.data)).catch(console.error).finally(() => setLoading(false)); }, []);

  return (
    <div>
      <div className="mb-8"><h1 className="font-playfair text-2xl font-bold text-brand-dark">Users</h1><p className="text-sm text-brand-light">{users.length} registered</p></div>
      <div className="card overflow-hidden"><div className="overflow-x-auto"><table className="w-full">
        <thead><tr className="bg-cream/50">{['User','Email','Role','Joined'].map(h=><th key={h} className="px-6 py-4 text-left text-xs font-semibold text-brand-medium uppercase tracking-wider">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-cream-dark/10">
          {loading ? <tr><td colSpan="4" className="px-6 py-12 text-center text-brand-muted">Loading...</td></tr>
          : users.map((u,i) => (
            <motion.tr key={u._id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}} className="hover:bg-cream-light/50">
              <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-hero-gradient flex items-center justify-center text-sm font-bold text-brand-dark">{u.name?.[0]?.toUpperCase()}</div><span className="text-sm font-medium text-brand-dark">{u.name}</span></div></td>
              <td className="px-6 py-4 text-sm text-brand-light">{u.email}</td>
              <td className="px-6 py-4"><span className={`badge ${u.role==='admin'?'bg-purple-50 text-purple-600':'bg-blue-50 text-blue-600'}`}>{u.role?.charAt(0).toUpperCase()+u.role?.slice(1)}</span></td>
              <td className="px-6 py-4 text-xs text-brand-muted">{new Date(u.createdAt).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'})}</td>
            </motion.tr>
          ))}
        </tbody>
      </table></div></div>
    </div>
  );
};

export default AdminUsers;
