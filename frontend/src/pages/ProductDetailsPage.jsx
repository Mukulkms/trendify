import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State management
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState("");

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/${id}`);

        if (!response.ok) {
          // Attempt to parse error message from backend if available
          const errorData = await response.json();
          throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || 'Unknown error'}`);
        }

        const productData = await response.json();
        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // --- Determine which size array to use ---
  let availableSizes = [];
  if (product) {
    if (product.category === "Shoes" && product.size_shoes && product.size_shoes.length > 0) {
      availableSizes = product.size_shoes;
    } else if (product.gender === "kids" && product.size_kids && product.size_kids.length > 0) {
      availableSizes = product.size_kids;
    } else if (product.size && product.size.length > 0) { // General sizes for apparel
      availableSizes = product.size;
    }
  }
  // --- End of size array determination ---


  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto py-8 px-4">
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <div className="animate-pulse">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <div className="bg-gray-300 rounded-lg w-full h-96"></div>
                </div>
                <div className="md:w-4/5 flex flex-col justify-between">
                  <div>
                    <div className="h-8 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                    <div className="h-6 bg-gray-300 rounded mb-4 w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto py-8 px-4">
          <div className="text-center py-20">
            <div className="text-red-500 text-xl mb-4">Error loading product</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto py-8 px-4">
          <div className="text-center py-20">
            <div className="text-red-500 text-xl mb-4">Product not found</div>
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSizeError(""); // Clear error on selection
  };

  const handleQuantityChange = (value) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (availableSizes.length > 0 && !selectedSize) { // Only require size if product has sizes
      setSizeError("Please select a size before adding to cart.");
      return;
    }

    // Get the current cart from localStorage or initialize it as an empty array
    const currentCart = JSON.parse(localStorage.getItem("cartItems")) || [];

    // Check if the product is already in the cart
    const existingItemIndex = currentCart.findIndex(
      (item) => item.productId === product._id && item.size === selectedSize
    );

    if (existingItemIndex > -1) {
      // If item exists, update the quantity
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      // If item doesn't exist, add it to the cart
      const cartItem = {
        productId: product._id,
        name: product.name,
        size: selectedSize, // Use the selected size
        quantity,
        price: product.price,
        image: product.image,
        // Ensure these fields exist on your product object from the API
        description: product.description,
        details: product.details,
      };
      currentCart.push(cartItem);
    }

    // Save the updated cart back to localStorage
    localStorage.setItem("cartItems", JSON.stringify(currentCart));

    // Redirect to cart page
    navigate("/cart");
  };

  const handleAddToWishlist = () => {
    console.log("Added to Wishlist");
    // Implement actual wishlist logic here, e.g., using localStorage or an API
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <img
                src={product.image}
                alt={product.name}
                className="rounded-lg w-full h-auto max-h-[600px] object-contain"
                onError={(e) => {
                  e.target.src = "/api/placeholder/400/600"; // Fallback image path (make sure this exists)
                }}
              />
            </div>

            <div className="md:w-4/5 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-gray-800 mb-2">
                  {product.name}
                </h1>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <div className="flex items-center mb-4">
                  <span className="text-xl font-semibold text-gray-800 mr-2">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                  {product.discount && (
                    <span className="text-green-500 text-sm ml-2">
                      {product.discount}% Off
                    </span>
                  )}
                </div>

                <p className="text-gray-700 mb-4">MRP incl. of all taxes</p>

                {availableSizes.length > 0 && ( // Render size selection only if sizes are available
                  <div className="mb-4">
                    <p className="text-gray-700 font-medium mb-2">
                      Please select a size:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          className={`${
                            selectedSize === size
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 hover:bg-gray-300"
                          } px-4 py-2 rounded-md text-gray-700 font-semibold transition-colors duration-200`}
                          onClick={() => handleSizeSelect(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {sizeError && (
                      <p className="text-red-500 text-sm mt-2">{sizeError}</p>
                    )}
                  </div>
                )}
                {/* Optional: Message if no sizes are available */}
                {availableSizes.length === 0 && (
                    <p className="text-gray-500 text-sm mb-4">No specific sizes available for this item (one size fits all or irrelevant).</p>
                )}


                <div className="mb-6">
                  <p className="text-gray-700 font-medium mb-2">Quantity</p>
                  <div className="flex items-center gap-2">
                    <button
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-md py-2 px-3"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="text-gray-800 font-semibold text-lg min-w-[2rem] text-center">
                      {quantity}
                    </span>
                    <button
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-md py-2 px-3"
                      onClick={() => handleQuantityChange(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-md w-1/2"
                  onClick={handleAddToCart}
                >
                  ADD TO CART
                </button>
                <button
                  className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-3 px-6 rounded-md w-1/2 flex items-center justify-center"
                  onClick={handleAddToWishlist}
                >
                  <FontAwesomeIcon icon={faHeart} className="mr-2" size="lg" />
                  ADD TO WISHLIST
                </button>
              </div>

              <div className="bg-white shadow-md rounded-lg p-6 my-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Delivery Details
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <input
                    type="text"
                    placeholder="Enter Pincode"
                    className="shadow appearance-none border rounded-md w-full sm:w-64 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md">
                    CHECK
                  </button>
                </div>
                <p className="text-gray-600 text-sm mt-4">
                  This product is eligible for return or exchange under our
                  30-day return or exchange policy. No questions asked.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;