import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineCurrencyDollar, HiOutlineShoppingBag, HiOutlineClock, HiOutlineCheckCircle, HiOutlineCube, HiOutlineUsers, HiOutlineSparkles } from 'react-icons/hi';
import { getOrderStats, getProducts, getUsers, getCustomOrderStats } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalOrders:0, totalRevenue:0, pendingOrders:0, deliveredOrders:0 });
  const [productCount, setProductCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [customStats, setCustomStats] = useState({ total:0, pending:0, inProgress:0 });

  useEffect(() => {
    Promise.allSettled([getOrderStats(), getProducts(), getUsers(), getCustomOrderStats()])
      .then((results) => {
        const [o, p, u, c] = results;
        if (o.status === 'fulfilled' && o.value?.data) setStats(o.value.data);
        if (p.status === 'fulfilled' && p.value?.data) setProductCount(p.value.data.length);
        if (u.status === 'fulfilled' && u.value?.data) setUserCount(u.value.data.length);
        if (c.status === 'fulfilled' && c.value?.data) setCustomStats(c.value.data);
      })
      .catch(console.error);
  }, []);

  const cards = [
    { label:'Revenue', value:`$${stats.totalRevenue.toFixed(2)}`, icon:<HiOutlineCurrencyDollar />, color:'from-green-100 to-green-50', text:'text-green-600' },
    { label:'Total Orders', value:stats.totalOrders, icon:<HiOutlineShoppingBag />, color:'from-blue-100 to-blue-50', text:'text-blue-600' },
    { label:'Pending', value:stats.pendingOrders, icon:<HiOutlineClock />, color:'from-yellow-100 to-yellow-50', text:'text-yellow-600' },
    { label:'Delivered', value:stats.deliveredOrders, icon:<HiOutlineCheckCircle />, color:'from-green-100 to-green-50', text:'text-green-500' },
    { label:'Products', value:productCount, icon:<HiOutlineCube />, color:'from-purple-100 to-purple-50', text:'text-purple-600' },
    { label:'Users', value:userCount, icon:<HiOutlineUsers />, color:'from-pink-100 to-pink-50', text:'text-pink-600' },
    { label:'Custom Orders', value:customStats.total, icon:<HiOutlineSparkles />, color:'from-indigo-100 to-indigo-50', text:'text-indigo-600' },
    { label:'Custom In Progress', value:customStats.inProgress, icon:<HiOutlineSparkles />, color:'from-amber-100 to-amber-50', text:'text-amber-600' },
  ];

  return (
    <div>
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}>
        <h1 className="font-playfair text-2xl font-bold text-brand-dark mb-1">Dashboard</h1>
        <p className="text-brand-light text-sm mb-8">Welcome back! Here's your store overview 🧸</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.06 }}
            className={`rounded-2xl bg-gradient-to-br ${c.color} p-5 shadow-soft hover:shadow-soft-lg transition-all`}>
            <div className="flex items-center justify-between mb-3"><span className={`text-2xl ${c.text}`}>{c.icon}</span><span className="text-[10px] uppercase tracking-wider text-brand-muted font-medium">{c.label}</span></div>
            <p className={`text-2xl font-bold ${c.text}`}>{c.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
