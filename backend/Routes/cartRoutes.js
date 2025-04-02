const express = require("express")
const { addToCart, getCart, updateCartItem, removeFromCart } = require("../Controllers/cartControllers")
const router = express.Router()

router.post('/add', addToCart);
router.get('/getusercart', getCart);
router.post('/update', updateCartItem);
router.delete('/remove',removeFromCart );

module.exports= router;