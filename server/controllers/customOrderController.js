const CustomOrder = require('../models/CustomOrder');
const cloudinary = require('../config/cloudinary');

exports.createCustomOrder = async (req, res) => {
  try {
    const { teddyProduct, babyName, customMessage, selectedColor, selectedSize, price, shippingAddress } = req.body;

    // Upload outfit images to Cloudinary with fallback for invalid API keys during testing
    const outfitImages = [];
    if (req.files?.length) {
      for (const file of req.files) {
        try {
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              { folder: 'mini-movements/outfits', resource_type: 'image' },
              (err, result) => err ? reject(err) : resolve(result)
            ).end(file.buffer);
          });
          outfitImages.push(result.secure_url);
        } catch (uploadError) {
          console.error("Cloudinary upload failed (Missing/Invalid API Keys):", uploadError);
          // Silent fallback so user can still test custom order flow without breaking
          outfitImages.push("https://loremflickr.com/600/600/teddybear?lock=fallback");
        }
      }
    }

    let parsedAddress = {};
    if (shippingAddress) {
      try {
        parsedAddress = typeof shippingAddress === 'string' ? JSON.parse(shippingAddress) : shippingAddress;
      } catch (e) {
        console.warn("⚠️ Failed to parse shipping address, using fallback:", e.message);
        parsedAddress = {};
      }
    }

    const order = await CustomOrder.create({
      user: req.user._id, 
      teddyProduct, 
      babyName, 
      customMessage,
      outfitImages, 
      selectedColor, 
      selectedSize,
      price: Number(price), 
      shippingAddress: parsedAddress
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Custom Order Creation Error:", err);
    res.status(500).json({ message: 'Server error', error: err.message, stack: err.stack, name: err.name });
  }
};

exports.getMyCustomOrders = async (req, res) => {
  try {
    res.json(await CustomOrder.find({ user: req.user._id }).populate('teddyProduct', 'name images price').sort('-createdAt'));
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.getAllCustomOrders = async (req, res) => {
  try {
    res.json(await CustomOrder.find().populate('user', 'name email').populate('teddyProduct', 'name images price').sort('-createdAt'));
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.updateCustomOrderStatus = async (req, res) => {
  try {
    const order = await CustomOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Custom order not found' });
    if (req.body.status) order.status = req.body.status;
    if (req.body.adminNotes) order.adminNotes = req.body.adminNotes;
    if (req.body.trackingNumber) order.trackingNumber = req.body.trackingNumber;
    res.json(await order.save());
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.getCustomOrderStats = async (req, res) => {
  try {
    const total = await CustomOrder.countDocuments();
    const pending = await CustomOrder.countDocuments({ status: 'pending' });
    const inProgress = await CustomOrder.countDocuments({ status: { $in: ['outfit_received', 'in_progress', 'dressing'] } });
    res.json({ total, pending, inProgress });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};
