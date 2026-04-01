import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HiOutlineHeart, HiOutlineGift, HiOutlineSparkles, HiOutlineTruck, HiStar, HiArrowRight } from 'react-icons/hi';
import ProductCard from '../components/ProductCard';
import { SkeletonGrid } from '../components/Loader';
import { getProducts } from '../services/api';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] } }) };

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);

  useEffect(() => { getProducts({ featured: true }).then(r => setFeatured(r.data)).catch(console.error).finally(() => setLoading(false)); }, []);

  const steps = [
    { icon: '🧸', title: 'Choose Your Bear', desc: 'Pick the perfect teddy from our handcrafted collection' },
    { icon: '👶', title: 'Send the Outfit', desc: "Mail us your baby's most precious outfit" },
    { icon: '✨', title: 'We Dress It', desc: 'Our artisans carefully dress your bear with love' },
    { icon: '📦', title: 'Delivered to You', desc: 'A lifelong memory arrives at your doorstep' },
  ];

  const whyUs = [
    { icon: <HiOutlineHeart className="w-7 h-7" />, title: 'Emotional Keepsake', desc: 'Transform fleeting moments into a memory you can hold forever' },
    { icon: <HiOutlineGift className="w-7 h-7" />, title: 'Perfect Gift', desc: 'The most thoughtful gift for new parents and baby showers' },
    { icon: <HiOutlineSparkles className="w-7 h-7" />, title: 'Fully Personalized', desc: 'Custom name embroidery, messages, and outfit selection' },
    { icon: <HiOutlineTruck className="w-7 h-7" />, title: 'Free Shipping', desc: 'Complimentary shipping on all orders over $75' },
  ];

  const testimonials = [
    { name: 'Sarah M.', text: "When I opened the box and saw my daughter's newborn onesie on the most adorable bear, I couldn't stop crying. This is the most meaningful gift I've ever received.", rating: 5, role: 'New Mom' },
    { name: 'Emily & James', text: "We ordered twin bears with our boys' first outfits. Now they sit on their shelves as the most beautiful reminder of how small they once were.", rating: 5, role: 'Parents of Twins' },
    { name: 'Grandma Rose', text: "I ordered this for my granddaughter's first birthday. The quality is incredible, and knowing her tiny dress is preserved this way... it's priceless.", rating: 5, role: 'Proud Grandma' },
  ];

  return (
    <div className="overflow-hidden">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-[100vh] flex items-center bg-hero-gradient overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-baby-pink/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-baby-blue/30 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lavender/20 rounded-full blur-3xl" />
        </div>
        <motion.div style={{ y: heroY }} className="container-custom relative z-10 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" className="max-w-xl">
              <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-brand-medium shadow-soft mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Handcrafted with Love
              </motion.div>
              <motion.h1 variants={fadeUp} custom={1} className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-dark leading-[1.1] mb-6">
                Turn Your Baby's First Outfit Into a Memory You Can{' '}
                <span className="gradient-text">Hug Forever</span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={2} className="text-lg text-brand-light leading-relaxed mb-8 max-w-lg">
                Send us your baby's most precious outfit and we'll lovingly dress a premium teddy bear — creating a keepsake that captures the warmth of those earliest, most magical days.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
                <Link to="/custom-order" className="btn-warm inline-flex items-center gap-2 text-base">
                  Create Your Teddy <HiArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/products" className="btn-secondary inline-flex items-center gap-2 text-base">
                  Browse Collection
                </Link>
              </motion.div>
              <motion.div variants={fadeUp} custom={4} className="flex items-center gap-6 mt-10 pt-8 border-t border-baby-pink/30">
                <div className="text-center"><p className="text-2xl font-bold text-brand-dark font-playfair">2,500+</p><p className="text-xs text-brand-muted">Happy Families</p></div>
                <div className="w-px h-10 bg-baby-pink/30" />
                <div className="text-center"><p className="text-2xl font-bold text-brand-dark font-playfair">4.9 ⭐</p><p className="text-xs text-brand-muted">Average Rating</p></div>
                <div className="w-px h-10 bg-baby-pink/30" />
                <div className="text-center"><p className="text-2xl font-bold text-brand-dark font-playfair">100%</p><p className="text-xs text-brand-muted">Handmade</p></div>
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.85, rotate: 3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }} className="relative hidden lg:flex justify-center">
              <div className="relative w-[420px] h-[500px]">
                <div className="absolute inset-0 bg-white/40 backdrop-blur rounded-[48px] shadow-soft-xl rotate-3" />
                <img src="https://img.drz.lazcdn.com/static/pk/p/38686a49d2e2916f6f54b68e86c745cc.jpg_720x720q80.jpg" alt="Premium keepsake teddy bear" className="relative z-10 w-full h-full object-cover rounded-[40px] shadow-soft-xl" />
                <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute -top-4 -right-4 z-20 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-soft-lg">
                  <p className="text-xs font-bold text-brand-dark">⭐ Top Rated</p>
                  <p className="text-[10px] text-brand-muted">Best Seller 2024</p>
                </motion.div>
                <motion.div animate={{ y: [6, -6, 6] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-4 -left-4 z-20 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-soft-lg">
                  <p className="text-xs font-bold text-brand-dark">💕 2,500+</p>
                  <p className="text-[10px] text-brand-muted">Bears Delivered</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="py-24 bg-section-gradient">
        <div className="container-custom">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-sm font-medium text-brand-warm tracking-wider uppercase mb-3">Simple & Magical</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-playfair text-3xl md:text-4xl font-bold text-brand-dark mb-4">How It Works</motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-brand-light max-w-md mx-auto">Four simple steps to preserve your baby's most precious moments forever</motion.p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.12 }}
                className="relative text-center p-8 rounded-3xl bg-white shadow-soft hover:shadow-soft-lg hover:-translate-y-2 transition-all duration-500 group">
                <div className="absolute top-4 right-4 text-5xl font-playfair font-bold text-cream-dark/30">{i + 1}</div>
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="font-poppins font-semibold text-brand-dark mb-2">{s.title}</h3>
                <p className="text-sm text-brand-light leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ WHY CHOOSE US ═══════════ */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-sm font-medium text-brand-warm tracking-wider uppercase mb-3">Why Mini Movements?</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-playfair text-3xl md:text-4xl font-bold text-brand-dark mb-4">More Than Just a Teddy Bear</motion.h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUs.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-3xl bg-gradient-to-br from-cream-light to-white border border-baby-pink/10 hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-500">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-hero-gradient flex items-center justify-center text-brand-dark shadow-soft">{item.icon}</div>
                <h3 className="font-poppins font-semibold text-brand-dark mb-2">{item.title}</h3>
                <p className="text-sm text-brand-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURED PRODUCTS ═══════════ */}
      <section className="py-24 bg-section-gradient">
        <div className="container-custom">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <motion.p variants={fadeUp} className="text-sm font-medium text-brand-warm tracking-wider uppercase mb-3">Our Collection</motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="font-playfair text-3xl md:text-4xl font-bold text-brand-dark">Handcrafted Keepsake Bears</motion.h2>
            </div>
            <motion.div variants={fadeUp} custom={2}><Link to="/products" className="btn-secondary inline-flex items-center gap-2 text-sm">View All <HiArrowRight className="w-4 h-4" /></Link></motion.div>
          </motion.div>
          {loading ? <SkeletonGrid count={4} /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.slice(0, 4).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ CUSTOM TEDDY BUILDER CTA ═══════════ */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="relative rounded-[40px] bg-hero-gradient p-10 md:p-16 overflow-hidden shadow-soft-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-lavender/20 rounded-full blur-3xl" />
            <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="font-playfair text-3xl md:text-4xl font-bold text-brand-dark mb-5 leading-tight">Create Your Custom Keepsake Teddy</h2>
                <p className="text-brand-medium mb-8 leading-relaxed">Choose your bear, upload your baby's outfit, add a personal message — and we'll create something truly magical. Every stitch tells your story.</p>
                <Link to="/custom-order" className="btn-accent inline-flex items-center gap-2">Start Creating <HiArrowRight className="w-4 h-4" /></Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['Select Your Bear 🧸', 'Upload Outfit 👗', 'Add a Message 💌', 'We Handle the Rest 🎀'].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 text-center shadow-soft hover:shadow-soft-lg transition-all">
                    <p className="text-sm font-medium text-brand-dark">{s}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ INSTAGRAM / SOCIAL PROOF ═══════════ */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-30" />
        <div className="container-custom relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-sm font-medium text-brand-warm tracking-wider uppercase mb-3">Community Magic</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-playfair text-3xl md:text-4xl font-bold text-brand-dark mb-4">As Seen On Instagram</motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-brand-light max-w-md mx-auto">Follow our journey and see the beautiful memories we're creating globally @MiniMovements</motion.p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
               'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRspEnbbFarejUymFvjHfjc9Fcu5gyQINyWZw&s',
               'https://www.shopperspk.com/wp-content/uploads/2020/08/5-Feet-Giant-White-Teddy-Bear-Plush-Toy-DIY-Gift-5FTBXL.jpg',
               'https://www.philflower.com/images/thumbnails/239/239/detailed/24/g-bear-flower-04.jpg',
               'https://rukminim2.flixcart.com/image/480/640/kn6cxow0/stuffed-toy/v/m/v/american-super-quality-brown-120-jasper-original-imagfwvwmkg77hzw.jpeg?q=90'
            ].map((img, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative group overflow-hidden rounded-3xl aspect-square shadow-soft">
                <img src={img} alt="Instagram magic" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <HiOutlineHeart className="w-8 h-8 text-white scale-0 group-hover:scale-100 transition-transform duration-500 delay-100" />
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <a href="#" className="btn-secondary inline-flex items-center gap-2">Follow @MiniMovements</a>
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className="py-24 bg-section-gradient">
        <div className="container-custom">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-sm font-medium text-brand-warm tracking-wider uppercase mb-3">Love Letters</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-playfair text-3xl md:text-4xl font-bold text-brand-dark mb-4">What Our Families Say</motion.h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="card p-8 hover:shadow-soft-xl transition-all duration-500 relative">
                <div className="absolute top-6 right-6 text-5xl font-playfair text-baby-pink/30">"</div>
                <div className="flex gap-1 mb-4">{[...Array(t.rating)].map((_, j) => <HiStar key={j} className="w-4 h-4 text-brand-warm" />)}</div>
                <p className="text-brand-medium text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-cream-dark/20">
                  <div className="w-10 h-10 rounded-full bg-hero-gradient flex items-center justify-center text-sm font-bold text-brand-dark">{t.name[0]}</div>
                  <div><p className="text-sm font-semibold text-brand-dark">{t.name}</p><p className="text-xs text-brand-muted">{t.role}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="py-24 bg-white">
        <div className="container-custom text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.p variants={fadeUp} className="text-5xl mb-6">🧸</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-playfair text-3xl md:text-4xl font-bold text-brand-dark mb-5 max-w-2xl mx-auto">
              Preserve Your Baby's Most Precious Moment Forever
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-brand-light max-w-lg mx-auto mb-8">Every outfit tells a story. Let us help you keep that story alive in the most beautiful way possible.</motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4 justify-center">
              <Link to="/custom-order" className="btn-warm inline-flex items-center gap-2 text-base">Create Your Teddy <HiArrowRight className="w-4 h-4" /></Link>
              <Link to="/products" className="btn-secondary inline-flex items-center gap-2 text-base">Shop Collection</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
