import { useState, useEffect } from "react";

const ProductCarousel = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState('next');

  useEffect(() => {
    // Set loaded state after component mounts
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  const handlePrevious = () => {
    if (isTransitioning) return;
    
    setDirection('prev');
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? products.length - 1 : prevIndex - 1
      );
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    
    setDirection('next');
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === products.length - 1 ? 0 : prevIndex + 1
      );
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  // Determine animation classes based on direction and transition state
  const getAnimationClasses = () => {
    if (!isLoaded) return "opacity-0 translate-y-4";
    
    if (isTransitioning) {
      return direction === 'next' 
        ? "opacity-0 -translate-x-8" 
        : "opacity-0 translate-x-8";
    }
    
    return "opacity-100 translate-x-0";
  };

  const currentProduct = products[currentIndex];

  return (
    <div className="flex-grow mt-15 relative overflow-hidden">
      {products.length > 0 && currentProduct?.pictures?.length > 0 ? (
        <>
          <div className={`w-full h-[calc(100vh-64px)] transition-all duration-500 ease-in-out ${
            isTransitioning ? (direction === 'next' ? 'scale-105 opacity-90' : 'scale-95 opacity-90') : 'scale-100 opacity-100'
          }`}>
            <img
              src={currentProduct.pictures[0]}
              alt={currentProduct.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div 
            className={`absolute left-50 top-1/3 max-w-md transition-all duration-500 ease-in-out transform ${getAnimationClasses()}`}
          >
            <h1 className="text-4xl font-bold text-black  px-4 py-2 rounded backdrop-blur-sm">
              {currentProduct.name}
            </h1>
            <button 
    
    className="mt-10 ml-5 bg-black text-white px-6 py-2 rounded-lg text-lg font-large hover:bg-[rgb(113,127,223)] transition-all"
  >
    Shop Now
  </button>
          </div>
          
          {/* Left Arrow */}
          <button 
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-3 shadow-lg transition-all disabled:opacity-50"
            aria-label="Previous product"
            disabled={isTransitioning}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Right Arrow */}
          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-3 shadow-lg transition-all disabled:opacity-50"
            aria-label="Next product"
            disabled={isTransitioning}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Page indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {products.map((_, idx) => (
              <span 
                key={idx} 
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center bg-gray-200">
          <p>No product images available</p>
        </div>
      )}
    </div>
  );
};

export default ProductCarousel;