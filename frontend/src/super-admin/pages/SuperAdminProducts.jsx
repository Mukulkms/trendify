import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth2 } from '../AuthContext2';

export default function SuperAdminProducts() {
  const { user, loading: authLoading } = useAuth2();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    image: '', // This will hold the filename or relative path
    stock: '',
    
  });
  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10); // You can adjust this number

  // Helper function to construct image URL
  const getImageUrl = (imagePath) => {
    // If imagePath is already a full URL, return it as is
    if (imagePath && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
      return imagePath;
    }
    // If imagePath starts with '/images/', just prepend the base URL
    if (imagePath && imagePath.startsWith('/images/')) {
        return `http://localhost:5000${imagePath}`;
    }
    // Otherwise, assume it's just the filename and construct the URL
    // Make sure 'public/assets/images' is the correct path in your backend server.js
    if (imagePath) {
      return `http://localhost:5000/images/${imagePath}`;
    }
    return 'https://via.placeholder.com/50'; // Default placeholder if no image path
  };

  // Fetch products from backend on mount
  useEffect(() => {
    if (authLoading || !user) return;

    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('trendify_admin_token');
        const response = await fetch('http://localhost:5000/api/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data);
        // Reset to first page when products change
        setCurrentPage(1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [authLoading, user]);

  // Handle create product form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
    setFormError(null); // Clear form error on input change
  };

  // Validate and handle create product form submission
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const { name, price, category, image, stock } = newProduct; // Include stock in destructuring

    // Basic validation
    if (!name || !price || !category || !image) {
      setFormError('Name, price, category, and image URL are required');
      return;
    }
    if (parseFloat(price) <= 0) {
      setFormError('Price must be greater than 0');
      return;
    }
    // Add validation for stock if needed
    if (stock !== '' && (isNaN(parseInt(stock)) || parseInt(stock) < 0)) {
        setFormError('Stock must be a non-negative number');
        return;
    }

    try {
      const token = localStorage.getItem('trendify_admin_token');
      const response = await fetch('http://localhost:5000/api/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      const createdProduct = await response.json();
      setProducts([...products, createdProduct]);
      setShowCreateForm(false);
      setNewProduct({ name: '', price: '', category: '', image: '', stock: '' });
      // After adding, ensure the new product is visible or go to the last page
      setCurrentPage(Math.ceil((products.length + 1) / productsPerPage));
    } catch (err) {
      setFormError(err.message);
    }
  };

  // Handle delete product
  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('trendify_admin_token');
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete product');
      }

      setProducts(products.filter((product) => product._id !== productId));
      // Adjust current page if the last product on a page was deleted
      if (currentProducts.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Navigate to edit product page
  const handleEdit = (productId) => {
    navigate(`/superadmin/products/edit/${productId}`);
  };

  // --- Pagination Logic ---
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    // Show max 5 page numbers around the current page
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
    }

    return pageNumbers.map((number, index) => (
      <li key={index} className="mx-1">
        {number === '...' ? (
          <span className="px-3 py-1 text-gray-500">...</span>
        ) : (
          <button
            onClick={() => paginate(number)}
            className={`px-3 py-1 border rounded ${
              currentPage === number ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-100'
            }`}
          >
            {number}
          </button>
        )}
      </li>
    ));
  };


  if (authLoading || loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Superadmin Products</h2>

      {/* Create Product Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Create Product
        </button>
      </div>

      {/* Create Product Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            {formError && <p className="text-red-500 mb-4">{formError}</p>}
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Category</label>
                <input
                  type="text"
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Image Filename (e.g., tshirt1.webp or images/tshirt1.webp)</label>
                <input
                  type="text"
                  name="image"
                  value={newProduct.image}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={newProduct.stock}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  min="0"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormError(null);
                    setNewProduct({ name: '', price: '', category: '', image: '', stock: '' });
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Image</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Price</th>
                <th className="py-3 px-6 text-left">Category</th>
                <th className="py-3 px-6 text-left">Stock</th>
                <th className="py-3 px-6 text-left">Ratings</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {currentProducts.map((product) => ( // Using currentProducts for pagination
                <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        console.error('Image failed to load:', e.target.src);
                        e.target.src = 'https://via.placeholder.com/50';
                      }}
                      loading="lazy" // Added for lazy loading images
                    />
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">{product.name}</td>
                  <td className="py-3 px-6 text-left">${parseFloat(product.price).toFixed(2)}</td>
                  <td className="py-3 px-6 text-left">{product.category}</td>
                  <td className="py-3 px-6 text-left">{product.stock || 0}</td>
                  <td className="py-3 px-6 text-left">{product.ratings || 0}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => handleEdit(product._id)}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {products.length > productsPerPage && (
        <nav className="flex justify-center mt-6">
          <ul className="flex items-center space-x-2">
            <li>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded ${
                  currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-100'
                }`}
              >
                Previous
              </button>
            </li>
            {renderPageNumbers()}
            <li>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded ${
                  currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-100'
                }`}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}