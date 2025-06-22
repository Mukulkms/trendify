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
  FaChevronRight,
  FaCrown,
  FaUserShield,
} from "react-icons/fa";
import { useAuth2 } from "../AuthContext2";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth2();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`fixed inset-y-0 left-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 transform transition-all duration-300 ease-in-out z-40
                   ${isOpen ? "translate-x-0" : "-translate-x-full"}
                   lg:relative lg:translate-x-0 lg:min-w-72 lg:max-w-72 lg:h-auto overflow-hidden shadow-2xl`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header Section */}
          <div className="p-6 border-b border-slate-700/50">
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden absolute top-4 right-4 text-slate-400 hover:text-white focus:outline-none transition-colors duration-200 p-2 rounded-lg hover:bg-slate-700/50"
              aria-label="Close menu"
            >
              <FaTimes className="w-5 h-5" />
            </button>

            {/* Logo/Brand */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaCrown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Admin Panel</h1>
                <p className="text-slate-400 text-sm">Management Hub</p>
              </div>
            </div>

            {/* User Info */}
            {user && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                    <FaUserShield className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">
                      {user.fullname || user.email}
                    </p>
                    <div className="flex items-center space-x-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'super-admin' 
                          ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {user.role === 'super-admin' ? (
                          <>
                            <FaCrown className="w-3 h-3 mr-1" />
                            Super Admin
                          </>
                        ) : (
                          'Admin'
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
            {/* Main Menu */}
            <div className="mb-8">
              <h3 className="text-slate-400 mb-4 uppercase text-xs font-semibold tracking-wider px-3">
                Main Menu
              </h3>
              <ul className="space-y-1">
                <NavItem 
                  to="/superadmin/dashboard" 
                  icon={<FaHome />} 
                  label="Dashboard" 
                  onClick={onClose} 
                />
                <NavItem 
                  to="/superadmin/orders" 
                  icon={<FaShoppingCart />} 
                  label="Orders" 
                  onClick={onClose} 
                />
                <NavItem 
                  to="/superadmin/products" 
                  icon={<FaBox />} 
                  label="Products" 
                  onClick={onClose} 
                />
                
                {/* Super Admin Only */}
                {user?.role === "super-admin" && (
                  <NavItem 
                    to="/superadmin/users" 
                    icon={<FaUsers />} 
                    label="User Management" 
                    onClick={onClose}
                    badge="Super"
                    superAdmin={true}
                  />
                )}
                
                <NavItem 
                  to="/superadmin/categories" 
                  icon={<FaTag />} 
                  label="Categories" 
                  onClick={onClose} 
                />
                <NavItem 
                  to="/superadmin/subscriptions" 
                  icon={<FaDollarSign />} 
                  label="Subscriptions" 
                  onClick={onClose} 
                />
                <NavItem 
                  to="/superadmin/discounts" 
                  icon={<FaChartBar />} 
                  label="Discounts" 
                  onClick={onClose} 
                />
              </ul>
            </div>

            {/* Support Menu */}
            <div>
              <h3 className="text-slate-400 mb-4 uppercase text-xs font-semibold tracking-wider px-3">
                Support
              </h3>
              <ul className="space-y-1">
                <NavItem 
                  to="/superadmin/settings" 
                  icon={<FaCog />} 
                  label="Settings" 
                  onClick={onClose} 
                />
                <NavItem 
                  to="/superadmin/help" 
                  icon={<FaQuestionCircle />} 
                  label="Get Help" 
                  onClick={onClose} 
                />
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="text-center">
              <p className="text-slate-400 text-xs">
                © 2024 Admin Panel
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Version 2.1.0
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const NavItem = ({ to, icon, label, badge, onClick, superAdmin = false }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center justify-between p-3 mx-2 rounded-xl cursor-pointer transition-all duration-200 relative overflow-hidden
         ${
           isActive
             ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]"
             : "text-slate-300 hover:text-white hover:bg-slate-700/50 hover:transform hover:scale-[1.01]"
         }`
      }
      onClick={onClick}
    >
      {/* Active indicator */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-500 transform transition-transform duration-200 ${
        ({ isActive }) => isActive ? 'scale-y-100' : 'scale-y-0'
      }`}></div>
      
      <div className="flex items-center flex-1">
        <span className={`w-5 h-5 mr-4 transition-transform duration-200 group-hover:scale-110 ${
          superAdmin ? 'text-purple-400' : ''
        }`}>
          {icon}
        </span>
        <span className="font-medium">{label}</span>
      </div>

      <div className="flex items-center space-x-2">
        {badge && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
            superAdmin 
              ? 'bg-purple-100 text-purple-800 border border-purple-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {badge}
          </span>
        )}
        
        <FaChevronRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" />
      </div>
    </NavLink>
  </li>
);

export default Sidebar;