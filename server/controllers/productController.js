const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort, featured } = req.query;
    let query = {};
    if (category && category !== 'all') query.category = category;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (featured === 'true') query.featured = true;

    let sortOpt = { createdAt: -1 };
    if (sort === 'price-asc') sortOpt = { price: 1 };
    if (sort === 'price-desc') sortOpt = { price: -1 };
    if (sort === 'rating') sortOpt = { rating: -1 };

    const products = await Product.find(query).sort(sortOpt).lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createProduct = async (req, res) => {
  try { 
    const { name, price, category, description } = req.body;
    if (!name || isNaN(price) || !category || !description) {
      return res.status(400).json({ message: 'Validation Error', error: 'Please fill all required fields correctly.' });
    }
    res.status(201).json(await Product.create(req.body)); 
  }
  catch (err) { res.status(500).json({ message: 'Server error', error: err.message }); }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    if (!name || isNaN(price) || !category || !description) {
      return res.status(400).json({ message: 'Validation Error', error: 'Please fill all required fields correctly.' });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { res.status(500).json({ message: 'Server error', error: err.message }); }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};
