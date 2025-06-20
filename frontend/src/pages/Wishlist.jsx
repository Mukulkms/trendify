import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShoppingCart,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const WishlistPage = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("wishlist");
      try {
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        console.error("Error parsing wishlist:", e);
        // Return empty array if parsing fails to prevent app crash
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    }
  }, [wishlistItems]);

  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const moveToCart = (item) => {
    // Prepare the item data in the format expected by CartPage's location.state
    const itemForCart = {
      productId: item.id, // Assuming item.id is the product's _id
      name: item.name,
      image: item.imageUrl, // Assuming item.imageUrl is the image field CartPage expects
      price: item.price,
      originalPrice: item.originalPrice,
      discount: item.discount,
      size: item.size || null, // Pass size if available, default to null
      quantity: 1, // When moving from wishlist, typically add 1 quantity
    };

    // Use navigate to pass the item to CartPage via state
    navigate("/cart", { state: itemForCart });

    // Then, remove the item from the wishlist
    removeFromWishlist(item.id);
  };

  const handleShopNowClick = () => navigate("/");

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start pt-20">
        <div className="text-center">
          <div className="flex items-center justify-center w-48 h-48 mx-auto mb-4 bg-gray-200 rounded-full">
            <FontAwesomeIcon
              icon={faHeart}
              size="4x"
              className="text-red-500"
            />
          </div>
          <p className="text-gray-600 text-lg mb-4">Your wishlist is empty.</p>
          <p className="text-gray-500 text-sm mb-6">
            Save items in your wishlist to review and easily move them to your bag.
          </p>
          <button
            onClick={handleShopNowClick}
            className="bg-slate-800 hover:bg-black text-white font-semibold px-6 py-3 rounded-md transition-colors"
          >
            SHOP NOW
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          My Wishlist ({wishlistItems.length} item
          {wishlistItems.length !== 1 && "s"})
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-md relative flex flex-col rounded-lg overflow-hidden"
            >
              <div className="relative w-full h-[250px] flex justify-center items-center">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="object-cover w-full h-full"
                />
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors bg-white rounded-full p-1.5"
                  aria-label={`Remove ${item.name} from wishlist`} // More descriptive aria-label
                >
                  <FontAwesomeIcon icon={faTrash} size="lg" />
                </button>
              </div>

              <div className="w-full p-4 flex flex-col flex-grow">
                {/* Use optional chaining for tags check */}
                {item.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <h2 className="text-base font-semibold text-gray-800 mb-1 line-clamp-1">
                  {item.name}
                </h2>

                {/* Conditionally render description */}
                {item.description && (
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center mb-2">
                  <span className="text-xl font-semibold text-gray-800 mr-2">
                    ₹{item.price}
                  </span>
                  {/* Conditionally render originalPrice and discount */}
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-sm text-gray-500 line-through mr-2">
                      ₹{item.originalPrice}
                    </span>
                  )}
                  {item.discount && item.discount > 0 && (
                    <span className="text-green-500 text-sm">
                      {item.discount}% Off
                    </span>
                  )}
                </div>

                {item.size && (
                  <p className="text-gray-500 text-sm mb-4">
                    Size: {item.size}
                  </p>
                )}

                <button
                  className="mt-auto w-full bg-slate-700 hover:bg-slate-950 text-white font-semibold py-2 px-3 rounded-md text-sm flex justify-center items-center gap-1 transition-colors"
                  onClick={() => moveToCart(item)}
                  aria-label={`Add ${item.name} to cart`} // More descriptive aria-label
                >
                  <FontAwesomeIcon icon={faShoppingCart} />
                  ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;