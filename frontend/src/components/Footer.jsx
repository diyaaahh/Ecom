import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-gray-800 text-white text-center p-4 mt-8 h-50 w-full">
      <div className="w-full">
        <p>&copy; 2025 MyApp. All rights reserved.</p>
        <div className="flex justify-center space-x-6 mt-10">
          <Link to="/" className="hover:text-[rgb(113,127,223)]">About</Link>
          <Link to="/" className="hover:text-[rgb(113,127,223)]">Services</Link>
          <Link to="/" className="hover:text-[rgb(113,127,223)]">Contact</Link>
        </div>
      </div>
    </div>
  );
};

 export default Footer;