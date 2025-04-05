import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };
  

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post(
            "http://localhost:3000/user/login",
            { email, password },
            { withCredentials: true }
          );
          
      if (response.data.message === "Login successful") {
        toast.success("Login successful!");
        navigate("/");
      }
    } catch (error) {
      // Handle error (wrong credentials, server error, etc.)
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Login failed");
      } else {
        toast.error("Server error. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center mt-20 shadow-md py-10 mx-20">
      <div className="w-full md:w-1/2">
        <img
          src="../../images/ecom.jpg"
          alt="E-commerce"
          className="w-full md:h-full object-cover"
        />
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
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
        <button
          className="w-full md:w-80 bg-black text-white p-2 rounded mt-3 hover:bg-[rgb(113,127,223)]"
          onClick={handleLogin}
        >
          Sign In
        </button>
        <p className="mt-4">or</p>
        <button className="w-full md:w-80 flex items-center justify-center bg-white border p-2 rounded mt-3"
  onClick={handleGoogleLogin}>
  <img src="../../images/google.jpg" alt="Google" className="w-5 h-5 mr-2" />
  Sign in with Google
</button>

        <p className="mt-4">
          New to Ecom?{" "}
          <a href="/register" className="text-[rgb(113,127,223)]">
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
