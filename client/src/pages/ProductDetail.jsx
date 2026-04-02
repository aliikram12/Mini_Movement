import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShoppingCart, HiOutlineHeart, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineRefresh, HiStar, HiArrowLeft } from 'react-icons/hi';
import { getProduct } from '../services/api';
import useCartStore from '../store/cartStore';
import useToastStore from '../store/toastStore';
import { Spinner } from '../components/Loader';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore(s => s.addItem);
  const toast = useToastStore();

  useEffect(() => {
    setLoading(true);
    getProduct(id).then(r => {
      setProduct(r.data);
      if (r.data.colors?.length) setSelectedColor(r.data.colors[0].name);
      if (r.data.sizes?.length) setSelectedSize(r.data.sizes[0]);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    try {
      const p = { ...product, price: selectedSize?.price || product.price };
      await addItem(p, qty, selectedColor, selectedSize?.name || '');
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream-light pt-24"><Spinner size="lg" /></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center bg-cream-light pt-24"><p>Product not found</p></div>;

  const price = selectedSize?.price || product.price;
  const disc = product.comparePrice ? Math.round(((product.comparePrice - price) / product.comparePrice) * 100) : 0;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream-light">
      <div className="container-custom">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-brand-light hover:text-brand-dark mb-8 transition-colors"><HiArrowLeft className="w-4 h-4" /> Back to Collection</Link>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-cream to-baby-pink/10 shadow-soft-lg">
              <AnimatePresence mode="wait">
                <motion.img key={selectedImage} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                  src={product.images?.[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              </AnimatePresence>
              {disc > 0 && <span className="absolute top-4 left-4 badge bg-red-50 text-red-500 shadow-soft">-{disc}% OFF</span>}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-brand-warm shadow-soft scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <p className="text-sm font-medium text-brand-warm tracking-wider uppercase mb-2">{product.category}</p>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-brand-dark mb-3">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex">{[...Array(5)].map((_, i) => <HiStar key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-brand-warm' : 'text-gray-200'}`} />)}</div>
              <span className="text-sm text-brand-muted">({product.numReviews} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-brand-dark">${price}</span>
              {product.comparePrice > 0 && <span className="text-lg text-brand-muted line-through">${product.comparePrice}</span>}
            </div>

            <p className="text-brand-light leading-relaxed mb-8">{product.description}</p>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-brand-medium mb-3">Color: <span className="text-brand-dark">{selectedColor}</span></p>
                <div className="flex gap-3">
                  {product.colors.map(c => (
                    <button key={c.name} onClick={() => setSelectedColor(c.name)}
                      className={`w-10 h-10 rounded-xl border-2 transition-all relative ${selectedColor === c.name ? 'border-brand-dark scale-110 shadow-soft' : 'border-gray-200 hover:border-brand-warm'}`}
                      style={{ backgroundColor: c.hex }} title={c.name}>
                      {selectedColor === c.name && <span className="absolute inset-0 flex items-center justify-center text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-brand-medium mb-3">Size</p>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(s => (
                    <button key={s.name} onClick={() => setSelectedSize(s)}
                      className={`px-5 py-2.5 rounded-2xl text-sm font-medium border transition-all ${selectedSize?.name === s.name ? 'bg-brand-dark text-white border-brand-dark shadow-soft' : 'bg-white text-brand-medium border-baby-pink/30 hover:border-brand-warm'}`}>
                      {s.name} — ${s.price}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center bg-white rounded-2xl border border-baby-pink/30 overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 text-brand-light hover:text-brand-dark transition-colors text-lg font-medium">−</button>
                <span className="px-4 py-3 text-brand-dark font-semibold min-w-[40px] text-center">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-4 py-3 text-brand-light hover:text-brand-dark transition-colors text-lg font-medium">+</button>
              </div>
              <button onClick={handleAdd} disabled={product.stock === 0} className="btn-warm flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <HiOutlineShoppingCart className="w-5 h-5" /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button className="p-3.5 rounded-2xl border border-baby-pink/30 bg-white text-brand-light hover:text-red-400 hover:border-red-200 transition-all"><HiOutlineHeart className="w-5 h-5" /></button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[{ icon: <HiOutlineTruck />, label: 'Free Shipping' }, { icon: <HiOutlineShieldCheck />, label: 'Quality Guaranteed' }, { icon: <HiOutlineRefresh />, label: '30-Day Returns' }].map((f, i) => (
                <div key={i} className="text-center p-3 rounded-2xl bg-section-gradient border border-baby-pink/10">
                  <div className="text-brand-warm text-xl mb-1 flex justify-center">{f.icon}</div>
                  <p className="text-[11px] text-brand-light font-medium">{f.label}</p>
                </div>
              ))}
            </div>

            {/* Details */}
            {product.details?.length > 0 && (
              <div className="border-t border-cream-dark/20 pt-6">
                <h3 className="text-sm font-semibold text-brand-dark mb-4 uppercase tracking-wider">Product Details</h3>
                <div className="space-y-2">{product.details.map((d, i) => (
                  <div key={i} className="flex justify-between text-sm py-2 border-b border-cream-dark/10 last:border-0">
                    <span className="text-brand-light">{d.label}</span><span className="text-brand-dark font-medium">{d.value}</span>
                  </div>
                ))}</div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
