import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize cartItems state from local storage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localCart = localStorage.getItem('trendify_cart');
      // Parse the stored JSON string, or return an empty array if nothing is found
      return localCart ? JSON.parse(localCart) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error);
      return []; // Return empty array if parsing fails
    }
  });

  // Effect to save cartItems to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('trendify_cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cartItems]); // Dependency array: runs whenever cartItems array changes

  // Function to calculate total items in cart (sum of quantities)
  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // --- Functions to manage cart items (these will automatically update local storage) ---
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      // Find if the product already exists in the cart by its productId
      const existingItem = prevItems.find(item => item.productId === product.productId);

      if (existingItem) {
        // If it exists, update its quantity
        return prevItems.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // If it's a new item, add it to the cart with necessary details
        return [...prevItems, {
          productId: product.productId,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity,
          size: product.size, // Assuming size is also passed when adding to cart
          // Add other relevant product details you want to store in the cart item
        }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.productId !== productId));
  };

  const updateCartItemQuantity = (productId, quantity) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map(item =>
        item.productId === productId
          ? { ...item, quantity: quantity }
          : item
      );
      // Filter out items with quantity <= 0 to remove them from the cart
      return updatedItems.filter(item => item.quantity > 0);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        getTotalCartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        // No 'loadingCart' needed for local storage based cart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};