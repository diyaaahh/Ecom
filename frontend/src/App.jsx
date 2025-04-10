import { useState } from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SuccessPage from './pages/SuccessPage';
import AdminPage from './pages/AdminPage';
function App() {

  return (<>
  <ToastContainer />
   <Router>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/shop/:category' element={<ShopPage/>}/>
      <Route path='/cart' element={<CartPage/>}/>
      <Route path='/success' element={<SuccessPage/>}/>
      <Route path='/admin' element={<AdminPage/>}/>
    </Routes>
   </Router>

  </>
  )
}

export default App
