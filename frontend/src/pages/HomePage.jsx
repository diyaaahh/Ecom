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
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [productsPerLoad] = useState(8); // Number of products to show initially and load each time
  const [currentIndex, setCurrentIndex] = useState(0);

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
        
        // Initially display first 8 products
        setDisplayedProducts(topSellingResponse.data.slice(0, productsPerLoad));
        setCurrentIndex(productsPerLoad);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, [productsPerLoad]);

  // Handle search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredProducts(topSellingProducts);
      // Reset to first 8 products when clearing search
      setDisplayedProducts(topSellingProducts.slice(0, productsPerLoad));
      setCurrentIndex(productsPerLoad);
    } else {
      const filtered = topSellingProducts.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
      // Show first 8 filtered results
      setDisplayedProducts(filtered.slice(0, productsPerLoad));
      setCurrentIndex(productsPerLoad);
    }
  };

  // Load more products
  const handleLoadMore = () => {
    setLoadingMore(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      const nextProducts = filteredProducts.slice(currentIndex, currentIndex + productsPerLoad);
      setDisplayedProducts(prev => [...prev, ...nextProducts]);
      setCurrentIndex(prev => prev + productsPerLoad);
      setLoadingMore(false);
    }, 500);
  };

  // Check if there are more products to load
  const hasMoreProducts = currentIndex < filteredProducts.length;

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

      {/* Top Selling Products with Lazy Loading */}
      <div className="p-6 bg-gray-50">
        {loading ? (
          <p>Loading top selling products...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {/* Load More Section */}
            {hasMoreProducts && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[rgb(113,127,223)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? "Loading..." : "Load More Products"}
                </button>
              </div>
            )}
            
            {/* No more products message */}
            {!hasMoreProducts && displayedProducts.length > 0 && (
              <div className="text-center mt-8">
                <p className="text-gray-600 text-lg">You've seen all products!</p>
              </div>
            )}
            
            {/* No products found message */}
            {displayedProducts.length === 0 && !loading && (
              <div className="text-center mt-8">
                <p className="text-gray-600 text-lg">
                  {searchQuery ? `No products found for "${searchQuery}"` : "No products available"}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}