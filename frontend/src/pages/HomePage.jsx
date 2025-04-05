import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProductCarousel from "../components/ProductCarousel";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

export default function HomePage() {
  const [recentProducts, setRecentProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch the 5 most recent products for the carousel
        const recentResponse = await axios.get("http://localhost:3000/product/getrecent?limit=5");
        setRecentProducts(recentResponse.data);
        
        // Fetch products for categories (all products or with a different endpoint)
        const categoryResponse = await axios.get("http://localhost:3000/product/bycategory");
        const allProducts = categoryResponse.data;
        
        // Group products by category
        const categoryMap = {};
        allProducts.forEach((product) => {
          if (!categoryMap[product.category]) {
            categoryMap[product.category] = [product];
          }
        });
        
        setCategoryProducts(categoryMap);
        
        // Fetch top selling products
        const topSellingResponse = await axios.get("http://localhost:3000/product/topselling?limit=12");
        setTopSellingProducts(topSellingResponse.data);
        setFilteredProducts(topSellingResponse.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);

  // Handle search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredProducts(topSellingProducts);
    } else {
      const filtered = topSellingProducts.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>
      
      {/* Product Carousel - only 5 most recent products */}
      {loading ? (
        <div className="flex-grow flex items-center justify-center">
          <p>Loading products...</p>
        </div>
      ) : (
        <ProductCarousel products={recentProducts} />
      )}

      {/* Category-wise Products - one from each category */}
      <div className="p-6 text-center mt-5">
        <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(categoryProducts).map(([category, productsArray]) => (
            <CategoryCard 
              key={category} 
              category={category} 
              image={productsArray[0]?.pictures?.[0]}
            />
          ))}
        </div>
      </div>
      
      {/* Best Sellers + Search Bar */}
      <div id="best-sellers-section" className="p-6 bg-gray-50 text-center justify-center items-center gap-10 mt-10">
        <h2 className="text-3xl font-bold hover:text-[rgb(113,127,223)] mb-5">Best Sellers</h2>
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Top Selling Products */}
      <div className="p-6 bg-gray-50">
        {loading ? (
          <p>Loading top selling products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}