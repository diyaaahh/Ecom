import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";
import axios from "axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Change background when scrolled 50px down
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 p-4 transition-all duration-300 backdrop-blur-lg ${
        isScrolled ?"bg-transparent ": "bg-[rgb(215, 219, 230)] bg-opacity-90 shadow-md " 
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center w-full">
        <Link to="/" className="text-2xl font-bold font-mono ">
          MyApp
        </Link>

        <div className="hidden md:flex space-x-8 mx-auto">
          <Link to="/about" className="text-xl hover:text-blue-400">
            About
          </Link>
          <Link to="/services" className="text-xl hover:text-blue-400">
            Services
          </Link>
          <Link to="/contact" className="text-xl hover:text-blue-400">
            Contact
          </Link>
        </div>

        {user ? (
          <div className="text-xl text-blue-400 mr-10">{user.name}</div>
        ) : (
          <Link to="/login" className="text-xl hover:text-blue-400">
            Login
          </Link>
        )}

       { user? (<Link to="/cart" className="hidden md:block ml-10">
          <ShoppingCart size={24}  />
        </Link>):(
          <> </>
        )
        
      }

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden flex flex-col space-y-4 p-4 bg-blue-700 w-full">
          <Link to="/about" onClick={() => setIsOpen(false)}>
            About
          </Link>
          <Link to="/services" onClick={() => setIsOpen(false)}>
            Services
          </Link>
          <Link to="/contact" onClick={() => setIsOpen(false)}>
            Contact
          </Link>
          <Link to="/cart" className="flex items-center" onClick={() => setIsOpen(false)}>
            <ShoppingCart size={24} className="mr-2" /> Cart
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
