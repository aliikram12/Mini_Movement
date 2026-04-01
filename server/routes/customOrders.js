const express = require('express');
const { createCustomOrder, getMyCustomOrders, getAllCustomOrders, updateCustomOrderStatus, getCustomOrderStats } = require('../controllers/customOrderController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.post('/', protect, upload.array('outfitImages', 5), createCustomOrder);
router.get('/my', protect, getMyCustomOrders);
router.get('/stats', protect, admin, getCustomOrderStats);
router.get('/', protect, admin, getAllCustomOrders);
router.put('/:id', protect, admin, updateCustomOrderStatus);

module.exports = router;
