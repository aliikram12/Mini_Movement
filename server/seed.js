require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const connectDB = require('./config/db');

const products = [
  {
    name: 'Classic Cuddle Bear',
    description: 'Our signature teddy, handcrafted with ultra-soft plush fabric. Send us your baby\'s first outfit, and we\'ll lovingly dress this bear, creating a keepsake that captures the warmth of those earliest days. Each bear is made with premium hypoallergenic materials.',
    shortDescription: 'Premium plush bear dressed in your baby\'s outfit',
    price: 59.99, comparePrice: 79.99,
    category: 'Classic Bears',
    images: ['https://loremflickr.com/600/600/teddybear?lock=10', 'https://loremflickr.com/600/600/teddybear?lock=11'],
    colors: [{ name: 'Honey', hex: '#D4A574' }, { name: 'Cream', hex: '#FFF8E7' }, { name: 'Cocoa', hex: '#8B6914' }],
    sizes: [{ name: 'Small (10")', price: 59.99 }, { name: 'Medium (14")', price: 74.99 }, { name: 'Large (18")', price: 89.99 }],
    stock: 50, rating: 4.9, numReviews: 234, featured: true,
    tags: ['bestseller', 'classic', 'gift'],
    details: [{ label: 'Material', value: 'Premium Plush' }, { label: 'Filling', value: 'Hypoallergenic Fiber' }, { label: 'Age', value: 'All ages' }]
  },
  {
    name: 'Royal Velvet Bear',
    description: 'For the most precious memories, our Royal Velvet Bear is crafted from the finest velvet plush. This luxury bear comes in a beautiful gift box with a personalized name tag. The perfect heirloom to pass down through generations.',
    shortDescription: 'Luxury velvet bear in premium gift packaging',
    price: 89.99, comparePrice: 119.99,
    category: 'Premium Bears',
    images: ['https://loremflickr.com/600/600/teddybear?lock=12', 'https://loremflickr.com/600/600/teddybear?lock=13'],
    colors: [{ name: 'Ivory', hex: '#FFFFF0' }, { name: 'Blush', hex: '#FADADD' }, { name: 'Sage', hex: '#B2D8B2' }],
    sizes: [{ name: 'Medium (14")', price: 89.99 }, { name: 'Large (18")', price: 109.99 }],
    stock: 30, rating: 5.0, numReviews: 89, featured: true,
    tags: ['premium', 'luxury', 'gift', 'heirloom'],
    details: [{ label: 'Material', value: 'Italian Velvet' }, { label: 'Includes', value: 'Gift Box + Name Tag' }]
  },
  {
    name: 'Tiny Pocket Bear',
    description: 'A palm-sized companion that carries a piece of your baby\'s story wherever you go. This adorable mini bear is dressed in a tiny piece of your baby\'s outfit, perfect for keeping in a bag or on a desk. Comes with a keychain attachment.',
    shortDescription: 'Palm-sized keepsake bear with keychain',
    price: 34.99, comparePrice: 44.99,
    category: 'Mini Bears',
    images: ['https://loremflickr.com/600/600/teddybear?lock=14', 'https://loremflickr.com/600/600/teddybear?lock=15'],
    colors: [{ name: 'Tan', hex: '#D2B48C' }, { name: 'White', hex: '#FFFFFF' }, { name: 'Brown', hex: '#8B4513' }],
    sizes: [{ name: 'One Size (5")', price: 34.99 }],
    stock: 100, rating: 4.7, numReviews: 156, featured: true,
    tags: ['mini', 'keychain', 'portable'],
    details: [{ label: 'Size', value: '5 inches' }, { label: 'Includes', value: 'Keychain clip' }]
  },
  {
    name: 'New Baby Welcome Set',
    description: 'The ultimate gift for new parents. This beautifully curated set includes a Classic Cuddle Bear, a milestone blanket, a keepsake box, and a personalized birth certificate card. Everything packaged in our signature gift box.',
    shortDescription: 'Complete gift set with bear, blanket & keepsake box',
    price: 129.99, comparePrice: 179.99,
    category: 'Gift Sets',
    images: ['https://loremflickr.com/600/600/teddybear?lock=16', 'https://loremflickr.com/600/600/teddybear?lock=17'],
    colors: [{ name: 'Pink Set', hex: '#FADADD' }, { name: 'Blue Set', hex: '#CDE7FF' }, { name: 'Neutral Set', hex: '#FFF5E1' }],
    sizes: [],
    stock: 25, rating: 4.9, numReviews: 67, featured: true,
    tags: ['gift', 'baby shower', 'premium', 'set'],
    details: [{ label: 'Includes', value: 'Bear + Blanket + Box + Card' }, { label: 'Packaging', value: 'Premium Gift Box' }]
  },
  {
    name: 'Sleepy Time Bear',
    description: 'Designed for bedtime snuggles, this extra-soft bear features a built-in lavender sachet for calming aromatherapy. Dress it in your baby\'s favorite sleeper for a comforting bedtime companion that smells like sweet dreams.',
    shortDescription: 'Extra-soft bedtime bear with lavender sachet',
    price: 69.99, comparePrice: 84.99,
    category: 'Classic Bears',
    images: ['https://loremflickr.com/600/600/teddybear?lock=18', 'https://loremflickr.com/600/600/teddybear?lock=19'],
    colors: [{ name: 'Baby Blue', hex: '#CDE7FF' }, { name: 'Lavender', hex: '#E6D6FF' }, { name: 'Peach', hex: '#FFDAB9' }],
    sizes: [{ name: 'Medium (14")', price: 69.99 }, { name: 'Large (18")', price: 84.99 }],
    stock: 40, rating: 4.8, numReviews: 112, featured: false,
    tags: ['bedtime', 'lavender', 'soft'],
    details: [{ label: 'Feature', value: 'Lavender sachet included' }, { label: 'Material', value: 'Ultra-soft fleece' }]
  },
  {
    name: 'Heritage Heirloom Bear',
    description: 'Our most prestigious creation. Hand-stitched with meticulous attention to detail, this bear features hand-embroidered paw pads, glass safety eyes, and comes in a walnut keepsake box. A true family heirloom.',
    shortDescription: 'Hand-stitched premium bear in walnut keepsake box',
    price: 149.99, comparePrice: 199.99,
    category: 'Premium Bears',
    images: ['https://loremflickr.com/600/600/teddybear?lock=20', 'https://loremflickr.com/600/600/teddybear?lock=21'],
    colors: [{ name: 'Classic Brown', hex: '#8B6914' }, { name: 'Champagne', hex: '#F7E7CE' }],
    sizes: [{ name: 'Large (18")', price: 149.99 }, { name: 'XL (22")', price: 179.99 }],
    stock: 15, rating: 5.0, numReviews: 34, featured: true,
    tags: ['heirloom', 'premium', 'hand-stitched', 'luxury'],
    details: [{ label: 'Craftsmanship', value: 'Hand-stitched' }, { label: 'Eyes', value: 'Glass safety eyes' }, { label: 'Box', value: 'Walnut keepsake box' }]
  },
  {
    name: 'Twin Bears Set',
    description: 'Double the memories! Two matching bears that can each be dressed in a different outfit. Perfect for twins, or for creating a set — one with a newborn outfit, one with a first birthday outfit.',
    shortDescription: 'Matching pair of bears for double memories',
    price: 99.99, comparePrice: 129.99,
    category: 'Gift Sets',
    images: ['https://loremflickr.com/600/600/teddybear?lock=22', 'https://loremflickr.com/600/600/teddybear?lock=23'],
    colors: [{ name: 'Matching Set', hex: '#FFF5E1' }],
    sizes: [{ name: 'Small Pair (10")', price: 99.99 }, { name: 'Medium Pair (14")', price: 129.99 }],
    stock: 20, rating: 4.8, numReviews: 45, featured: false,
    tags: ['twins', 'set', 'pair', 'gift'],
    details: [{ label: 'Quantity', value: '2 bears' }, { label: 'Matching', value: 'Identical pair' }]
  },
  {
    name: 'Bear Accessory Bundle',
    description: 'Complement your Mini Movements bear with our premium accessory bundle. Includes a personalized ribbon bow, a tiny birth certificate card, a miniature photo frame, and a satin drawstring pouch.',
    shortDescription: 'Premium accessories: bow, card, frame & pouch',
    price: 24.99, comparePrice: 34.99,
    category: 'Accessories',
    images: ['https://loremflickr.com/600/600/teddybear?lock=24', 'https://loremflickr.com/600/600/teddybear?lock=25'],
    colors: [{ name: 'Pink', hex: '#FADADD' }, { name: 'Blue', hex: '#CDE7FF' }, { name: 'Gold', hex: '#FFD700' }],
    sizes: [], stock: 80, rating: 4.6, numReviews: 89, featured: false,
    tags: ['accessories', 'add-on', 'personalized'],
    details: [{ label: 'Includes', value: 'Bow + Card + Frame + Pouch' }]
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    console.log('🗑️  Cleared products');

    if (!(await User.findOne({ email: 'admin@minimovements.com' }))) {
      await User.create({ name: 'Admin', email: 'admin@minimovements.com', password: 'admin123', role: 'admin' });
      console.log('👤 Admin created (admin@minimovements.com / admin123)');
    }

    await Product.insertMany(products);
    console.log(`✅ ${products.length} products seeded`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedDB();
