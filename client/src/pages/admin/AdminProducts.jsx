import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import Modal from '../../components/Modal';
import InputField from '../../components/InputField';
import useToastStore from '../../store/toastStore';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/api';

const categories = ['Classic Bears', 'Premium Bears', 'Mini Bears', 'Gift Sets', 'Accessories'];
const empty = { name:'', description:'', shortDescription:'', price:'', comparePrice:'', category:'Classic Bears', stock:'', featured:false, images:[''], tags:'' };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const toast = useToastStore();
  const loadProducts = () => { setLoading(true); getProducts().then(r => setProducts(r.data)).catch(console.error).finally(() => setLoading(false)); };
  useEffect(loadProducts, []);
  const change = (e) => { const { name, value, type, checked } = e.target; setForm({ ...form, [name]: type==='checkbox'?checked:value }); };

  const openCreate = () => { setEditId(null); setForm(empty); setShowModal(true); };
  const openEdit = (p) => { setEditId(p._id); setForm({ name:p.name, description:p.description, shortDescription:p.shortDescription||'', price:p.price, comparePrice:p.comparePrice||'', category:p.category, stock:p.stock, featured:p.featured, images:p.images?.length?p.images:[''], tags:p.tags?.join(', ')||'' }); setShowModal(true); };

  const submit = async (e) => {
    e.preventDefault();
    console.log('Submitting form...', { editId, form });
    try {
      const data = { ...form, price:Number(form.price), comparePrice:Number(form.comparePrice)||0, stock:Number(form.stock), images:form.images.filter(Boolean), tags:form.tags.toString().split(',').map(t=>t.trim()).filter(Boolean) };
      if (editId) { 
        console.log('Updating product:', editId, data);
        await updateProduct(editId, data); 
        toast.success('Updated!'); 
      }
      else { 
        console.log('Creating product:', data);
        await createProduct(data); 
        toast.success('Created!'); 
      }
      setShowModal(false); 
      loadProducts();
    } catch (err) { 
      console.error('Submit error:', err);
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to save product';
      toast.error(msg); 
    }
  };

  const handleDelete = async (id) => { if (!confirm('Delete?')) return; try { await deleteProduct(id); toast.success('Deleted'); loadProducts(); } catch { toast.error('Failed'); } };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="font-playfair text-2xl font-bold text-brand-dark">Products</h1><p className="text-sm text-brand-light">{products.length} total</p></div>
        <button onClick={openCreate} className="btn-warm flex items-center gap-2 !py-2.5 text-sm"><HiOutlinePlus className="w-4 h-4" /> Add Product</button>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-cream/50">{['Product','Category','Price','Stock','Actions'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-brand-medium uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-cream-dark/10">
              {products.map((p,i) => (
                <motion.tr key={p._id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.03 }} className="hover:bg-cream-light/50 transition-colors">
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><img src={p.images?.[0]} alt="" className="w-10 h-10 rounded-xl object-cover" /><div><p className="text-sm font-medium text-brand-dark line-clamp-1">{p.name}</p>{p.featured&&<span className="text-[10px] text-brand-warm font-medium">⭐ Featured</span>}</div></div></td>
                  <td className="px-6 py-4 text-sm text-brand-light">{p.category}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-brand-dark">${p.price}</td>
                  <td className="px-6 py-4"><span className={`badge ${p.stock>10?'bg-green-50 text-green-600':p.stock>0?'bg-yellow-50 text-yellow-600':'bg-red-50 text-red-600'}`}>{p.stock}</span></td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-blue-50 text-brand-light hover:text-blue-500 transition-all mr-1"><HiOutlinePencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(p._id)} className="p-2 rounded-lg hover:bg-red-50 text-brand-light hover:text-red-500 transition-all"><HiOutlineTrash className="w-4 h-4" /></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId?'Edit Product':'New Product'} size="lg">
        <form onSubmit={submit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <InputField label="Name" name="name" value={form.name} onChange={change} required />
            <div className="mb-4"><label className="block text-sm font-medium text-brand-medium mb-1.5">Category</label><select name="category" value={form.category} onChange={change} className="input-field">{categories.map(c=><option key={c}>{c}</option>)}</select></div>
          </div>
          <InputField label="Short Description" name="shortDescription" value={form.shortDescription} onChange={change} />
          <div className="mb-4"><label className="block text-sm font-medium text-brand-medium mb-1.5">Description</label><textarea name="description" value={form.description} onChange={change} required rows="3" className="input-field resize-none" /></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField label="Price ($)" name="price" type="number" value={form.price} onChange={change} required />
            <InputField label="Compare ($)" name="comparePrice" type="number" value={form.comparePrice} onChange={change} />
            <InputField label="Stock" name="stock" type="number" value={form.stock} onChange={change} required />
          </div>
          <InputField label="Image URL" name="images" value={form.images[0] || ''} onChange={e => setForm({...form, images:[e.target.value]})} />
          <InputField label="Tags" name="tags" value={form.tags} onChange={change} placeholder="gift, bestseller" />
          <div className="flex items-center gap-2 mb-4"><input type="checkbox" name="featured" checked={form.featured} onChange={change} id="featured" className="rounded" /><label htmlFor="featured" className="text-sm text-brand-medium">Featured</label></div>
          <div className="flex gap-3 pt-4"><button type="submit" className="btn-warm flex-1">{editId?'Update':'Create'}</button><button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button></div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProducts;
