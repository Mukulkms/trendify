import { FaTachometerAlt, FaShoppingBag, FaWallet, FaMapMarkerAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <aside className="bg-slate-900 text-gray-400 w-64 py-6 flex flex-col shadow-md">
      <div className="px-6 mb-8">
        <h1 className="text-white font-bold text-xl">Trendify</h1>
      </div>
      <nav className="flex-grow">
        <div className="mb-4 px-2">
          <div className="flex items-center py-3 px-4 rounded cursor-pointer hover:bg-gray-800 hover:text-white active:bg-gray-700 active:text-white">
            <FaTachometerAlt className="mr-4" />
            <span>Overview</span>
          </div>
        </div>
        <div className="mb-4 px-2">
          <div className="flex items-center py-3 px-4 rounded cursor-pointer hover:bg-gray-800 hover:text-white">
            <FaShoppingBag className="mr-4" />
            <span>My Orders</span>
          </div>
        </div>
        <div className="mb-4 px-2">
          <div className="flex items-center py-3 px-4 rounded cursor-pointer hover:bg-gray-800 hover:text-white">
            <FaWallet className="mr-4" />
            <span>My Payments</span>
          </div>
        </div>
        <div className="mb-4 px-2">
          <div className="flex items-center py-3 px-4 rounded cursor-pointer hover:bg-gray-800 hover:text-white">
            <FaWallet className="mr-4" />
            <span>My Wallet</span>
          </div>
        </div>
        <div className="mb-4 px-2">
          <div className="flex items-center py-3 px-4 rounded cursor-pointer hover:bg-gray-800 hover:text-white">
            <FaMapMarkerAlt className="mr-4" />
            <span>My Addresses</span>
          </div>
        </div>
        <div className="mb-4 px-2">
          <div className="flex items-center py-3 px-4 rounded cursor-pointer hover:bg-gray-800 hover:text-white">
            <FaUser className="mr-4" />
            <span>My Profile</span>
          </div>
           <div className="flex items-center py-3 px-4 rounded cursor-pointer hover:bg-gray-800 hover:text-white border-t border-gray-700">
          <FaSignOutAlt className="mr-4" />
          <span>Logout</span>
        </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;