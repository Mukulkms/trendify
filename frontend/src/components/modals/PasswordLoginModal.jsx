import React, { useContext, useState } from "react"; // Import useState
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth/AuthContext";

export default function PasswordLoginModal({
  isOpen,
  onClose,
  password,
  setPassword,
  mobileNumber,
}) {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [error, setError] = useState(""); // State to hold error messages

  if (!isOpen) return null;

  const handlePasswordLogin = async () => {
    setError(""); // Clear previous errors on new attempt

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNumber,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // If response is not OK (e.g., 400, 401, 404, 500)
        const errorMessage = data.message || "Something went wrong during login.";
        setError(errorMessage); // Set the error message to display
        console.warn("Login failed:", errorMessage);
        return;
      }

      // If res.ok is true but token or user data is missing (less likely with your backend)
      if (!data.token || !data.user) {
        const errorMessage = "Login failed: Incomplete response from server.";
        setError(errorMessage);
        console.warn(errorMessage, data);
        return;
      }

      // Successful login
      localStorage.setItem("trendify_token", data.token);
      login(data.user, data.token);
      onClose(); // Close the modal
      // Optionally reset password field after successful login and modal close
      setPassword(''); 
      setTimeout(() => {
        navigate("/"); // Navigate to home after a slight delay
      }, 100);
    } catch (err) {
      // Catch network errors or errors in parsing JSON
      console.error("Login error", err);
      setError("Network error or server unreachable. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-80 relative">
        <button
          onClick={() => {
            onClose();
            setError(""); // Clear error when closing the modal
            setPassword(""); // Also clear password when closing
          }}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h3 className="text-lg font-semibold mb-4">Login via Password</h3>

        <input
          type="password"
          placeholder="Enter Password"
          className="w-full mb-4 border px-4 py-2 rounded-lg outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && ( // Display error message if 'error' state is not empty
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <div className="text-left mb-4">
          <Link
            to="/cool" // Consider changing this to a more meaningful route if "Forgot Password" is implemented
            className="text-sm text-blue-600 hover:underline focus:outline-none"
            onClick={onClose} // Close the modal when navigating away
          >
            Forgot Password?
          </Link>
        </div>

        <button
          onClick={handlePasswordLogin}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
        >
          Login
        </button>
      </div>
    </div>
  );
}