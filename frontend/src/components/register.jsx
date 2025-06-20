import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    if (!fullName || !email || !mobileNumber || !password || !confirmPassword) {
      setError("All fields are required.");
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!/^\d+$/.test(mobileNumber)) {
      setError("Mobile number can only contain digits.");
      return false;
    } else if (!mobileRegex.test(mobileNumber)) {
      setError("Please enter a valid 10-digit mobile number.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    setError("");
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    const payload = {
      fullname: fullName,
      email,
      mobileNumber,
      password,
      confirmPassword: password, // ✅ backend needs this
    };
  
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
  
      if (!res.ok || data.error) {
        setError(data.error || data.message || "Registration failed.");
        return;
      }
  
      alert("🎉 Registration successful!");
  
      const otpRes = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber }),
      });
  
      const otpData = await otpRes.json();
  
      if (!otpRes.ok || !otpData.success) {
        setError(otpData.message || "OTP sending failed. Please try logging in.");
        return;
      }

      navigate("/login");
    } catch (err) {
      console.error("❌ Error in registration:", err);
      setError("Something went wrong. Please try again later.");
    }
  };
  
  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          className="w-full px-4 py-2 border rounded-lg outline-none"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input
          type="email"
          placeholder="Enter email"
          className="w-full px-4 py-2 border rounded-lg outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
          <span className="px-3 bg-gray-100 text-gray-700 flex items-center">+91</span>
          <input
            type="text"
            placeholder="Enter Mobile Number"
            className="flex-1 px-4 py-2 outline-none"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          placeholder="Create a password"
          className="w-full px-4 py-2 border rounded-lg outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* ✅ Confirm Password Field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
        <input
          type="password"
          placeholder="Re-enter your password"
          className="w-full px-4 py-2 border rounded-lg outline-none"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        onClick={handleRegister}
        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition mb-4"
      >
        REGISTER
      </button>
    </>
  );
}
