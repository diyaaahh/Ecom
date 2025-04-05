import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CartItemCard from "../components/CartItem"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CartPage = () => {
    const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/user/auth", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (error) {
        console.error("User not logged in", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
     
      if (!user || !user.email) {
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`http://localhost:3000/cart/getusercart?userEmail=${user.email}`, {
        withCredentials: true,
      });
      
      setCartItems(response.data.items);
      setTotalItems(response.data.totalItems);
      setSubtotal(response.data.subtotal);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Failed to load cart items. Please try again.");
      setLoading(false);
      
      // If user is not authenticated, redirect to login
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    if (user) {  // Only fetch cart items when user is available
      fetchCartItems();
    }
  }, [user]);  // Re-run when user changes

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:3000/cart/remove`, {
        withCredentials: true,
        data:{id:itemId, userEmail:user.email}

      });
      
      toast.success("Item removed from cart!");
      fetchCartItems(); // Refresh cart after removing item
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  const handleClearCart = async () => {
    try {
      await axios.delete("http://localhost:3000/cart", {
        withCredentials: true,
      });
      
      toast.success("Cart cleared successfully!");
      fetchCartItems(); // Refresh cart after clearing
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    }
  };

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
  
      const response = await axios.post("http://localhost:3000/payment/create-checkout-session", {
        cartItems,
        userEmail: user.email,
      }, {
        withCredentials: true,
      });
  
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong during checkout");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 mt-8">Loading cart...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 mt-8">Shopping Cart</h1>
        <div className="bg-red-100 p-4 rounded-lg text-red-700">{error}</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 mt-8">Shopping Cart</h1>
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <button 
            onClick={() => navigate("/")}
            className="bg-black text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[rgb(113,127,223)] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

// CartPage component return statement
return (
    <>
    <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-20 text-center">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items - Left side, one item per row with fixed heights */}
        <div className="w-full lg:w-2/3">
          <div className="flex flex-col space-y-6">
            {cartItems.map((item) => (
              <CartItemCard 
                key={item.id} 
                product={item} 
                onRemove={handleRemoveItem} 
              />
            ))}
          </div>
        </div>
        
        {/* Cart Summary - Right side, taller fixed position */}
        <div className="w-full lg:w-1/3 ">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md sticky top-24 lg:min-h-[calc(100vh-180px)] flex flex-col">
            <h2 className="text-2xl font-bold mb-6">Cart Summary</h2>
            
            <div className="space-y-6 mb-6 flex-grow">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-lg">Total Items:</span>
                <span className="font-semibold text-lg">{totalItems}</span>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-gray-600 text-lg">Subtotal:</span>
                <span className="font-bold text-2xl">${parseFloat(subtotal).toFixed(2)}</span>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-gray-500 mb-2">Shipping calculated at checkout</p>
                <p className="text-gray-500 mb-6">Tax calculated at checkout</p>
              </div>
            </div>
            
            <div className="mt-auto">
              <button 
                onClick={handleCheckout}
                className="w-full bg-black text-white px-6 py-4 rounded-lg text-lg font-semibold hover:bg-[rgb(113,127,223)] transition-colors mb-4"
              >
                Proceed to Checkout
              </button>
              
              <button 
                onClick={handleClearCart}
                className="w-full bg-red-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    <Footer/>
    <Navbar/>
    </>

  );
};

export default CartPage;