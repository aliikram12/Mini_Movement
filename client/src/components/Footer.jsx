import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineClock } from 'react-icons/hi';
import { FaWhatsapp, FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => (
  <footer className="bg-gradient-to-b from-cream-light to-white border-t border-baby-pink/20">
    <div className="container-custom py-12 md:py-16">
      <div className="bg-hero-gradient rounded-3xl p-8 md:p-12 text-center mb-12 md:mb-16 shadow-soft-lg relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="font-playfair text-2xl md:text-3xl font-bold text-brand-dark mb-3">Join the Mini Movements Family</h3>
          <p className="text-brand-medium text-sm mb-6 max-w-md mx-auto">Get exclusive offers and heartwarming stories delivered to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto items-center">
            <input type="email" placeholder="Your email" className="input-field flex-1 text-center sm:text-left w-full sm:w-auto" />
            <button className="btn-warm whitespace-nowrap !px-6 w-full sm:w-auto">Subscribe</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 mb-12">
        <div className="flex flex-col items-center">
          <h4 className="text-sm font-semibold text-brand-dark mb-6 uppercase tracking-wider text-center">Follow Us</h4>
          <div className="flex gap-3 sm:gap-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-baby-pink/20 flex items-center justify-center text-brand-light hover:bg-blue-600 hover:text-white transition-all">
              <FaFacebookF className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-baby-pink/20 flex items-center justify-center text-brand-light hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500 hover:text-white transition-all">
              <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-baby-pink/20 flex items-center justify-center text-brand-light hover:bg-black hover:text-white transition-all">
              <FaTwitter className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-baby-pink/20 flex items-center justify-center text-brand-light hover:bg-blue-700 hover:text-white transition-all">
              <FaLinkedinIn className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
          <div className="text-center">
            <h4 className="text-sm font-semibold text-brand-dark mb-4 uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2.5">
              {['All Products', 'New Arrivals', 'Best Sellers', 'Sale Items'].map(l => (
                <li key={l}><Link to="/products" className="text-sm text-brand-light hover:text-brand-dark transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div className="text-center">
            <h4 className="text-sm font-semibold text-brand-dark mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              {['About Us', 'Careers', 'Blog', 'Privacy Policy'].map(l => (
                <li key={l}><a href="#" className="text-sm text-brand-light hover:text-brand-dark transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="text-center">
            <h4 className="text-sm font-semibold text-brand-dark mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-sm text-brand-light">
                <HiOutlineMail className="w-4 h-4 text-brand-warm flex-shrink-0" />
                <span className="break-all">hello@minimovements.com</span>
              </li>
              <li className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-sm text-brand-light">
                <HiOutlinePhone className="w-4 h-4 text-brand-warm flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 text-sm text-brand-light">
                <HiOutlineLocationMarker className="w-4 h-4 text-brand-warm flex-shrink-0 mt-0.5" />
                <span>123 Keepsake Lane, Memory City, MC 12345</span>
              </li>
              <li className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-sm text-brand-light">
                <HiOutlineClock className="w-4 h-4 text-brand-warm flex-shrink-0" />
                <span>Mon-Fri: 9AM - 6PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-baby-pink/20 gap-4 text-center">
        <p className="text-xs text-brand-muted">© {new Date().getFullYear()} Mini Movements. Made with love</p>
        <div className="flex items-center gap-2 justify-center flex-wrap">
          {['Visa', 'MC', 'Amex', 'PayPal'].map(c => (
            <span key={c} className="px-2 py-1 bg-baby-pink/10 rounded-lg text-[10px] font-medium text-brand-light">{c}</span>
          ))}
        </div>
      </div>
    </div>

    <a href="https://wa.me/15551234567" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all">
      <FaWhatsapp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
    </a>
  </footer>
);

export default Footer;
