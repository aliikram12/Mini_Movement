import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import InputField from '../components/InputField';
import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';
import { loginUser } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore(s => s.setAuth);
  const toast = useToastStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const handle = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setErrors({ ...errors, [e.target.name]: '' }); };

  const submit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!form.email) err.email = 'Email is required';
    if (!form.password) err.password = 'Password is required';
    if (Object.keys(err).length) { setErrors(err); return; }
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      setAuth(data.user, data.accessToken);
      toast.success(`Welcome back, ${data.user.name}! 🧸`);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (e) { toast.error(e.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-hero-gradient flex items-center justify-center">
      <div className="absolute inset-0"><div className="absolute top-20 left-10 w-72 h-72 bg-baby-pink/30 rounded-full blur-3xl" /><div className="absolute bottom-20 right-10 w-96 h-96 bg-baby-blue/30 rounded-full blur-3xl" /></div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md mx-4">
        <div className="glass-strong p-8 md:p-10 rounded-3xl shadow-soft-xl">
          <div className="text-center mb-8">
            <img src="/logo.jpeg" alt="Logo" className="w-14 h-14 mx-auto mb-4 rounded-2xl object-contain shadow-soft" />
            <h1 className="font-playfair text-2xl font-bold text-brand-dark">Welcome Back</h1>
            <p className="text-sm text-brand-light mt-1">Sign in to your Mini Movements account</p>
          </div>
          <form onSubmit={submit}>
            <InputField label="Email" name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" error={errors.email} required icon={<HiOutlineMail className="w-4 h-4" />} />
            <InputField label="Password" name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" error={errors.password} required icon={<HiOutlineLockClosed className="w-4 h-4" />} />
            <button type="submit" disabled={loading} className="btn-warm w-full mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-brand-light mt-6">Don't have an account? <Link to="/register" className="text-brand-dark font-semibold hover:text-brand-warm transition-colors">Sign Up</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
