import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineUpload, HiOutlineX, HiOutlinePhotograph, HiArrowRight, HiArrowLeft } from 'react-icons/hi';
import InputField from '../components/InputField';
import { getProducts, createCustomOrder } from '../services/api';
import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';

const CustomOrder = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const toast = useToastStore();
  const [step, setStep] = useState(1);
  const [bears, setBears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBear, setSelectedBear] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [form, setForm] = useState({ babyName: '', customMessage: '', fullName: '', email: '', phone: '', street: '', city: '', state: '', zip: '', country: 'United States' });
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => { getProducts().then(r => setBears(r.data)).catch(console.error); }, []);

  const handleFiles = (files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, 5);
    setImages(prev => [...prev, ...valid].slice(0, 5));
    valid.forEach(f => { const reader = new FileReader(); reader.onload = (e) => setPreviews(prev => [...prev, e.target.result].slice(0, 5)); reader.readAsDataURL(f); });
  };

  const removeImage = (i) => { setImages(prev => prev.filter((_, idx) => idx !== i)); setPreviews(prev => prev.filter((_, idx) => idx !== i)); };

  const handleDrop = useCallback((e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }, []);

  const handleSubmit = async () => {
    if (!isAuthenticated) { toast.error('Please login first 🧸'); navigate('/login'); return; }
    setLoading(true);
    const toastId = toast.loading?.('Creating your custom keepsake... 🧸✨') || 'loading';
    
    try {
      const fd = new FormData();
      fd.append('teddyProduct', selectedBear._id);
      fd.append('babyName', form.babyName);
      fd.append('customMessage', form.customMessage);
      fd.append('selectedColor', selectedColor);
      fd.append('selectedSize', selectedSize?.name || '');
      fd.append('price', selectedSize?.price || selectedBear.price);
      fd.append('shippingAddress', JSON.stringify({
        fullName: form.fullName, email: form.email, phone: form.phone,
        street: form.street, city: form.city, state: form.state,
        zip: form.zip, country: form.country
      }));
      images.forEach(f => fd.append('outfitImages', f));

      const { data } = await createCustomOrder(fd);
      
      // Success Path
      toast.dismiss?.(toastId);
      toast.success('Your keepsake journey has begun! 🧸💖');
      
      // Navigate to dashboard where they can see their new order
      navigate('/dashboard', { state: { newOrder: data._id } });
    } catch (err) {
      toast.dismiss?.(toastId);
      const msg = err.response?.data?.message || 'Submission failed. Please check your photos and try again.';
      toast.error(msg);
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream-light">
      <div className="bg-hero-gradient py-16 mb-10">
        <div className="container-custom text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-4xl mb-4">✨</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-playfair text-3xl md:text-4xl font-bold text-brand-dark mb-3">Create Your Custom Keepsake</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-brand-medium max-w-lg mx-auto">Choose your bear, upload your baby's outfit, add a personal touch — and we'll handle the magic.</motion.p>
        </div>
      </div>

      <div className="container-custom max-w-4xl">
        {/* Progress */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {['Choose Bear', 'Upload Outfit', 'Personalize', 'Shipping'].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step > i + 1 ? 'bg-green-400 text-white' : step === i + 1 ? 'bg-brand-dark text-white' : 'bg-cream-dark/50 text-brand-muted'}`}>{step > i + 1 ? '✓' : i + 1}</div>
              <span className={`text-xs font-medium hidden sm:inline ${step === i + 1 ? 'text-brand-dark' : 'text-brand-muted'}`}>{s}</span>
              {i < 3 && <div className={`w-8 h-0.5 ${step > i + 1 ? 'bg-green-400' : 'bg-cream-dark/30'}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Choose Bear */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <h2 className="font-playfair text-2xl font-bold text-brand-dark mb-6 text-center">Choose Your Bear 🧸</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {bears.map(b => (
                  <button key={b._id} onClick={() => { setSelectedBear(b); if (b.colors?.length) setSelectedColor(b.colors[0].name); if (b.sizes?.length) setSelectedSize(b.sizes[0]); }}
                    className={`card p-4 text-left transition-all ${selectedBear?._id === b._id ? 'ring-2 ring-brand-warm shadow-soft-lg scale-[1.02]' : 'hover:shadow-soft-lg'}`}>
                    <img src={b.images?.[0]} alt={b.name} className="w-full aspect-square object-cover rounded-2xl mb-3" />
                    <h3 className="font-poppins font-semibold text-sm text-brand-dark line-clamp-1">{b.name}</h3>
                    <p className="text-sm font-bold text-brand-warm mt-1">From ${b.price}</p>
                  </button>
                ))}
              </div>
              {selectedBear && (
                <div className="mt-6 card p-6">
                  {selectedBear.colors?.length > 0 && (
                    <div className="mb-4"><p className="text-sm font-medium text-brand-medium mb-2">Color: {selectedColor}</p>
                      <div className="flex gap-3">{selectedBear.colors.map(c => (<button key={c.name} onClick={() => setSelectedColor(c.name)} style={{ backgroundColor: c.hex }} className={`w-9 h-9 rounded-xl border-2 ${selectedColor === c.name ? 'border-brand-dark scale-110' : 'border-gray-200'}`} />))}</div></div>)}
                  {selectedBear.sizes?.length > 0 && (
                    <div><p className="text-sm font-medium text-brand-medium mb-2">Size</p>
                      <div className="flex flex-wrap gap-2">{selectedBear.sizes.map(s => (<button key={s.name} onClick={() => setSelectedSize(s)} className={`px-4 py-2 rounded-xl text-sm border ${selectedSize?.name === s.name ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-brand-medium border-baby-pink/30'}`}>{s.name} — ${s.price}</button>))}</div></div>)}
                </div>
              )}
              <div className="flex justify-end mt-6">
                <button onClick={() => selectedBear && setStep(2)} disabled={!selectedBear} className="btn-warm inline-flex items-center gap-2 disabled:opacity-50">Next <HiArrowRight className="w-4 h-4" /></button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Upload */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <h2 className="font-playfair text-2xl font-bold text-brand-dark mb-6 text-center">Upload Baby's Outfit 👶</h2>
              <div className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer ${dragActive ? 'border-brand-warm bg-brand-warm/5' : 'border-baby-pink/50 bg-white hover:border-brand-warm/50'}`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}>
                <HiOutlineUpload className="w-10 h-10 text-brand-warm mx-auto mb-4" />
                <p className="text-brand-dark font-semibold mb-1">Drag & drop outfit photos here</p>
                <p className="text-sm text-brand-muted mb-4">or click to browse (max 5 images, up to 5MB each)</p>
                <span className="btn-secondary inline-flex items-center gap-2 text-sm cursor-pointer"><HiOutlinePhotograph className="w-4 h-4" /> Choose Photos</span>
                <input id="file-upload" type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
              </div>
              {previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-6">
                  {previews.map((p, i) => (
                    <div key={i} className="relative group">
                      <img src={p} alt={`Outfit ${i+1}`} className="aspect-square object-cover rounded-2xl shadow-soft" />
                      <button onClick={() => removeImage(i)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"><HiOutlineX className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between mt-8">
                <button onClick={() => setStep(1)} className="btn-secondary inline-flex items-center gap-2"><HiArrowLeft className="w-4 h-4" /> Back</button>
                <button onClick={() => setStep(3)} className="btn-warm inline-flex items-center gap-2">Next <HiArrowRight className="w-4 h-4" /></button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Personalize */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <h2 className="font-playfair text-2xl font-bold text-brand-dark mb-6 text-center">Add a Personal Touch 💌</h2>
              <div className="card p-6 max-w-lg mx-auto">
                <InputField label="Baby's Name" name="babyName" value={form.babyName} onChange={(e) => setForm({...form, babyName: e.target.value})} required placeholder="Little Emma" />
                <div className="mb-4">
                  <label className="block text-sm font-medium text-brand-medium mb-1.5">Custom Message (optional)</label>
                  <textarea name="customMessage" value={form.customMessage} onChange={(e) => setForm({...form, customMessage: e.target.value})} rows="3" className="input-field resize-none" placeholder="Born on March 15, 2024 — Our little miracle 💕" />
                </div>
              </div>
              <div className="flex justify-between mt-8 max-w-lg mx-auto">
                <button onClick={() => setStep(2)} className="btn-secondary inline-flex items-center gap-2"><HiArrowLeft className="w-4 h-4" /> Back</button>
                <button onClick={() => form.babyName && setStep(4)} disabled={!form.babyName} className="btn-warm inline-flex items-center gap-2 disabled:opacity-50">Next <HiArrowRight className="w-4 h-4" /></button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Shipping + Review */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <h2 className="font-playfair text-2xl font-bold text-brand-dark mb-6 text-center">Review & Ship 📦</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h3 className="font-poppins font-semibold text-brand-dark mb-4">Shipping Address</h3>
                  <InputField label="Full Name" name="fullName" value={form.fullName} onChange={(e) => setForm({...form, fullName: e.target.value})} required placeholder="Jane Doe" />
                  <InputField label="Email" name="email" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required placeholder="jane@example.com" />
                  <InputField label="Phone" name="phone" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
                  <InputField label="Street" name="street" value={form.street} onChange={(e) => setForm({...form, street: e.target.value})} required placeholder="123 Main St" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="City" name="city" value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} required />
                    <InputField label="State" name="state" value={form.state} onChange={(e) => setForm({...form, state: e.target.value})} required />
                  </div>
                  <InputField label="ZIP" name="zip" value={form.zip} onChange={(e) => setForm({...form, zip: e.target.value})} required placeholder="10001" />
                </div>
                <div className="card p-6">
                  <h3 className="font-poppins font-semibold text-brand-dark mb-4">Order Review</h3>
                  <div className="flex gap-4 mb-4 p-4 bg-cream-light rounded-2xl">
                    <img src={selectedBear?.images?.[0]} alt="" className="w-16 h-16 rounded-xl object-cover" />
                    <div><p className="font-semibold text-brand-dark">{selectedBear?.name}</p><p className="text-xs text-brand-muted">{selectedColor} • {selectedSize?.name}</p><p className="text-sm font-bold text-brand-warm mt-1">${selectedSize?.price || selectedBear?.price}</p></div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-brand-light">Baby's Name</span><span className="text-brand-dark font-medium">{form.babyName}</span></div>
                    {form.customMessage && <div className="flex justify-between"><span className="text-brand-light">Message</span><span className="text-brand-dark text-xs max-w-[60%] text-right">{form.customMessage}</span></div>}
                    <div className="flex justify-between"><span className="text-brand-light">Outfit Photos</span><span className="text-brand-dark font-medium">{images.length} uploaded</span></div>
                    <hr className="border-cream-dark/20 my-2" />
                    <div className="flex justify-between"><span className="font-semibold text-brand-dark">Total</span><span className="text-xl font-bold text-brand-dark">${selectedSize?.price || selectedBear?.price}</span></div>
                  </div>
                  <button onClick={handleSubmit} disabled={loading || !form.fullName || !form.email || !form.street} className="btn-accent w-full mt-6 flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? 'Creating...' : '🧸 Place Custom Order'}
                  </button>
                </div>
              </div>
              <div className="flex justify-start mt-6">
                <button onClick={() => setStep(3)} className="btn-secondary inline-flex items-center gap-2"><HiArrowLeft className="w-4 h-4" /> Back</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomOrder;
