import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import products from "../Dummydata/Products"; // Adjust this path as needed

const ProductDetailsPage = () => {
  const { id } = useParams();
  const product = products.find((p) => p._id === id);
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(""); // Error state for size

  if (!product) {
    return (
      <div className="text-center py-20 text-red-500">Product not found</div>
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
    if (!selectedSize) {
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
        size: selectedSize,
        quantity,
        price: product.price,
        image: product.image,
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
  };

  const sizes = product.sizes;

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
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-green-500 text-sm ml-2">
                    {product.discount}% Off
                  </span>
                </div>

                <p className="text-gray-700 mb-4">MRP incl. of all taxes</p>

                <div className="mb-4">
                  <p className="text-gray-700 font-medium mb-2">
                    Please select a size:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
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
