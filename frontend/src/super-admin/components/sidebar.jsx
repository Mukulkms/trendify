import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaShoppingCart,
  FaBox,
  FaUsers,
  FaTag,
  FaDollarSign,
  FaChartBar,
  FaCog,
  FaQuestionCircle,
  FaTimes,
} from "react-icons/fa";
import { useAuth2 } from "../AuthContext2"; // ✅ Import AuthContext2

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth2(); // ✅ Access user from AuthContext2

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`fixed inset-y-0 left-0 bg-white p-6 shadow-xl transform transition-transform duration-300 ease-in-out z-40
                   ${isOpen ? "translate-x-0" : "-translate-x-full"}
                   lg:relative lg:translate-x-0 lg:shadow-md lg:min-w-64 lg:max-w-64 lg:h-auto overflow-y-auto`}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none"
          aria-label="Close menu"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        <h3 className="text-gray-500 mb-4 uppercase text-xs font-semibold tracking-wider pt-8 lg:pt-0">Menu</h3>
        <ul className="space-y-2">
          <NavItem to="/superadmin/dashboard" icon={<FaHome />} label="Dashboard" onClick={onClose} />
          <NavItem to="/superadmin/orders" icon={<FaShoppingCart />} label="Orders" badge="3" onClick={onClose} />
          <NavItem to="/superadmin/products" icon={<FaBox />} label="Products" onClick={onClose} />

          {/* ✅ Only show User Management to super-admin */}
          {user?.role === "super-admin" && (
            <NavItem to="/superadmin/users" icon={<FaUsers />} label="User Management" onClick={onClose} />
          )}

          <NavItem to="/superadmin/categories" icon={<FaTag />} label="Category" onClick={onClose} />
          <NavItem to="/superadmin/subscriptions" icon={<FaDollarSign />} label="Subscription" onClick={onClose} />
          <NavItem to="/superadmin/discounts" icon={<FaChartBar />} label="Discount" onClick={onClose} />
        </ul>

        <h3 className="text-gray-500 mt-6 mb-4 uppercase text-xs font-semibold tracking-wider">Support</h3>
        <ul className="space-y-2">
          <NavItem to="/superadmin/settings" icon={<FaCog />} label="Settings" onClick={onClose} />
          <NavItem to="/superadmin/help" icon={<FaQuestionCircle />} label="Get Help" onClick={onClose} />
        </ul>
      </aside>
    </>
  );
};

const NavItem = ({ to, icon, label, badge, onClick }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200
         ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-100"}`
      }
      onClick={onClick}
    >
      <span className="w-5 h-5 mr-3">{icon}</span>
      {label}
      {badge && (
        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </NavLink>
  </li>
);

export default Sidebar;
