const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelMyOrder
} = require("../controllers/orderController");
const {protect,adminOnly} = require("../middleware/authMiddleware");

router.post('/',protect,createOrder)
router.get('/my',protect,getMyOrders)
router.patch('/:id/cancel',protect,cancelMyOrder)

router.get('/',protect,adminOnly,getAllOrders);
router.patch('/:id/status',protect,adminOnly,updateOrderStatus);

router.get('/:id',protect,getOrderById);

module.exports = router;