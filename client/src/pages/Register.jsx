import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi';
import InputField from '../components/InputField';
import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';
import { registerUser } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore(s => s.setAuth);
  const toast = useToastStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const handle = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setErrors({ ...errors, [e.target.name]: '' }); };

  const submit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = 'Name is required';
    if (!form.email) err.email = 'Email is required';
    if (form.password.length < 6) err.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword) err.confirmPassword = 'Passwords don\'t match';
    if (Object.keys(err).length) { setErrors(err); return; }
    setLoading(true);
    try {
      const { data } = await registerUser({ name: form.name, email: form.email, password: form.password });
      setAuth(data.user, data.accessToken);
      toast.success(`Welcome to Mini Movements, ${data.user.name}! 🧸💕`);
      navigate('/');
    } catch (e) { toast.error(e.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-hero-gradient flex items-center justify-center">
      <div className="absolute inset-0"><div className="absolute top-20 right-10 w-72 h-72 bg-lavender/30 rounded-full blur-3xl" /><div className="absolute bottom-20 left-10 w-80 h-80 bg-baby-pink/30 rounded-full blur-3xl" /></div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md mx-4">
        <div className="glass-strong p-8 md:p-10 rounded-3xl shadow-soft-xl">
          <div className="text-center mb-8">
            <img src="/logo.jpeg" alt="Logo" className="w-14 h-14 mx-auto mb-4 rounded-2xl object-contain shadow-soft" />
            <h1 className="font-playfair text-2xl font-bold text-brand-dark">Create Account</h1>
            <p className="text-sm text-brand-light mt-1">Join the Mini Movements family</p>
          </div>
          <form onSubmit={submit}>
            <InputField label="Full Name" name="name" value={form.name} onChange={handle} placeholder="Jane Doe" error={errors.name} required icon={<HiOutlineUser className="w-4 h-4" />} />
            <InputField label="Email" name="email" type="email" value={form.email} onChange={handle} placeholder="jane@example.com" error={errors.email} required icon={<HiOutlineMail className="w-4 h-4" />} />
            <InputField label="Password" name="password" type="password" value={form.password} onChange={handle} placeholder="At least 6 characters" error={errors.password} required icon={<HiOutlineLockClosed className="w-4 h-4" />} />
            <InputField label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handle} placeholder="Repeat password" error={errors.confirmPassword} required icon={<HiOutlineLockClosed className="w-4 h-4" />} />
            <button type="submit" disabled={loading} className="btn-warm w-full mt-2">{loading ? 'Creating account...' : 'Create Account'}</button>
          </form>
          <p className="text-center text-sm text-brand-light mt-6">Already have an account? <Link to="/login" className="text-brand-dark font-semibold hover:text-brand-warm transition-colors">Sign In</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
