import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom"; 
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate(); 

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password,
      address,
      phone,
    };

    try {
      const response = await axios.post("http://localhost:3000/user/create", userData);

      // Success: Show toast and redirect to login page
      toast.success("Registration successful!");
      setTimeout(() => {
        navigate("/login"); // Use navigate to redirect
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      // Error: Show error toast
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Registration failed");
      } else {
        toast.error("Server Error, please try again later.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center shadow-md py-10 mt-10 mx-20">
      <div className="flex flex-col md:flex-row w-full md:w-3/4 shadow-lg rounded-lg overflow-hidden bg-white">
        <div className="w-full md:w-1/2">
          <img
            src="../../images/ecom.jpg"
            alt="E-commerce"
            className="w-full h-64 md:h-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6">
          <h2 className="text-2xl font-bold mb-6">Sign Up</h2>

          <input
            type="text"
            placeholder="Name"
            className="w-full md:w-80 p-2 mb-3 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full md:w-80 p-2 mb-3 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full md:w-80 p-2 mb-3 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="Address"
            className="w-full md:w-80 p-2 mb-3 border rounded"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full md:w-80 p-2 mb-3 border rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="w-full md:w-80 bg-black text-white p-2 rounded mt-3 hover:bg-[rgb(113,127,223)]"
          >
            Sign Up
          </button>
          <p className="mt-4">or</p>
          <p className="mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-[rgb(113,127,223)]">
              Login
            </a>
          </p>
        </div>
      </div>
      {/* ToastContainer to display toast messages */}
      <ToastContainer />
    </div>
  );
};

export default RegisterPage;
