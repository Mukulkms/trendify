import { FaUserEdit } from 'react-icons/fa';

const UserCard = ({ user }) => {
  return (
    <div className="bg-white border rounded-md shadow-sm p-6 w-full">
      <div className="flex  items-center">
        <div className="rounded-full bg-gray-300 text-gray-700 font-bold text-2xl w-12 h-12 flex items-center justify-center mr-4">
          {user && user.fullname ? user.fullname.charAt(0).toUpperCase() : "U"} {/* Display first initial */}
        </div>
        <div>  
          <h1 className="font-semibold text-2xl text-gray-800">{user && user.fullname ? user.fullname : "Guest User"}</h1>
          <p className="text-gray-600 text-sm">{user && user.email ? user.email : "No email available"}</p>
          {user && user.mobileNumber && <p className="text-gray-600 text-sm">{user.mobileNumber}</p>} {/* Conditionally display phone */}
        </div>
      </div>
        <button className="w-full mt-20 bg-yellow-300 text-xl py-3 px-6 rounded-md flex items-center justify-center">
          <FaUserEdit className="mr-2" /> Edit Profile
        </button>
    </div>
  );
};

export default UserCard;