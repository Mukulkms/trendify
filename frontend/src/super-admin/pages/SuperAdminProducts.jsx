import { useState, useEffect } from "react";
import { useAuth2 } from "../AuthContext2"; // Assuming this path is correct
import { uploadToCloudinary } from "../utils/uploadToCloudinary"; // make sure this path is correct

// A simple reusable modal component
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-3xl w-full max-w-xl mx-auto transform transition-all duration-300 scale-100 opacity-100 max-h-[90vh] overflow-y-auto p-6 lg:p-8 relative">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-6 sticky top-0 bg-white z-10 -mx-6 -mt-6 px-6 pt-6 rounded-t-2xl lg:-mx-8 lg:-mt-8 lg:px-8 lg:pt-8">
          <h2 className="text-2xl font-extrabold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="pt-2">{children}</div>
      </div>
    </div>
  );
};

export default function ProductManagement() {
  const { user, loading: authLoading } = useAuth2();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // For general page errors
  const [formError, setFormError] = useState(null); // For form-specific errors
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(15); // Show 15 products per page

  const [formData, setFormData] = useState({
    name: "",
    description: "", // Added description field
    image: "", // Base64 string for image
    price: "",
    stock: 0,
    size: [],
    size_shoes: [],
    size_kids: [],
    category: "",
    gender: "",
    color: "",
    brandname: "",
    ratings: 0,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const categoryOptions = [
    "T-Shirt",
    "Shoes",
    "Jeans",
    "Hoodie",
    "Joggers",
    "Tops",
    "Leggings",
    "Top",
    "Dress",
    "Shirt",
    "Jacket",
    "Set",
    "Skirt Set",
    "Blazer",
    "Skirt",
    "Wallets",
    "Belts",
    "Watches",
    "Sunglasses",
    "Bags",
    "Hats",
  ];

  const genderOptions = ["men", "women", "kids"];

  const sizeOptions = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "26",
    "28",
    "30",
    "32",
    "34",
    "36",
    "38",
  ];
  const sizeShoesOptions = ["6", "7", "8", "9", "10"];
  const sizeKidsOptions = [
    "0-1yrs",
    "1-2yrs",
    "2-3yrs",
    "3-4yrs",
    "4-5yrs",
    "5-6yrs",
    "6-7yrs",
    "7-8yrs",
    "8-9yrs",
    "10-12yrs",
  ];

  const getToken = () => {
    return localStorage.getItem("trendify_admin_token");
  };

  useEffect(() => {
    if (authLoading || !user) return; // Wait for auth to load and user to be present

    const token = getToken();
    if (token) {
      fetchProducts();
    } else {
      setError("Authentication token missing. Please log in.");
    }
  }, [authLoading, user]); // Depend on authLoading and user

  const fetchProducts = async () => {
    const token = getToken();
    if (!token) {
      setError("Authentication token missing.");
      return;
    }

    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const response = await fetch("http://localhost:5000/api/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        // Reset to first page if products change significantly
        setCurrentPage(1);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to fetch products: ${response.statusText}`
        );
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError(null); // Clear form error on input change
  };

  const handleSizeChange = (sizeType, size) => {
    setFormData((prev) => ({
      ...prev,
      [sizeType]: prev[sizeType].includes(size)
        ? prev[sizeType].filter((s) => s !== size)
        : [...prev[sizeType], size],
    }));
  };

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setFormError(null); // Clear any previous error

  try {
    // Optional: Show a loading preview before upload completes
    const previewURL = URL.createObjectURL(file);
    setImagePreview(previewURL);

    // Upload to Cloudinary and get hosted URL
    const cloudinaryUrl = await uploadToCloudinary(file);

    // Store Cloudinary URL in form state
    setFormData((prev) => ({
      ...prev,
      image: cloudinaryUrl,
    }));
  } catch (err) {
    console.error("Image upload error:", err);
    setFormError("Image upload failed. Please try again.");
  }
};


  const resetForm = () => {
    setFormData({
      name: "",
      description: "", // Reset description field
      image: "",
      price: "",
      stock: 0,
      size: [],
      size_shoes: [],
      size_kids: [],
      category: "",
      gender: "",
      color: "",
      brandname: "",
      ratings: 0,
    });
    setImagePreview(null);
    setIsEditing(false);
    setCurrentProduct(null);
    setFormError(null); // Also reset form error when resetting form
  };

  const handleOpenAddModal = () => {
    resetForm(); // Ensure form is clear for new product
    setShowAddProductModal(true);
  };

  const handleCloseModal = () => {
    setShowAddProductModal(false);
    resetForm(); // Reset form on close
  };

  const handleEditProduct = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "", // Set description field
      image: product.image || "", // Use existing image if present
      price: product.price ? product.price.toString() : "", // Convert number to string for input
      stock: product.stock || 0,
      size: product.size || [],
      size_shoes: product.size_shoes || [],
      size_kids: product.size_kids || [],
      category: product.category || "",
      gender: product.gender || "",
      color: product.color || "",
      brandname: product.brandname || "",
      ratings: product.ratings || 0,
    });
    setImagePreview(product.image || null); // Set image preview if image exists
    setShowAddProductModal(true); // Open the modal for editing
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    const token = getToken();
    if (!token) {
      alert("Admin authentication required to delete a product.");
      return;
    }

    try {
      setLoading(true);
      setError(null); // Clear general error
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
        alert("Product deleted successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to delete product: ${response.statusText}`
        );
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(`Error deleting product: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Validate form data
  const validateForm = () => {
    const {
      name,
      price,
      category,
      gender,
      color,
      brandname,
      image,
      description,
    } = formData;

    // Check required fields
    if (!name.trim()) return "Product Name is required.";
    if (!description.trim()) return "Product Description is required."; // Add this validation
    if (!image) return "Product Image is required. Please upload an image.";

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0)
      return "Price is required and must be a positive number.";
    if (!category) return "Category is required.";
    if (!gender) return "Gender is required.";
    if (!color.trim()) return "Color is required.";
    if (!brandname.trim()) return "Brand Name is required.";

    // Validate numeric fields
    if (formData.stock < 0) {
      return "Stock must be a non-negative number.";
    }

    if (
      formData.ratings < 0 ||
      formData.ratings > 5 ||
      (formData.ratings !== 0 && isNaN(parseFloat(formData.ratings)))
    ) {
      return "Ratings must be between 0 and 5.";
    }

    // Conditional size validation based on category/gender
    if (formData.category === "Shoes" && formData.size_shoes.length === 0) {
      return "Please select at least one shoe size for shoes category.";
    }
    if (formData.gender === "kids" && formData.size_kids.length === 0) {
      return "Please select at least one kid size for kids gender.";
    }
    // Only apply if not shoes and not kids, and if regular sizes are expected
    if (
      formData.category !== "Shoes" &&
      formData.gender !== "kids" &&
      formData.size.length === 0
    ) {
      // This is a more nuanced check. You might want to allow empty regular sizes for accessories, etc.
      // For now, let's assume if it's not shoes/kids, it needs regular sizes.
      // You can adjust this logic based on your exact product types.
      if (
        !["Wallets", "Belts", "Watches", "Sunglasses", "Bags", "Hats"].includes(
          formData.category
        )
      ) {
        return "Please select at least one regular size for this product.";
      }
    }

    return null;
  };

  // Updated handleSubmit function to properly handle description
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
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
        ? `http://localhost:5000/api/products/${currentProduct._id}`
        : "http://localhost:5000/api/products/add";
      const method = isEditing ? "PUT" : "POST";

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(), // Ensure description is trimmed but not empty
        image: formData.image,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        size: formData.size,
        size_shoes: formData.size_shoes,
        size_kids: formData.size_kids,
        category: formData.category,
        gender: formData.gender,
        color: formData.color.trim(),
        brandname: formData.brandname.trim(),
        ratings: parseFloat(formData.ratings),
      };

      // Additional check to ensure description is not empty after trimming
      if (!productData.description) {
        setFormError("Product Description cannot be empty.");
        return;
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const result = await response.json();
        if (isEditing) {
          setProducts((prev) =>
            prev.map((p) => (p._id === result._id ? result : p))
          );
          alert("Product updated successfully!");
        } else {
          setProducts((prev) => [...prev, result]);
          alert("Product added successfully!");
        }
        handleCloseModal(); // Close modal and reset form
        fetchProducts(); // Re-fetch products to ensure list is up-to-date
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to ${isEditing ? "update" : "add"} product: ${
              response.statusText
            }`
        );
      }
    } catch (err) {
      console.error(`Error ${isEditing ? "updating" : "adding"} product:`, err);
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-600">Authenticating...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-red-600">
          You need to be logged in as an admin to access this page.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <button
          onClick={handleOpenAddModal}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Product
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && products.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading products...</div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Scrollable Table Container */}
          <div className="overflow-x-auto max-h-[calc(100vh-250px)] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      {loading
                        ? "Loading products..."
                        : "No products found. Add a new product to get started!"}
                    </td>
                  </tr>
                ) : (
                  currentProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {product.image ? (
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={product.image}
                                alt={product.name}
                              />
                            ) : (
                              <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-500 text-xs">
                                  No IMG
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.color}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.brandname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.ratings}/5
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {products.length > productsPerPage && (
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
                      {indexOfFirstProduct + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastProduct, products.length)}
                    </span>{" "}
                    of <span className="font-medium">{products.length}</span>{" "}
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
                      {/* Heroicon name: solid/chevron-left */}
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
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
                      {/* Heroicon name: solid/chevron-right */}
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </nav>
          )}
        </div>
      )}

      {/* Create/Edit Product Modal */}
      <Modal
        isOpen={showAddProductModal}
        onClose={handleCloseModal}
        title={isEditing ? "Edit Product" : "Add New Product"}
      >
        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Required Fields Section */}
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-red-800 mb-4">
              Required Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product description"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  {genderOptions.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color *
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter color"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                  name="brandname"
                  value={formData.brandname}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter brand name"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!isEditing}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Optional Fields Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-blue-800 mb-4">
              Additional Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ratings (0-5)
                </label>
                <input
                  type="number"
                  name="ratings"
                  value={formData.ratings}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                  max="5"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {/* Size Selection Section */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-green-800 mb-4">
              Size Options
            </h4>

            {/* Regular Sizes */}
            {formData.category !== "Shoes" && formData.gender !== "kids" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Regular Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeChange("size", size)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        formData.size.includes(size)
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Shoe Sizes */}
            {formData.category === "Shoes" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shoe Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizeShoesOptions.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeChange("size_shoes", size)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        formData.size_shoes.includes(size)
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Kids Sizes */}
            {formData.gender === "kids" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kids Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizeKidsOptions.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeChange("size_kids", size)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        formData.size_kids.includes(size)
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? isEditing
                  ? "Updating..."
                  : "Adding..."
                : isEditing
                ? "Update Product"
                : "Add Product"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
