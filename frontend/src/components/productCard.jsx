import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StarRating from "./StarRating"; 

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [selectedImage, setSelectedImage] = useState(product.pictures?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user/auth", {
          withCredentials: true,
        });
        if (response.data.user) {
          setIsLoggedIn(true);
          setUserEmail(response.data.user.email);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    // Fetch average rating for the product
    const fetchRating = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/review/average?product_id=${product.id || product._id}`);
        setAverageRating(response.data.average_rating);
        setTotalReviews(parseInt(response.data.total_reviews));
      } catch (error) {
        console.error("Error fetching product rating:", error);
      }
    };
      
    checkAuth();
    fetchRating();
  }, [product.id, product._id]);

  const handleProductClick = () => {
    setIsModalOpen(true);
  };

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isModalOpen]);

  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity > 1 ? prevQuantity - 1 : 1);
  };

  const addToCart = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
  
    try {
      // Get the logged-in user's email
      const userResponse = await axios.get("http://localhost:3000/user/auth", {
        withCredentials: true,
      });
      
      const userEmail = userResponse.data.user.email;
      
      await axios.post("http://localhost:3000/cart/add", {
        userEmail: userEmail,
        productId: product.id || product._id,
        quantity: quantity
      }, {
        withCredentials: true
      });

      toast.success(`Added ${quantity} ${product.name} to cart!`);
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Error adding to cart");
      setIsModalOpen(false);
      console.error("Error adding to cart:", error);
    }
  };

  // Handle submitting a rating
  const submitRating = async () => {
    if (!isLoggedIn) {
      toast.error("Please log in to rate this product");
      return;
    }

    if (userRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      await axios.post("http://localhost:3000/review/add", {
        user_email: userEmail,
        product_id: product.id || product._id,
        rating: userRating,
        review_text: reviewText
      });
      setIsModalOpen(false)
      toast.success("Thank you for your rating!");
      
      // Refresh the average rating
      const response = await axios.get(`http://localhost:3000/review/average?product_id=${product.id || product._id}`);
      setAverageRating(response.data.average_rating);
      setTotalReviews(parseInt(response.data.total_reviews));
      
      // Reset the form
      setReviewText("");
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating. Please try again.");
    }
  };

  // Interactive star rating component
  const InteractiveStarRating = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setUserRating(star)}
            className={`cursor-pointer text-2xl ${
              star <= userRating ? "text-yellow-500" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      <div
        onClick={handleProductClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative cursor-pointer rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 ${
            isModalOpen ? 'filter blur-sm' : ''
        }`}
      >
        

        {/* Product Image */}
        <div className="relative">
          {product.pictures && product.pictures.length > 0 ? (
            <img 
              src={product.pictures[0]} 
              alt={product.name} 
              className="w-full h-64 object-cover" 
            />
          ) : (
            <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
              <p>No Image Available</p>
            </div>
          )}
          
          {/* Colored overlay on hover */}
          <div 
            className={`absolute inset-0 transition-opacity duration-300 ${
              isHovered ? "opacity-70" : "opacity-0"
            }`}
            style={{ backgroundColor: "rgb(113,127,223)" }}
          ></div>
          
          {/* Shop Now text with line - only shows on hover */}
          <div 
            className={`absolute inset-0 flex flex-col items-center justify-center text-white transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="text-xl font-semibold mb-2">Shop Now</p>
            <div className="w-16 h-0.5 bg-white"></div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 bg-white">
          <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
          <p className="text-gray-700 mb-2 truncate">{product.category}</p>
          
          {/* Star Rating Display */}
          <div className="mb-2">
            <StarRating rating={averageRating} totalReviews={totalReviews} />
          </div>
          
          <div className="flex justify-between items-center">
            <p className="font-bold text-lg">${parseFloat(product.price).toFixed(2)}</p>
            <p className="text-sm text-gray-500">{product.qty_sold} sold</p>
          </div>
        </div>
      </div>

      {/* MODAL: LOGIN PROMPT OR PRODUCT DETAILS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Semi-transparent backdrop with blur effect */}
          <div 
            className="fixed inset-0 bg-opacity-30 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          {/* Modal Content */}
          <div className={`relative z-[101] bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto ${isLoggedIn ? 'max-w-2xl' : 'max-w-md'}`}>
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
            >
              ✖
            </button>

            {isLoggedIn ? (
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
                
                {/* Display rating in the modal as well */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2">
                    <StarRating rating={averageRating} totalReviews={totalReviews} />
                    <span className="text-gray-600">({totalReviews} reviews)</span>
                  </div>
                </div>
                
                <img 
                  src={selectedImage} 
                  alt="Product" 
                  className="w-full h-96 object-cover mb-4 rounded-lg" 
                />

                {/* Thumbnails for other images */}
                <div className="flex gap-3 mb-6 overflow-x-auto py-2">
                  {product.pictures?.map((img, index) => (
                    <img 
                      key={index} 
                      src={img} 
                      alt="Thumbnail" 
                      className={`w-20 h-20 object-cover cursor-pointer rounded-lg border-2 ${
                        selectedImage === img ? "border-blue-500" : "border-gray-300"
                      }`}
                      onClick={() => setSelectedImage(img)}
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  <p className="text-gray-700 text-xl">{product.description}</p>
                  <p className="text-gray-700 text-xl"><strong>Price:</strong> ${parseFloat(product.price).toFixed(2)}</p>
                  <p className="text-gray-700 text-xl"><strong>Added Date:</strong> {new Date(product.added_date).toLocaleDateString()}</p>
                  
                  {/* Quantity Selector */}
                  <div className="mt-6">
                    <p className="text-lg font-semibold mb-2">Quantity:</p>
                    <div className="flex items-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          decreaseQuantity();
                        }}
                        className="bg-gray-200 px-4 py-2 rounded-l-lg text-xl font-bold hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="bg-gray-100 px-6 py-2 text-center min-w-16">
                        {quantity}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          increaseQuantity();
                        }}
                        className="bg-gray-200 px-4 py-2 rounded-r-lg text-xl font-bold hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart();
                    }}
                    className="mt-4 w-full bg-black text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[rgb(113,127,223)] transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
                {/* Rating section */}
                <div className="mb-6 mt-10 p-4 bg-gray-50 rounded-lg flex flex-col justify-center items-center">
                  <h3 className="font-semibold text-lg mb-2">Rate this product</h3>
                  <div className="mb-3">
                    <InteractiveStarRating />
                  </div>
                  
                  <button
                    onClick={submitRating}
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-[rgb(113,127,223)] transition-colors"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <h2 className="text-xl font-bold mb-4">You need to log in first</h2>
                <button 
                  onClick={() => navigate("/login")} 
                  className="mt-5 bg-black text-white px-4 py-2 rounded-lg w-50 hover:bg-[rgb(113,127,223)] transition-colors"
                >
                  Go to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}