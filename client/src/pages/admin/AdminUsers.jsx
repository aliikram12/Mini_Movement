import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineMail, HiOutlineUser, HiOutlineShieldCheck, HiOutlineLockClosed } from 'react-icons/hi';
import { getUsers, updateUser, deleteUser } from '../../services/api';
import Modal from '../../components/Modal';
import InputField from '../../components/InputField';
import useToastStore from '../../store/toastStore';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'user', password: '' });
  const toast = useToastStore();

  const loadUsers = () => {
    setLoading(true);
    getUsers()
      .then(r => setUsers(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(loadUsers, []);

  const openEdit = (u) => {
    setEditId(u._id);
    setForm({ name: u.name, email: u.email, role: u.role, password: '' });
    setShowModal(true);
  };

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form };
      if (!data.password) delete data.password;
      await updateUser(editId, data);
      toast.success('User updated successfully');
      setShowModal(false);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted successfully');
      loadUsers();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-brand-dark">User Management</h1>
          <p className="text-sm text-brand-light">{users.length} total registered members</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-cream/50 border-b border-cream-dark/10">
                {['User Info', 'Email', 'Role', 'Joined Date', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-brand-medium uppercase tracking-wider font-poppins">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark/10 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-brand-muted">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-2 border-brand-warm/30 border-t-brand-warm rounded-full animate-spin" />
                      <p className="text-xs">Fetching users...</p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-brand-muted italic">No users found in the system.</td></tr>
              ) : (
                users.map((u, i) => (
                  <motion.tr 
                    key={u._id} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: i * 0.03 }} 
                    className="group hover:bg-cream-light/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-hero-gradient flex items-center justify-center text-sm font-bold text-brand-dark shadow-sm border border-white/50">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-brand-dark font-poppins">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-light font-inter">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                        u.role === 'admin' 
                          ? 'bg-purple-50 text-purple-600 border border-purple-100' 
                          : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {u.role === 'admin' && <HiOutlineShieldCheck className="w-3.5 h-3.5" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-brand-muted font-inter">
                      {new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openEdit(u)} 
                          className="p-2 rounded-xl bg-blue-50 text-blue-400 hover:bg-blue-100 hover:text-blue-600 transition-all shadow-sm"
                          title="Edit User"
                        >
                          <HiOutlinePencil className="w-4.5 h-4.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(u._id)} 
                          className="p-2 rounded-xl bg-red-50 text-red-300 hover:bg-red-100 hover:text-red-500 transition-all shadow-sm"
                          title="Delete User"
                        >
                          <HiOutlineTrash className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title="Edit User Profile" 
        size="md"
      >
        <form onSubmit={submit} className="space-y-5">
          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-500 shadow-sm">
                <HiOutlineShieldCheck className="w-6 h-6" />
             </div>
             <div>
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Administrative Action</p>
                <p className="text-[11px] text-blue-400">Updating member status and credentials</p>
             </div>
          </div>

          <InputField 
            label="Full Name" 
            name="name" 
            value={form.name} 
            onChange={change} 
            required 
            icon={<HiOutlineUser className="w-4.5 h-4.5" />}
          />
          
          <InputField 
            label="Email Address" 
            name="email" 
            type="email" 
            value={form.email} 
            onChange={change} 
            required 
            icon={<HiOutlineMail className="w-4.5 h-4.5" />}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-brand-medium">Account Role</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted"><HiOutlineShieldCheck className="w-4.5 h-4.5" /></span>
              <select 
                name="role" 
                value={form.role} 
                onChange={change} 
                className="input-field pl-11 shadow-sm appearance-none cursor-pointer"
              >
                <option value="user">Standard Member</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          <InputField 
            label="New Password (Leave blank to keep current)" 
            name="password" 
            type="password" 
            value={form.password} 
            onChange={change} 
            placeholder="••••••••"
            icon={<HiOutlineLockClosed className="w-4.5 h-4.5" />}
          />

          <div className="flex gap-3 pt-4">
            <button 
              type="submit" 
              className="flex-1 py-3.5 bg-brand-warm text-white rounded-2xl text-sm font-bold shadow-soft-xl hover:shadow-warm transition-all hover:-translate-y-0.5 active:scale-95"
            >
              Save Variations
            </button>
            <button 
              type="button" 
              onClick={() => setShowModal(false)} 
              className="px-6 py-3.5 bg-gray-50 text-gray-400 rounded-2xl text-sm font-bold hover:bg-gray-100 transition-all border border-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUsers;
