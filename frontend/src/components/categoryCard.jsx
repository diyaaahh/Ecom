import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react"; // Importing the 'X' (close) icon

export default function CategoryCard({ category, image }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch user data
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

  const handleClick = () => {
    if (user) {
      navigate(`/shop/${category}`);
    } else {
      setShowPopup(true);
    }
  };

  return (
    <div
      className="relative cursor-pointer rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Category Overlay */}
      <div className="absolute top-5 left-2 bg-black/70 text-white px-3 py-1 rounded z-10">
        {category}
      </div>

      {/* Product Image */}
      {image ? (
        <div className="relative">
          <img src={image} alt={category} className="w-full h-80 object-cover" />

          {/* Hover overlay */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              isHovered ? "opacity-70" : "opacity-0"
            }`}
            style={{ backgroundColor: "rgb(113,127,223)" }}
          ></div>

          {/* "Shop Now" text */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center text-white transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="text-xl font-semibold mb-2">Shop Now</p>
            <div className="w-16 h-0.5 bg-white"></div>
          </div>
        </div>
      ) : (
        <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
          <p>No Image Available</p>
        </div>
      )}

      {/* Popup Message for Login Requirement */}
      {showPopup && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg border border-gray-300 rounded-lg p-4 w-72 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
            onClick={() => setShowPopup(false)}
          >
            <X size={20} />
          </button>
          <p className="text-gray-800 font-semibold text-lg mb-2">
            Please log in to continue!
          </p>
          <button 
                  onClick={() => navigate("/login")} 
                  className=" mt-5 bg-black  text-white px-4 py-2 rounded-lg w-50 hover:bg-[rgb(113,127,223)] transition-colors"
                >
                  Go to Login
                </button>
        </div>
      )}
    </div>
  );
}
