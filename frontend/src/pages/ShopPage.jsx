import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/productCard";

export default function ShopPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/product/category/${category}`, {
          withCredentials: true,
        });
        
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]); // Re-fetch when category changes

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">{category} Products</h1>
      
      {loading && (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray-600">Loading products...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">No products found in this category.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
    </div>
  );
}