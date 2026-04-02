import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineClock } from 'react-icons/hi';
import { FaWhatsapp, FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => (
  <footer className="bg-gradient-to-b from-cream-light to-white border-t border-baby-pink/20">
    <div className="container-custom py-12 md:py-14 lg:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 mb-12">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to="/" className="inline-block mb-4">
            <img src="/logo.jpeg" alt="Mini Movements" className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-2xl" />
          </Link>
          <h3 className="font-playfair text-lg font-bold text-brand-dark mb-1">Mini Movements</h3>
          <p className="text-sm text-brand-muted mb-2">Keepsake Teddy Bears</p>
          <p className="text-sm text-brand-light leading-relaxed max-w-xs">Turn your baby&apos;s first outfit into a memory you can hug forever.</p>
        </div>

        <div className="sm:col-span-1">
          <h4 className="text-sm font-semibold text-brand-dark uppercase tracking-wider mb-4">Follow Us</h4>
          <div className="flex gap-2.5 sm:gap-3">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-baby-pink/30 flex items-center justify-center text-brand-medium hover:bg-blue-600 hover:text-white transition-all duration-300">
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-baby-pink/30 flex items-center justify-center text-brand-medium hover:bg-pink-500 hover:text-white transition-all duration-300">
              <FaInstagram className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-baby-pink/30 flex items-center justify-center text-brand-medium hover:bg-black hover:text-white transition-all duration-300">
              <FaTwitter className="w-4 h-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-baby-pink/30 flex items-center justify-center text-brand-medium hover:bg-red-500 hover:text-white transition-all duration-300">
              <FaYoutube className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="sm:col-span-1">
          <h4 className="text-sm font-semibold text-brand-dark uppercase tracking-wider mb-4">Shop</h4>
          <ul className="space-y-2.5">
            {['All Products', 'New Arrivals', 'Best Sellers', 'Sale Items'].map(l => (
              <li key={l}><Link to="/products" className="text-sm text-brand-light hover:text-brand-dark transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div className="sm:col-span-1">
          <h4 className="text-sm font-semibold text-brand-dark uppercase tracking-wider mb-4">Company</h4>
          <ul className="space-y-2.5">
            {['About Us', 'Careers', 'Blog', 'Privacy Policy'].map(l => (
              <li key={l}><a href="#" className="text-sm text-brand-light hover:text-brand-dark transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <h4 className="text-sm font-semibold text-brand-dark uppercase tracking-wider mb-4">Contact</h4>
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2.5 text-sm text-brand-light">
              <HiOutlineMail className="w-4 h-4 text-brand-warm flex-shrink-0 mt-0.5" />
              <span className="break-all">hello@minimovements.com</span>
            </li>
            <li className="flex items-center gap-2.5 text-sm text-brand-light">
              <HiOutlinePhone className="w-4 h-4 text-brand-warm flex-shrink-0" />
              <span>+1 (555) 123-4567</span>
            </li>
            <li className="flex items-start gap-2.5 text-sm text-brand-light">
              <HiOutlineLocationMarker className="w-4 h-4 text-brand-warm flex-shrink-0 mt-0.5" />
              <span>123 Keepsake Lane,<br className="hidden sm:block" />Memory City, MC 12345</span>
            </li>
            <li className="flex items-center gap-2.5 text-sm text-brand-light">
              <HiOutlineClock className="w-4 h-4 text-brand-warm flex-shrink-0" />
              <span>Mon-Fri: 9AM - 6PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-6 md:pt-8 border-t border-baby-pink/20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-brand-muted order-2 sm:order-1">© 2026 Mini Movements — Made with love</p>
          <div className="flex items-center gap-1.5 sm:gap-2 order-1 sm:order-2">
            {['Visa', 'MC', 'Amex', 'PayPal'].map(c => (
              <span key={c} className="px-2 py-1 bg-baby-pink/20 rounded text-[10px] sm:text-xs font-medium text-brand-light">{c}</span>
            ))}
          </div>
        </div>
      </div>
    </div>

    <a href="https://wa.me/15551234567" target="_blank" rel="noreferrer" className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all">
      <FaWhatsapp className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
    </a>
  </footer>
);

export default Footer;
