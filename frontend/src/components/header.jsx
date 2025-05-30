import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  UserCircle,
  X,
  CreditCard,
} from "lucide-react";
import { useState, useContext, useRef, useEffect } from "react"; // Import useEffect
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./Auth/AuthContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const userIconRef = useRef(null);

  console.log(
    "Header rendered - dropdown state:",
    dropdown,
    "user:",
    user,
    "loading:",
    loading
  );

  // Ensure dropdown is initially false when user logs in
  useEffect(() => {
    setDropdown(false);
  }, [user]); // Re-run when the user object changes (after login)

  const handleMouseEnter = (event) => {
    if (
      userIconRef.current &&
      userIconRef.current.contains(event.relatedTarget)
    ) {
      return;
    }
    console.log("Mouse entered user area");
    setDropdown(true);
  };

  const handleMouseLeave = (event) => {
    if (
      userIconRef.current &&
      userIconRef.current.contains(event.relatedTarget)
    ) {
      return;
    }
    console.log("Mouse left user area");
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
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Products"
              className="pl-8 pr-2 py-1 border rounded-md text-sm w-40 md:w-56 focus:outline-slate-700"
            />
            <Search className="absolute left-2 top-1.5 text-gray-500 w-4 h-4" />
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
                <div className="absolute right-2 w-40 bg-white shadow-lg rounded text-sm z-50 top-full   md:left-auto">
                  {" "}
                  {/* Adjusted positioning */}
                  <div className="px-4 py-2 border-b">
                    👋 Hi, {user && user.fullname ? user.fullname : "User"}
                  </div>
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    My Account
                  </Link>
                  <Link
                    to="/my-wishlist"
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
                  <Link
                    to="/my-wallet"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    My Wallet
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
           <Link to="/my-wishlist">
          <  Heart className="w-6 h-6 cursor-pointer hover:text-indigo-500 transition" />
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
            <input
              type="text"
              placeholder="Search by Products"
              className="pl-8 pr-2 py-1 border rounded-md text-sm w-full bg-gray-100"
            />
            <Search className="absolute left-2 top-1.5 text-gray-500 w-4 h-4" />
          </div>

          <nav className="flex flex-col gap-2 text-sm font-semibold">
            {user && (
              <>
                {[
                  {
                    label: "My Account",
                    to: "/my-account",
                    icon: <UserCircle className="w-4 h-4 mr-2 inline-block" />,
                  },
                  {
                    label: "My Wishlist",
                    to: "/my-wishlist",
                    icon: <Heart className="w-4 h-4 mr-2 inline-block" />,
                  },
                  {
                    label: "My Orders",
                    to: "/my-orders",
                    icon: <ShoppingBag className="w-4 h-4 mr-2 inline-block" />,
                  },
                  {
                    label: "My Wallet",
                    to: "/my-wallet",
                    icon: <CreditCard className="w-4 h-4 mr-2 inline-block" />,
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
                <hr className="border-t border-gray-300 my-2" />{" "}
                {/* Separator */}
              </>
            )}

            {[
              { label: "Men", to: "/men" },
              { label: "Women", to: "/women" },
              { label: "Kids", to: "/kids" },
              { label: "Accessories", to: "/accessories" },
              { label: "Heavy duty", to: "/heavyduty" },
              { label: "Sneakers", to: "/sneakers" },
              { label: "New arrival", to: "/new-arrivals" },
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
            "Heavy duty",
            "Sneakers",
            "New Arrival",
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
