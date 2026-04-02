import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineShoppingCart, HiOutlineEye, HiStar } from 'react-icons/hi';
import useCartStore from '../store/cartStore';
import useToastStore from '../store/toastStore';

const ProductCard = ({ product, index = 0 }) => {
  const addItem = useCartStore(s => s.addItem);
  const toast = useToastStore();
  const handleAdd = (e) => { e.preventDefault(); e.stopPropagation(); addItem(product); toast.success(`${product.name} added to cart!`); };
  const disc = product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5, delay: index * 0.1 }} className="group">
      <div className="card card-hover h-full flex flex-col">
        <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-cream to-baby-pink/20">
          <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && <span className="badge bg-brand-warm/20 text-brand-warm">⭐ Featured</span>}
            {disc > 0 && <span className="badge bg-red-50 text-red-500">-{disc}%</span>}
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-10">
            <button onClick={handleAdd} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/90 backdrop-blur-sm rounded-xl text-brand-dark text-sm font-semibold hover:bg-white hover:text-brand-warm hover:shadow-soft-lg transition-all shadow-soft active:scale-95">
              <HiOutlineShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <p className="text-[11px] uppercase tracking-wider text-brand-warm font-medium mb-1.5">{product.category}</p>
          <Link to={`/product/${product._id}`}><h3 className="font-poppins text-base font-semibold text-brand-dark mb-1.5 line-clamp-1 group-hover:text-brand-warm transition-colors">{product.name}</h3></Link>
          <p className="text-xs text-brand-light line-clamp-2 mb-3 flex-1">{product.shortDescription || product.description}</p>
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_,i) => <HiStar key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? 'text-brand-warm' : 'text-gray-200'}`} />)}
            <span className="text-[11px] text-brand-muted ml-1">({product.numReviews})</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-cream-dark/30">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-brand-dark">${product.price}</span>
              {product.comparePrice > 0 && <span className="text-sm text-brand-muted line-through">${product.comparePrice}</span>}
            </div>
            <Link to={`/product/${product._id}`} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-warm/10 text-brand-warm hover:bg-brand-warm/20 transition-all shadow-sm text-xs font-semibold">
              <HiOutlineEye className="w-4 h-4" /> View
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
