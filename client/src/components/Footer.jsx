import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';

const Footer = () => (
  <footer className="bg-gradient-to-b from-cream-light to-white border-t border-baby-pink/20">
    <div className="container-custom py-16">
      {/* Newsletter */}
      <div className="bg-hero-gradient rounded-3xl p-8 md:p-12 text-center mb-16 shadow-soft-lg relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="font-playfair text-2xl md:text-3xl font-bold text-brand-dark mb-3">Join the Mini Movements Family</h3>
          <p className="text-brand-medium text-sm mb-6 max-w-md mx-auto">Get exclusive offers and heartwarming stories delivered to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Your email" className="input-field flex-1 text-center sm:text-left" />
            <button className="btn-warm whitespace-nowrap !px-6">Subscribe 💌</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-hero-gradient flex items-center justify-center shadow-soft">
              <span className="text-brand-dark font-playfair font-bold text-lg">M</span>
            </div>
            <div>
              <h3 className="font-playfair font-bold text-brand-dark">Mini Movements</h3>
              <p className="text-[9px] text-brand-muted tracking-[0.2em] uppercase">Keepsake Bears</p>
            </div>
          </Link>
          <p className="text-sm text-brand-light leading-relaxed mb-4">Turn your baby&apos;s first outfit into a memory you can hug forever.</p>
          <div className="flex gap-3">
            {['Fb','Ig','Pt','Tw'].map(s => <a key={s} href="#" className="w-9 h-9 rounded-xl bg-baby-pink/20 flex items-center justify-center text-brand-light hover:bg-baby-pink/40 hover:text-brand-dark transition-all text-xs font-bold">{s}</a>)}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-brand-dark mb-4 uppercase tracking-wider">Shop</h4>
          <ul className="space-y-2.5">{['All Bears','Classic Bears','Premium Bears','Gift Sets','Custom Order'].map(l => <li key={l}><Link to="/products" className="text-sm text-brand-light hover:text-brand-dark transition-colors">{l}</Link></li>)}</ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-brand-dark mb-4 uppercase tracking-wider">Company</h4>
          <ul className="space-y-2.5">{['About Us','How It Works','FAQ','Privacy Policy','Terms'].map(l => <li key={l}><a href="#" className="text-sm text-brand-light hover:text-brand-dark transition-colors">{l}</a></li>)}</ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-brand-dark mb-4 uppercase tracking-wider">Contact</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-brand-light"><HiOutlineMail className="w-4 h-4 text-brand-warm" /><span>hello@minimovements.com</span></div>
            <div className="flex items-center gap-3 text-sm text-brand-light"><HiOutlinePhone className="w-4 h-4 text-brand-warm" /><span>+1 (555) 123-4567</span></div>
            <div className="flex items-start gap-3 text-sm text-brand-light"><HiOutlineLocationMarker className="w-4 h-4 text-brand-warm mt-0.5" /><span>123 Keepsake Lane,<br/>Memory City, MC 12345</span></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-baby-pink/20 gap-4">
        <p className="text-xs text-brand-muted">© {new Date().getFullYear()} Mini Movements. Made with 🧸💕</p>
        <div className="flex items-center gap-2">{['Visa','MC','Amex','PayPal'].map(c => <span key={c} className="px-2 py-1 bg-baby-pink/10 rounded-lg text-[10px] font-medium text-brand-light">{c}</span>)}</div>
      </div>
    </div>

    {/* WhatsApp Floating Button */}
    <a href="https://wa.me/15551234567" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all">
      <FaWhatsapp className="w-7 h-7 text-white" />
    </a>
  </footer>
);

export default Footer;
