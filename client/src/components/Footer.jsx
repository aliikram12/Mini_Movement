import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineClock } from 'react-icons/hi';
import { FaWhatsapp, FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => (
  <footer className="bg-gradient-to-b from-cream-light to-white border-t border-baby-pink/20">
    <div className="container-custom py-12 md:py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-10 mb-12">
        <div className="col-span-2 md:col-span-4 lg:col-span-1">
          <Link to="/" className="inline-block mb-4">
            <img src="/logo.jpeg" alt="Mini Movements" className="w-16 h-16 object-contain rounded-2xl" />
          </Link>
          <h3 className="font-playfair text-lg font-bold text-brand-dark mb-2">Mini Movements</h3>
          <p className="text-sm text-brand-muted mb-3">Keepsake Teddy Bears</p>
          <p className="text-sm text-brand-light leading-relaxed">Turn your baby&apos;s first outfit into a memory you can hug forever.</p>
        </div>

        <div className="col-span-1">
          <h4 className="text-sm font-semibold text-brand-dark uppercase tracking-wider mb-4">Follow Us</h4>
          <div className="flex gap-3">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-baby-pink/20 flex items-center justify-center text-brand-light hover:bg-blue-600 hover:text-white transition-all duration-300">
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-baby-pink/20 flex items-center justify-center text-brand-light hover:bg-pink-500 hover:text-white transition-all duration-300">
              <FaInstagram className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-baby-pink/20 flex items-center justify-center text-brand-light hover:bg-black hover:text-white transition-all duration-300">
              <FaTwitter className="w-4 h-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-baby-pink/20 flex items-center justify-center text-brand-light hover:bg-red-500 hover:text-white transition-all duration-300">
              <FaYoutube className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="col-span-1">
          <h4 className="text-sm font-semibold text-brand-dark uppercase tracking-wider mb-4">Shop</h4>
          <ul className="space-y-3">
            {['All Products', 'New Arrivals', 'Best Sellers', 'Sale Items'].map(l => (
              <li key={l}><Link to="/products" className="text-sm text-brand-light hover:text-brand-dark transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div className="col-span-1">
          <h4 className="text-sm font-semibold text-brand-dark uppercase tracking-wider mb-4">Company</h4>
          <ul className="space-y-3">
            {['About Us', 'Careers', 'Blog', 'Privacy Policy'].map(l => (
              <li key={l}><a href="#" className="text-sm text-brand-light hover:text-brand-dark transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 md:col-span-4 lg:col-span-1">
          <h4 className="text-sm font-semibold text-brand-dark uppercase tracking-wider mb-4">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-brand-light">
              <HiOutlineMail className="w-4 h-4 text-brand-warm flex-shrink-0 mt-0.5" />
              <span className="break-all">hello@minimovements.com</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-brand-light">
              <HiOutlinePhone className="w-4 h-4 text-brand-warm flex-shrink-0" />
              <span>+1 (555) 123-4567</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-brand-light">
              <HiOutlineLocationMarker className="w-4 h-4 text-brand-warm flex-shrink-0 mt-0.5" />
              <span>123 Keepsake Lane,<br/>Memory City, MC 12345</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-brand-light">
              <HiOutlineClock className="w-4 h-4 text-brand-warm flex-shrink-0" />
              <span>Mon-Fri: 9AM - 6PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-baby-pink/20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-brand-muted">© 2026 Mini Movements — Made with love</p>
          <div className="flex items-center gap-2">
            {['Visa', 'MC', 'Amex', 'PayPal'].map(c => (
              <span key={c} className="px-2 py-1 bg-baby-pink/10 rounded-lg text-[10px] font-medium text-brand-light">{c}</span>
            ))}
          </div>
        </div>
      </div>
    </div>

    <a href="https://wa.me/15551234567" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all">
      <FaWhatsapp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
    </a>
  </footer>
);

export default Footer;
