import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CartItemCard = ({ product, onRemove }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(product.pictures?.[0]);

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

  const handleCheckout = () => {
    // Implement checkout functionality or navigate to checkout page
    navigate("/checkout");
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
        <div className="flex flex-col md:flex-row h-40">
          {/* Product Image - Left side with fixed height */}
          <div className="relative w-full md:w-1/4 h-40">
            {product.pictures && product.pictures.length > 0 ? (
              <img 
                src={product.pictures[0]} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
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
            
            {/* View Details text with line - only shows on hover */}
            <div 
              className={`absolute inset-0 flex flex-col items-center justify-center text-white transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <p className="text-lg font-semibold mb-1">View Details</p>
              <div className="w-12 h-0.5 bg-white"></div>
            </div>
          </div>

          {/* Product Info - Right side */}
          <div className="p-4 bg-white flex-1 flex flex-col justify-between h-40">
            <div className="overflow-hidden">
              <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
            </div>
            
            <div className="mt-auto pt-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700">Qty: {product.quantity}</p>
                  <p className="font-bold text-lg">${parseFloat(product.price).toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600 text-sm">Subtotal:</p>
                  <p className="font-semibold">${parseFloat(product.subtotal).toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex justify-end mt-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(product.id);
                  }}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* MODAL: PRODUCT DETAILS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Semi-transparent backdrop with blur effect */}
          <div 
            className="fixed inset-0 bg-opacity-30 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative z-[101] bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto max-w-2xl">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
            >
              ✖
            </button>

            <div className="p-8">
              <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
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
                <p className="text-gray-700 text-xl"><strong>Quantity:</strong> {product.quantity}</p>
                <p className="text-gray-700 text-xl"><strong>Subtotal:</strong> ${parseFloat(product.subtotal).toFixed(2)}</p>
                
                <div className="flex space-x-4 mt-6">
                  {/* Checkout Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheckout();
                    }}
                    className="flex-1 bg-black text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[rgb(113,127,223)] transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                  
                  {/* Remove from Cart Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(product.id);
                      setIsModalOpen(false);
                    }}
                    className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    Remove from Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartItemCard;