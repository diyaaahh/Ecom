import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CheckoutSuccess = () => {
  const [message, setMessage] = useState("Processing your order...");
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuthAndProcessOrder = async () => {
      try {
        // Get user authentication information
        const authResponse = await axios.get("http://localhost:3000/user/auth", {
          withCredentials: true,
        });

        if (authResponse.data.user) {
          const email = authResponse.data.user.email;
          setUserEmail(email);

          // Get the user's cart before clearing it
          const cartResponse = await axios.get(`http://localhost:3000/cart/getusercart?userEmail=${email}`, {
            withCredentials: true,
          });
          
          const cartItems = cartResponse.data.items;
          console.log(cartItems);
          // Update product quantities sold
          if (cartItems && cartItems.length > 0) {
            // Create an array of product updates for each item in the cart
            const productUpdates = cartItems.map(item => ({
              productId: item.product_id,
              quantitySold: item.quantity
            }));
            
            // Send request to update quantities sold
            await axios.post("http://localhost:3000/product/update-quantity-sold", {
              productUpdates
            }, {
              withCredentials: true,
            });
          }

          // Clear cart
          await axios.delete("http://localhost:3000/cart/clear", {
            params: { userEmail: email },
            withCredentials: true,
          });

          setMessage("Your order has been processed and your items are on the way!");
        }
      } catch (error) {
        console.error("Error in success flow:", error);
        setMessage("There was an error processing your order.");
      }

    };

    checkAuthAndProcessOrder();
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <div className="mb-6">
            <svg
              className="w-16 h-16 mx-auto text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">{message}</p>
          <p className="text-gray-600 mb-4">You'll be redirected to the homepage in a few seconds...</p>
          <button
            onClick={() => navigate("/")}
            className="bg-black text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[rgb(113,127,223)] transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutSuccess;