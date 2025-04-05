import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, LogOut } from "lucide-react";
import axios from "axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate()

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

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/auth/logout", {}, {
        withCredentials: true,
      });
      setUser(null);
      window.location.reload();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 p-4 transition-all duration-300 backdrop-blur-lg ${
        isScrolled ?"bg-transparent ": "bg-[rgb(215, 219, 230)] bg-opacity-90 shadow-md " 
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center w-full">
        <Link to="/" className="text-2xl font-bold font-mono hover:text-[rgb(113,127,223)]">
          MyApp
        </Link>

        <div className="hidden md:flex space-x-8 mx-auto">
          <Link to="/" className="text-xl hover:text-blue-400">
            About
          </Link>
          <Link to="/" className="text-xl hover:text-blue-400">
            Services
          </Link>
          <Link to="/" className="text-xl hover:text-blue-400">
            Contact
          </Link>
        </div>

        {user ? (
          <div className="flex items-center gap-10 mr-0">
            <div className="text-xl text-[rgb(113,127,223)] mr-6">{user.name}</div>
            <Link to="/cart" className="hidden md:block mr-4 hover:text-[rgb(113,127,223)]">
              <ShoppingCart size={24} />
            </Link>
            <button 
              onClick={handleLogout} 
              className="hidden md:flex items-center text-xl hover:text-[rgb(113,127,223)]"
            >
              <LogOut size={24} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="text-xl hover:text-[rgb(113,127,223)]">
            Login
          </Link>
        )}

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden flex flex-col space-y-4 p-4 bg-blue-700 w-full">
          <Link to="/" onClick={() => setIsOpen(false)}>
            About
          </Link>
          <Link to="/" onClick={() => setIsOpen(false)}>
            Services
          </Link>
          <Link to="/" onClick={() => setIsOpen(false)}>
            Contact
          </Link>
          {user && (
            <>
              <Link to="/cart" className="flex items-center" onClick={() => setIsOpen(false)}>
                <ShoppingCart size={24} className="mr-2" /> Cart
              </Link>
              <button 
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }} 
                className="flex items-center"
              >
                <LogOut size={24} className="mr-2" /> Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;