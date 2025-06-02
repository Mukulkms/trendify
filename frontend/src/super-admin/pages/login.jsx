import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming react-router-dom is used
import SuperAdminHeader from '../../components/SuperAdminHeader';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:5000/api/superadmin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');

      // Save token (example: localStorage)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect based on role and approval status
      if (data.user.role === 'super-admin') {
        navigate('/superadmin/dashboard');
      } else if (data.user.role === 'admin' || data.user.role === 'vendor') {
        if (data.user.isApproved) {
          navigate('/dashboard'); // normal dashboard
        } else {
          alert('Your registration is pending approval from super-admin.');
          // Optionally redirect to a pending approval page or stay here
        }
      } else {
        alert('Unauthorized role');
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <>
   
      <SuperAdminHeader/>
    <div className="max-w-md mx-auto mt-12 p-6  border rounded shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-200 text-red-800 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
     </>
  );
}
