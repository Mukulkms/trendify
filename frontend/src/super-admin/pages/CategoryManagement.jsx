
import { useState, useEffect } from "react";
import { useAuth2 } from "../AuthContext2"; // Assuming this path is correct

import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  X, 
} from "lucide-react"; 

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl mx-auto transform transition-all duration-300 scale-100 opacity-100 max-h-[90vh] overflow-y-auto relative border border-gray-100">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-3xl z-10 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" /> {/* Lucid X icon for close */}
          </button>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

export default function CategoryManagement() {
  const { user, loading: authLoading } = useAuth2();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // For general page errors
  const [formError, setFormError] = useState(null); // For form-specific errors
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  // Form data for adding/editing a category
  const [formData, setFormData] = useState({
    name: "",
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(10); // Show 10 categories per page

  // IMPORTANT: Set your backend API base URL here
  // You can use environment variables (e.g., REACT_APP_BACKEND_URL) for production
  const backendBaseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';


  const getToken = () => {
    return localStorage.getItem("trendify_admin_token");
  };

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load

    // If user is null after auth loading, it means not logged in or unauthorized
    if (!user || (user.role !== 'super-admin' && user.role !== 'admin')) {
      setError("You are not authorized to view this page. Please log in as an admin.");
      return;
    }

    const token = getToken();
    if (token) {
      fetchCategories();
    } else {
      setError("Authentication token missing. Please log in.");
    }
  }, [authLoading, user]); // Depend on authLoading and user

  // --- API Calls ---
  const fetchCategories = async () => {
    const token = getToken();
    if (!token) {
      setError("Authentication token missing.");
      return;
    }

    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const response = await fetch(`${backendBaseUrl}/categories`, { // Correct API endpoint
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        setCurrentPage(1); // Reset to first page when categories are fetched
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to fetch categories: ${response.statusText}`
        );
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      setFormError("Category Name is required.");
      return;
    }

    const token = getToken();
    if (!token) {
      setFormError("Admin authentication required. Please log in.");
      return;
    }

    try {
      setLoading(true);
      setFormError(null); // Clear previous form errors
      const url = isEditing
        ? `${backendBaseUrl}/categories/${currentCategory._id}` // Correct API endpoint for update
        : `${backendBaseUrl}/categories/add`; // Correct API endpoint for add
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData), // formData contains { name: "..." }
      });

      if (response.ok) {
        const result = await response.json();
        if (isEditing) {
          setCategories((prev) =>
            prev.map((c) => (c._id === result._id ? result : c))
          );
          alert("Category updated successfully!");
        } else {
          setCategories((prev) => [...prev, result]);
          alert("Category added successfully!");
        }
        handleCloseModal(); // Close modal and reset form
        fetchCategories(); // Re-fetch to ensure list is up-to-date
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to ${isEditing ? "update" : "add"} category: ${
              response.statusText
            }`
        );
      }
    } catch (err) {
      console.error(`Error ${isEditing ? "updating" : "adding"} category:`, err);
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    const token = getToken();
    if (!token) {
      alert("Admin authentication required to delete a category.");
      return;
    }

    try {
      setLoading(true);
      setError(null); // Clear general error
      const response = await fetch(
        `${backendBaseUrl}/categories/${categoryId}`, // Correct API endpoint for delete
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setCategories((prev) => prev.filter((c) => c._id !== categoryId));
        alert("Category deleted successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to delete category: ${response.statusText}`
        );
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      setError(`Error deleting category: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Modal & Form Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError(null); // Clear form error on input change
  };

  const resetForm = () => {
    setFormData({
      name: "",
    });
    setIsEditing(false);
    setCurrentCategory(null);
    setFormError(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowCategoryModal(true);
  };

  const handleCloseModal = () => {
    setShowCategoryModal(false);
    resetForm();
  };

  const handleEditCategory = (category) => {
    setIsEditing(true);
    setCurrentCategory(category);
    setFormData({
      name: category.name || "",
    });
    setShowCategoryModal(true);
  };

  // --- Pagination Logic ---
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );
  const totalPages = Math.ceil(categories.length / categoriesPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- Conditional Rendering based on Auth and Loading ---
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 border-blue-600 mx-auto mb-4" /> {/* Lucid Loader icon */}
          <div className="text-lg text-gray-600 font-medium">Authenticating...</div>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'super-admin' && user.role !== 'admin')) { // Ensure only authorized users can access
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex justify-center items-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" /> {/* Lucid Alert icon */}
            <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600">You need to be logged in as an admin to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Category Management
              </h1>
              <p className="text-gray-600 mt-2">Manage your product categories</p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> {/* Lucid Plus icon */}
              Add New Category
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 p-6 rounded-xl mb-6 shadow-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-500" /> {/* Lucid AlertCircle icon */}
              </div>
              <div className="ml-3">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Category List / Loading State */}
        {loading && categories.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="animate-spin h-12 w-12 border-b-2 border-blue-600 mb-4" /> {/* Lucid Loader icon */}
              <div className="text-lg text-gray-600 font-medium">Loading categories...</div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Category Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentCategories.length === 0 && !loading ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <FolderOpen className="w-16 h-16 text-gray-400 mb-4" /> {/* Lucid FolderOpen icon */}
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No categories found
                          </h3>
                          <p className="text-gray-500">Add a new category to get started!</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentCategories.map((category, index) => (
                      <tr
                        key={category._id}
                        className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-bold text-gray-900">
                              {category.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {new Date(category.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-1"
                            >
                              <Edit className="w-4 h-4" /> {/* Lucid Edit icon */}
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category._id)}
                              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" /> {/* Lucid Trash2 icon */}
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {categories.length > categoriesPerPage && (
              <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {indexOfFirstCategory + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(indexOfLastCategory, categories.length)}
                      </span>{" "}
                      of <span className="font-medium">{categories.length}</span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" /> {/* Lucid ChevronLeft icon */}
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => paginate(page)}
                            aria-current={
                              currentPage === page ? "page" : undefined
                            }
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === page
                                ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" /> {/* Lucid ChevronRight icon */}
                      </button>
                    </nav>
                  </div>
                </div>
              </nav>
            )}
          </div>
        )}

        {/* Add/Edit Category Modal */}
        <Modal
          isOpen={showCategoryModal}
          onClose={handleCloseModal}
          title={isEditing ? "Edit Category" : "Add New Category"}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., T-Shirt, Shoes"
                required
              />
            </div>

            {formError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{formError}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    {isEditing ? "Updating..." : "Adding..."}
                  </>
                ) : isEditing ? (
                  <>
                    <Edit className="w-5 h-5" /> Update Category
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" /> Add Category
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}