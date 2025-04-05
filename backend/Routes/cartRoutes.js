const express = require("express")
const { addToCart, getCart, updateCartItem, removeFromCart, clearCart } = require("../Controllers/cartControllers")
const router = express.Router()

router.post('/add', addToCart);
router.get('/getusercart', getCart);
router.post('/update', updateCartItem);
router.delete('/remove',removeFromCart );
router.delete('/clear', clearCart)

module.exports= router;