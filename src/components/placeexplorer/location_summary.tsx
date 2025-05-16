import React from "react";

// Types for the props
interface Author {
  name: string;
  profileUrl: string;
  photoUrl: string;
}

interface Review {
  author: Author;
  rating: number;
  text: string;
  time: string;
}

interface LocationSummaryProps {
  name: string;
  address: string;
  rating: number;
  reviews: Review[];
  businessStatus?: string;
  description?: string;
}

const LocationSummary: React.FC<LocationSummaryProps> = ({ name, address, rating, reviews, businessStatus, description }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-2 w-full max-h-80 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-1">{name}</h2>
      <div className="text-gray-600 mb-2">{address}</div>
      <div className="font-medium mb-4">Rating: {rating} <span className="text-yellow-500">⭐</span></div>
      <div className="mb-2 text-sm text-gray-500">
        {businessStatus && <span>Status: {businessStatus}</span>}
        {description && <div className="mt-1">{description}</div>}
      </div>
      <h3 className="text-lg font-semibold mt-6 mb-3">Reviews</h3>
      <div>
        {reviews.length === 0 && <div>No reviews yet.</div>}
        {reviews.map((review, idx) => (
          <div key={idx} className="flex items-start mb-5 bg-gray-50 rounded-md p-3">
            <img
              src={review.author.photoUrl}
              alt={review.author.name}
              className="w-12 h-12 rounded-full mr-4 object-cover"
            />
            <div>
              <div className="flex items-center mb-1">
                <a
                  href={review.author.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-gray-800 hover:underline mr-2"
                >
                  {review.author.name}
                </a>
                <span className="text-yellow-500 font-medium">
                  {"★".repeat(review.rating)}
                  <span className="text-gray-300">{"★".repeat(5 - review.rating)}</span>
                </span>
              </div>
              <div className="mb-1 text-gray-700">{review.text}</div>
              <div className="text-xs text-gray-400">{review.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationSummary;
