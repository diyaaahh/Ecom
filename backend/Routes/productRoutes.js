const express = require("express");
const { addProduct, getLatestProduct, getRecentProducts, getRecentProductsByCategory, getTopSelling, getProductsByCategory, updateQuantitiesSold } = require("../Controllers/productController");
const upload = require("../Middlewares/upload");

const router = express.Router();

router.post("/add-product", upload.array("pictures", 5), addProduct);
router.get("/getlatest", getLatestProduct);
router.get("/getrecent", getRecentProducts);
router.get("/bycategory", getRecentProductsByCategory);
router.get("/topselling", getTopSelling);
router.get('/category/:category', getProductsByCategory);
router.post('/update-quantity-sold', updateQuantitiesSold);

module.exports = router;