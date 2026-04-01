import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineSearch, HiOutlineAdjustments } from 'react-icons/hi';
import ProductCard from '../components/ProductCard';
import { SkeletonGrid } from '../components/Loader';
import { getProducts } from '../services/api';

const categories = ['All', 'Classic Bears', 'Premium Bears', 'Mini Bears', 'Gift Sets', 'Accessories'];
const sortOptions = [{ value: '', label: 'Newest' }, { value: 'price-asc', label: 'Price: Low → High' }, { value: 'price-desc', label: 'Price: High → Low' }, { value: 'rating', label: 'Top Rated' }];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category !== 'All') params.category = category;
    if (sort) params.sort = sort;
    const t = setTimeout(() => { getProducts(params).then(r => setProducts(r.data)).catch(console.error).finally(() => setLoading(false)); }, 300);
    return () => clearTimeout(t);
  }, [search, category, sort]);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream-light">
      {/* Header */}
      <div className="bg-hero-gradient py-16 mb-8">
        <div className="container-custom text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-medium text-brand-warm tracking-wider uppercase mb-3">Our Collection</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-playfair text-3xl md:text-4xl font-bold text-brand-dark mb-4">Keepsake Teddy Bears</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-brand-medium max-w-md mx-auto">Each bear is handcrafted and ready to be dressed in your baby's most precious outfit</motion.p>
        </div>
      </div>

      <div className="container-custom">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
          <div className="relative flex-1 w-full">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bears..." className="input-field pl-12 w-full" />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <select value={sort} onChange={e => setSort(e.target.value)} className="input-field !py-3 min-w-[160px]">
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button onClick={() => setShowFilters(!showFilters)} className="md:hidden p-3 rounded-2xl border border-baby-pink/30 bg-white text-brand-medium"><HiOutlineAdjustments className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Categories */}
        <div className={`flex flex-wrap gap-2 mb-8 ${showFilters ? 'block' : 'hidden md:flex'}`}>
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 ${category === c ? 'bg-brand-dark text-white shadow-soft' : 'bg-white text-brand-light hover:bg-baby-pink/20 border border-baby-pink/20'}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Results */}
        <p className="text-sm text-brand-muted mb-6">{products.length} bears found</p>

        {loading ? <SkeletonGrid /> : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🧸</p><p className="text-lg text-brand-light mb-2">No bears found</p><p className="text-sm text-brand-muted">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
