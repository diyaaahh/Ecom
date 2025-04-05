import React from 'react';

const StarRating = ({ rating, totalReviews }) => {
  // Convert rating to a number and handle potential NaN
  const numericRating = parseFloat(rating) || 0;
  
  // Create an array of 5 stars
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(numericRating)) {
      // Full star
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    } else if (i === Math.ceil(numericRating) && numericRating % 1 !== 0) {
      // Half star (if the rating has a decimal part)
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    } else {
      // Empty star
      stars.push(<span key={i} className="text-gray-300">★</span>);
    }
  }

  return (
    <div className="flex items-center">
      <div className="flex mr-1">{stars}</div>
      {totalReviews !== undefined && (
        <span className="text-xs text-gray-500">({totalReviews})</span>
      )}
    </div>
  );
};

export default StarRating;