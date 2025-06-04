import React, { useState } from 'react';
import SuperAdminHeader from '../../components/SuperAdminHeader';

export default function Register() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    mobileNumber: '',
    role: 'vendor',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('http://localhost:5000/api/superadmin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Registration failed');

      setMessage('Registration request sent! Await approval from super-admin.');
      setFormData({
        fullname: '',
        email: '',
        password: '',
        mobileNumber: '',
        role: 'vendor',
      });
    } catch (error) {
      setMessage(error.message);
    }
    setLoading(false);
  };

  return (
    <>
   
           <SuperAdminHeader/>
    <div className="max-w-md mx-auto mt-12 p-6 border rounded shadow-lg bg-white">
     
      <h1 className="text-2xl font-bold mb-6 text-center">Register as Admin or Vendor</h1>

      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes('failed') ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullname" className="block mb-1 font-medium">Full Name</label>
          <input
            id="fullname"
            name="fullname"
            type="text"
            required
            value={formData.fullname}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 font-medium">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label htmlFor="mobileNumber" className="block mb-1 font-medium">Mobile Number</label>
          <input
            id="mobileNumber"
            name="mobileNumber"
            type="text"
            pattern="[0-9]{10}"
            title="Mobile number must be a 10-digit number"
            required
            value={formData.mobileNumber}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-medium">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label htmlFor="role" className="block mb-1 font-medium">Role</label>
          <select
            id="role"
            name="role"
            required
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="vendor">Vendor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Register'}
        </button>
      </form>
    </div>
     </>
  );
}
