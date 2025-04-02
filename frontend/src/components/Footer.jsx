import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-gray-800 text-white text-center p-4 mt-8 h-50 w-full">
      <div className="w-full">
        <p>&copy; 2025 MyApp. All rights reserved.</p>
        <div className="flex justify-center space-x-6 mt-10">
          <Link to="/about" className="hover:text-gray-400">About</Link>
          <Link to="/services" className="hover:text-gray-400">Services</Link>
          <Link to="/contact" className="hover:text-gray-400">Contact</Link>
        </div>
      </div>
    </div>
  );
};

 export default Footer;