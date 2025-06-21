import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  UserCircle,
  X,
} from "lucide-react";
import { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./Auth/AuthContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const userIconRef = useRef(null);
  const searchRef = useRef(null);
  const searchResultsRef = useRef(null);

 

  // Category mapping for navigation
  const categoryRoutes = {
    "T-Shirt": "men",
    "Shoes": "men", 
    "Jeans": "men",
    "Hoodie": "men",
    "Joggers": "men",
    "Shirt": "men",
    "Jacket": "men",
    "Blazer": "men",
    "Tops": "women",
    "Leggings": "women",
    "Top": "women",
    "Dress": "women",
    "Set": "women",
    "Skirt Set": "women",
    "Skirt": "women",
    "Wallets": "accessories",
    "Belts": "accessories",
    "Watches": "accessories",
    "Sunglasses": "accessories",
    "Bags": "accessories",
    "Hats": "accessories",
  };

  // Search API function
  const searchProducts = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`http://localhost:5000/api/products/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        // Fallback: search all products and filter client-side
        const allProductsResponse = await fetch('http://localhost:5000/api/products/');
        const allProducts = await allProductsResponse.json();
        
        const filteredProducts = allProducts.filter(product => 
          product.name?.toLowerCase().includes(query.toLowerCase()) ||
          product.category?.toLowerCase().includes(query.toLowerCase()) ||
          product.description?.toLowerCase().includes(query.toLowerCase())
        );
        
        setSearchResults(filteredProducts.slice(0, 8)); // Limit to 8 results
      } else {
        const results = await response.json();
        setSearchResults(results.slice(0, 8)); // Limit to 8 results
      }
      
      setShowSearchResults(true);
    } catch (error) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchProducts(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page or handle search
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
      setSearchQuery("");
    }
  };

  // Handle product click
  const handleProductClick = (product) => {
    const route = categoryRoutes[product.category] || "products";
    navigate(`/${route}/${product._id}`);
    setShowSearchResults(false);
    setSearchQuery("");
  };


  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Ensure dropdown is initially false when user logs in
  useEffect(() => {
    setDropdown(false);
  }, [user]);

  const handleMouseEnter = (event) => {
    if (
      userIconRef.current &&
      userIconRef.current.contains(event.relatedTarget)
    ) {
      return;
    }
    setDropdown(true);
  };

  const handleMouseLeave = (event) => {
    if (
      userIconRef.current &&
      userIconRef.current.contains(event.relatedTarget)
    ) {
      return;
    }
    setDropdown(false);
  };

  return (
    <div className="w-full font-sans">
      {/* Top Utility Bar */}
      <div className="flex justify-between items-center bg-black px-4 text-xs text-white">
        <div className="flex gap-4 py-1">
          <span>Download App</span>
          <span>Offers</span>
        </div>
        <div className="flex gap-4 py-1">
          <span>Contact us</span>
          <span>Track orders</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="flex items-center justify-between h-16 border-b px-4 md:px-6">
        {/* Logo + Desktop Nav */}
        <div className="flex items-center gap-2 md:gap-6">
          <div className="text-xl md:text-2xl font-bold bg-white tracking-wide text-black">
            <Link to="/">
              Trendify<sup>®</sup>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-4 text-sm font-semibold">
            <Link to="/men" className="text-indigo-500 hover:text-indigo-800">
              MEN
            </Link>
            <Link to="/women" className="text-indigo-500 hover:text-indigo-800">
              WOMEN
            </Link>
            <Link to="/kids" className="text-indigo-500 hover:text-indigo-800">
              KIDS
            </Link>
          </nav>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          {mobileMenuOpen ? (
            <X
              className="w-6 h-6 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            />
          ) : (
            <Menu
              className="w-6 h-6 cursor-pointer"
              onClick={() => setMobileMenuOpen(true)}
            />
          )}
        </div>

        {/* Search + Icons */}
        <div className="hidden md:flex items-center gap-3">
          <div className="relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search by Products"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                className="pl-8 pr-2 py-1 border rounded-md text-sm w-40 md:w-56 focus:outline-slate-700"
              />
              <Search className="absolute left-2 top-1.5 text-gray-500 w-4 h-4 cursor-pointer" onClick={handleSearchSubmit} />
            </form>
            
            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div 
                ref={searchResultsRef}
                className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto"
              >
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500">
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div>
                    <div className="p-2 text-xs text-gray-500 border-b">
                      Products ({searchResults.length})
                    </div>
                    {searchResults.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => handleProductClick(product)}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-center gap-3"
                      >
                        {product.image && (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {product.category} • ₹{product.price}
                          </div>
                        </div>
                      </div>
                    ))}
                    {searchQuery && (
                      <div
                        onClick={handleSearchSubmit}
                        className="p-3 hover:bg-gray-50 cursor-pointer text-indigo-600 text-sm font-medium"
                      >
                        View all results for "{searchQuery}"
                      </div>
                    )}
                  </div>
                ) : searchQuery ? (
                  <div className="p-4 text-center text-gray-500">
                    No products found for "{searchQuery}"
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {loading ? (
            <div>Checking authentication...</div>
          ) : !user ? (
            <div className="flex gap-1 cursor-pointer hover:text-indigo-500 transition">
              <UserCircle className="w-6 h-6" />
              <Link to="/login" className="text-md">
                Login
              </Link>
            </div>
          ) : (
            <div
              className="relative group cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              ref={userIconRef}
            >
              <div className="flex items-center text-indigo-600 hover:text-indigo-800">
                <UserCircle className="w-8 h-8" />
                <span className="text-sm">
                  {user && user.fullname ? user.fullname : "User"}
                </span>
              </div>
              {dropdown && (
                <div className="absolute right-2 w-40 bg-white shadow-lg rounded text-sm z-50 top-full md:left-auto">
                  <div className="px-4 py-2 border-b">
                    👋 Hi, {user && user.fullname ? user.fullname : "User"}
                  </div>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    My Account
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    My Wishlist
                  </Link>
                  <Link
                    to="/my-orders"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    My Orders
                  </Link>
                  
                  <button
                    onClick={() => {
                      logout();
                      localStorage.removeItem("trendify_token");
                      navigate("/");
                    }}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
          <Link to="/wishlist">
            <Heart className="w-6 h-6 cursor-pointer hover:text-indigo-500 transition" />
          </Link>
          <Link to="/cart">
            <ShoppingBag className="w-6 h-6 cursor-pointer hover:text-indigo-500 transition" />
          </Link>
        </div>
      </div>

      {/* Mobile Search + Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 border-b animate-slide-down">
          <div className="relative mb-3">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search by Products"
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-8 pr-2 py-1 border rounded-md text-sm w-full bg-gray-100"
              />
              <Search className="absolute left-2 top-1.5 text-gray-500 w-4 h-4" />
            </form>
          </div>

          <nav className="flex flex-col gap-2 text-sm font-semibold">
            {user && (
              <>
                {[
                  {
                    label: "My Account",
                    to: "/dashboard",
                    icon: <UserCircle className="w-4 h-4 mr-2 inline-block" />,
                  },
                  {
                    label: "My Wishlist",
                    to: "/wishlist",
                    icon: <Heart className="w-4 h-4 mr-2 inline-block" />,
                  },
                  {
                    label: "My Orders",
                    to: "/my-orders",
                    icon: <ShoppingBag className="w-4 h-4 mr-2 inline-block" />,
                  },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="hover:text-indigo-500 py-1 flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    logout();
                    localStorage.removeItem("trendify_token");
                    setMobileMenuOpen(false);
                    navigate("/");
                  }}
                  className="text-left text-red-500 py-1 flex items-center"
                >
                  Logout
                </button>
                <hr className="border-t border-gray-300 my-2" />
              </>
            )}

            {[
              { label: "Men", to: "/men" },
              { label: "Women", to: "/women" },
              { label: "Kids", to: "/kids" },
              { label: "Accessories", to: "/accessories" },
              { label: "New arrivals", to: "/new-arrivals" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="hover:text-indigo-500 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {!user && (
              <Link
                to="/login"
                className="text-left hover:text-indigo-500 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
      
      {/* Sub Navigation - Desktop Only */}
      <div className="hidden md:flex bg-slate-900 text-white text-center p-5 border-b">
        <nav className="flex justify-center gap-8 text-md font-semibold w-full">
          {[
            "Men",
            "Women",
            "Kids",
            "Accessories",
            "New Arrivals",
          ].map((label) => (
            <Link
              key={label}
              to={`/${label.toLowerCase().replace(" ", "-")}`}
              className="hover:text-gray-400 transition"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}