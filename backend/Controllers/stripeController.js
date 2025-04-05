const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const pool = require("../database"); 


const createCheckoutSession=  async (req, res) => {
  const { cartItems, userEmail } = req.body;

  const line_items = cartItems.map(item => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
      },
      unit_amount: item.price * 100, // amount in cents
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      customer_email: userEmail,
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong creating session" });
  }
};




const handleCheckoutSuccess = async (req, res) => {
    try {
      const { clear_cart, email } = req.query;
      
      if (clear_cart === 'true' && email) {
        // Call the database directly to clear the cart
        const query = "DELETE FROM cart_items WHERE user_email = $1";
        await pool.query(query, [email]);
        
        // Redirect to homepage
        return res.redirect('/');
      } else {
        return res.redirect('/');
      }
    } catch (error) {
      console.error('Error handling checkout success:', error);
      return res.redirect('/');
    }
  };
  

module.exports = {createCheckoutSession, handleCheckoutSuccess}
