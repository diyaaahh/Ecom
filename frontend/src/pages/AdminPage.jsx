import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'; 
import axios from 'axios'; 
import { toast } from 'react-toastify';

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Category options
  const categoryOptions = ['Men', 'Women', 'Unisex'];

  // Fetch initial data
  useEffect(() => {
    fetchRecentProducts();
    fetchTopSellingProducts();
  }, []);

  // Fetch recent products
  const fetchRecentProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/product/getrecent?limit=10');
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching recent products:', error);
      showMessage('Failed to load recent products', 'error');
      setProducts([]);
    }
  };

  // Fetch top selling products
  const fetchTopSellingProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/product/topselling?limit=5');
      setTopSellingProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching top selling products:', error);
      showMessage('Failed to load top selling products', 'error');
      setTopSellingProducts([]);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) || '' : value,
    });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  // Display messages
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  // Submit form to add new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = new FormData();
      
      // Append form data
      for (const key in formData) {
        productData.append(key, formData[key]);
      }
      
      // Append files
      files.forEach(file => {
        productData.append('pictures', file);
      });

      const response = await axios.post('http://localhost:3000/product/add-product', productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showMessage('Product added successfully!');
      setFormData({ name: '', description: '', category: '', price: '' });
      setFiles([]);
      fetchRecentProducts();
      fetchTopSellingProducts();
      toast.success("Product added successfully!")
    } catch (error) {
      console.error('Error adding product:', error);
      showMessage('Failed to add product. Please try again.', 'error');
      toast.error("Error adding product!")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-15 text-center">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Message display */}
        {message.text && (
          <div className={`p-4 mb-6 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}
        
        {/* Tab navigation */}
        <div className="flex mb-6 border-b">
          <button 
            className={`px-4 py-2 ${activeTab === 'dashboard' ? 'border-b-2 border-[rgb(113,127,223)] text-[rgb(113,127,223)]' : ''}`}
            onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'add-product' ? 'border-b-2 border-[rgb(113,127,223)] text-[rgb(113,127,223)]' : ''}`}
            onClick={() => setActiveTab('add-product')}>
            Add Product
          </button>
        </div>
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[rgb(113,127,223)] text-white p-6 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Total Products</h2>
                <p className="text-3xl">{products.length}</p>
              </div>
              <div className="bg-[rgb(113,127,223)] text-white p-6 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Categories</h2>
                <p className="text-3xl">3</p>
              </div>
              <div className="bg-[rgb(113,127,223)] text-white p-6 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Top Selling</h2>
                <p className="text-3xl">{topSellingProducts.length > 0 ? topSellingProducts[0]?.name || 'N/A' : 'N/A'}</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded shadow mb-8">
              <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
              {topSellingProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto pl-10">
                    <thead >
                      <tr className="bg-[rgb(113,127,223)] text-white mx-auto">
                        <th className="pl-30 py-2 text-left">Product</th>
                        <th className=" pl-30 px-4 py-2 text-left">Category</th>
                        <th className=" pl-30 px-4 py-2 text-left">Price</th>
                        <th className=" pl-30 px-4 py-2 text-left">Sold</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topSellingProducts.map((product) => (
                        <tr key={product.id} className="border-b">
                          <td className=" px-4 py-3">{product.name}</td>
                          <td className="px-4 py-3">{product.category}</td>
                          <td className="px-4 py-3">${parseFloat(product.price).toFixed(2)}</td>
                          <td className="px-4 py-3">{product.qty_sold || 0}</td>
                          <td className="px-4 py-3">
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No top selling products available</p>
              )}
            </div>
          </div>
        )}
        
        {/* Add Product Tab */}
        {activeTab === 'add-product' && (
          <div className="bg-white p-6 rounded shadow">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-md font-medium text-gray-700 mb-1">
                  Product Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-md  font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows="4"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-md font-medium text-gray-700 mb-1">
                  Category*
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Category</option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-md font-medium text-gray-700 mb-1">
                  Price*
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-md font-medium text-gray-700 mb-1">
                  Product Images
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded"
                  multiple
                />
                <div className="text-sm text-gray-500 mt-1">
                  You can select multiple images
                </div>
              </div>
              
              {files.length > 0 && (
                <div className="mb-4">
                  <p className="text-md font-medium text-gray-700 mb-2">
                    Selected files:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {files.map((file, index) => (
                      <div key={index} className="bg-gray-100 px-3 py-1 rounded text-sm">
                        {file.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                className="bg-[rgb(113,127,223)] rounded-lg transition delay-150 duration-300 ease-in-out  text-white px-4 py-2   hover:scale-110 hover:-translate-y-1"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Product'}
              </button>
            </form>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default AdminPage;