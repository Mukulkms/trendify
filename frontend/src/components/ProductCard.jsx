// frontend/src/components/ProductCard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaStar } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Destructure product properties, matching your Mongoose schema
  const {
    _id,
    name,
    image, // This 'image' is now expected to be the full URL
    price,
    discount,
    ratings,
    category,
    brandname,
    size,
    size_shoes,
    size_kids,
  } = product;

  const productDiscount = typeof discount === 'number' ? discount : 0;
  const originalPriceCalculated = (productDiscount > 0 && typeof price === 'number')
    ? price / (1 - productDiscount / 100)
    : price;

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isProductInWishlist = wishlist.some(item => item.id === _id);
    setIsInWishlist(isProductInWishlist);
  }, [_id]);

  const handleAddToWishlist = () => {
    let existing = JSON.parse(localStorage.getItem("wishlist")) || [];
    const alreadyExists = existing.find(item => item.id === _id);
    if (alreadyExists) {
      existing = existing.filter(item => item.id !== _id);
      localStorage.setItem("wishlist", JSON.stringify(existing));
      setIsInWishlist(false);
    } else {
      const productToSave = {
        id: _id,
        name: name,
        description: product.description || brandname || '',
        price: price,
        originalPrice: originalPriceCalculated,
        discount: productDiscount,
        imageUrl: image, // Use the full URL directly
        size: Array.isArray(size) && size.length > 0 ? size[0] :
              Array.isArray(size_shoes) && size_shoes.length > 0 ? size_shoes[0] :
              Array.isArray(size_kids) && size_kids.length > 0 ? size_kids[0] : undefined,
        tags: [category, product.fit, product.fabric].filter(Boolean)
      };
      existing = [...existing, productToSave];
      localStorage.setItem("wishlist", JSON.stringify(existing));
      setIsInWishlist(true);
    }
  };

  const getDisplaySizes = () => {
    if (category === 'Shoes' && Array.isArray(size_shoes) && size_shoes.length > 0) return size_shoes;
    if (Array.isArray(size) && size.length > 0) return size;
    if (Array.isArray(size_kids) && size_kids.length > 0) return size_kids;
    return [];
  };
  const displaySizes = getDisplaySizes();

  if (!_id) {
    console.warn("ProductCard received a product without an _id:", product);
    return null;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden relative">
      <div className="relative">
        <Link to={`/product/${_id}`}>
          <div className="w-full h-84 overflow-hidden bg-gray-100">
            {/* --- MODIFIED LINE HERE --- */}
            <img
              src={image} // Directly using the 'image' variable (which is product.image)
              alt={name || 'Product Image'}
              className="w-full h-85 object-cover transition-transform duration-300 hover:scale-110"
            />
          </div>
        </Link>
        <button
          onClick={handleAddToWishlist}
          className="absolute top-2 right-2 z-10 text-gray-600 hover:text-red-500 transition-colors duration-200 p-1 bg-white rounded-full shadow-sm"
        >
          {isInWishlist ? <AiFillHeart className="w-6 h-6 text-red-500" /> : <AiOutlineHeart className="w-6 h-6" />}
        </button>
        {category && (
          <div className="absolute top-2 left-2 bg-white bg-opacity-75 rounded-md px-2 py-1 text-xs font-semibold">
            {category}
          </div>
        )}
        {productDiscount > 0 && (
          <div className="absolute bottom-2 left-2 bg-red-500 text-white rounded-md px-2 py-1 text-xs font-semibold">
            {productDiscount}% off
          </div>
        )}
        {typeof ratings === 'number' && ratings > 0 && (
          <div className="absolute bottom-2 right-2 bg-yellow-500 text-white rounded-md px-2 py-1 text-xs font-semibold flex items-center">
            <FaStar className="mr-1" size={12} /> {ratings.toFixed(1)}
          </div>
        )}
      </div>
      <div className="p-4">
        <Link to={`/product/${_id}`}>
          <h3 className="text-sm font-medium text-gray-900 truncate mb-1">{name}</h3>
          <p className="text-xs text-gray-600 mb-2">{brandname}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-black">₹{price.toFixed(0)}</span>
            {productDiscount > 0 && (
              <span className="text-xs text-gray-500 line-through">₹{originalPriceCalculated.toFixed(0)}</span>
            )}
          </div>
        </Link>
        {product.fit && (
          <div className="mt-2">
            <span className="inline-block bg-gray-300 rounded-full px-2 py-1 text-xs font-semibold text-gray-700">
              {product.fit.toUpperCase()} FIT
            </span>
          </div>
        )}
        {displaySizes.length > 0 && (
          <div className="mt-2">
            <span className="text-xs text-gray-600">Sizes:</span>
            <div className="flex items-center flex-wrap mt-1">
              {displaySizes.map((s, index) => (
                <span key={`${_id}-size-${s}-${index}`} className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2 mb-1">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
        {product.fabric === "thick_premium" && (
          <div className="mt-2">
            <span className="inline-block bg-gray-300 rounded-full px-2 py-1 text-xs font-semibold text-gray-700">
              THICK PREMIUM FABRIC
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;