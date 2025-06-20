import React, { useState, useEffect } from "react";
import { FiFilter, FiX } from "react-icons/fi";
import ProductFilter from "../components/filters/ProductFilter";
import ProductCard from "../components/ProductCard";

const KidsClothing = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State to store unique filter options for this gender
    const [uniqueFilterOptions, setUniqueFilterOptions] = useState({
        categories: [],
        kidsSizes: [],  // Exclusively for kids
        shoeSizes: [],  // Kids can have shoes too
        colors: [],
        brands: [],
    });

    const [selectedFilters, setSelectedFilters] = useState({
        category: [],
        size_kids: [], // Only this size type for kids apparel
        size_shoes: [], // For kid's shoes
        color: [],
        price: [],
        brands: [],
        ratings: [],
        discount: [],
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Function to fetch products from backend API
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch("http://localhost:5000/api/products");
                if (!res.ok) {
                    const errorDetail = await res.json().catch(() => ({ message: 'Unknown error' }));
                    throw new Error(
                        `Failed to fetch products: ${res.status} ${res.statusText} - ${errorDetail.message || 'Server error'}`
                    );
                }
                const data = await res.json();
                setAllProducts(data);
            } catch (err) {
                console.error("Error fetching products from API:", err);
                setError(`Failed to load products from server: ${err.message}.`);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Effect to extract unique filter options whenever allProducts changes
    useEffect(() => {
        const extractUniqueOptions = () => {
            const kidsProducts = allProducts.filter(p => p.gender === "kids");

            const categories = new Set();
            const kidsSizes = new Set();
            const shoeSizes = new Set();
            const colors = new Set();
            const brands = new Set();

            kidsProducts.forEach(product => {
                if (product.category) categories.add(product.category);
                if (product.color) colors.add(product.color);
                if (product.brandname) brands.add(product.brandname);

                if (product.size_kids && Array.isArray(product.size_kids)) {
                    product.size_kids.forEach(s => kidsSizes.add(s));
                }
                if (product.size_shoes && Array.isArray(product.size_shoes)) {
                    product.size_shoes.forEach(s => shoeSizes.add(s));
                }
            });

            setUniqueFilterOptions({
                categories: Array.from(categories).sort(),
                kidsSizes: Array.from(kidsSizes).sort(),
                shoeSizes: Array.from(shoeSizes).sort(),
                colors: Array.from(colors).sort(),
                brands: Array.from(brands).sort(),
            });
        };

        if (allProducts.length > 0) {
            extractUniqueOptions();
        }
    }, [allProducts]);

    // Effect to apply filters whenever selectedFilters or allProducts change
    useEffect(() => {
        let currentFiltered = allProducts;

        // Step 1: Filter by gender "kids" first
        currentFiltered = currentFiltered.filter((p) => p.gender === "kids");

        // Step 2: Apply all other selected filters
        if (selectedFilters.category.length > 0) {
            currentFiltered = currentFiltered.filter((p) =>
                selectedFilters.category.includes(p.category)
            );
        }

        // Apply size filters for kids (kids_size and shoes)
        if (selectedFilters.size_kids.length > 0 || selectedFilters.size_shoes.length > 0) {
            currentFiltered = currentFiltered.filter((p) => {
                const kidsSizeMatch = selectedFilters.size_kids.length > 0 &&
                                      Array.isArray(p.size_kids) &&
                                      p.size_kids.some((s) => selectedFilters.size_kids.includes(s));

                const shoeSizeMatch = selectedFilters.size_shoes.length > 0 &&
                                      Array.isArray(p.size_shoes) &&
                                      p.size_shoes.some((s) => selectedFilters.size_shoes.includes(s));

                return kidsSizeMatch || shoeSizeMatch;
            });
        }


        if (selectedFilters.color.length > 0) {
            currentFiltered = currentFiltered.filter((p) =>
                selectedFilters.color.includes(p.color)
            );
        }

        if (selectedFilters.price.length > 0) {
            currentFiltered = currentFiltered.filter((p) => {
                const price = p.price;
                return selectedFilters.price.some((range) => {
                    if (range === "Under ₹500") return price < 500;
                    if (range === "₹500 - ₹1000") return price >= 500 && price <= 1000;
                    if (range === "₹1000 - ₹2000") return price > 1000 && price <= 2000;
                    if (range === "Above ₹2000") return price > 2000;
                    return false;
                });
            });
        }

        if (selectedFilters.brands.length > 0) {
            currentFiltered = currentFiltered.filter((p) =>
                selectedFilters.brands.includes(p.brandname)
            );
        }

        if (selectedFilters.ratings.length > 0) {
            currentFiltered = currentFiltered.filter((p) =>
                selectedFilters.ratings.some((selectedRating) => p.ratings >= selectedRating)
            );
        }

        if (selectedFilters.discount.length > 0) {
            currentFiltered = currentFiltered.filter((p) => {
                const productDiscount = p.discount || 0;
                return selectedFilters.discount.some((range) => {
                    if (range === "10% or more") return productDiscount >= 10;
                    if (range === "20% or more") return productDiscount >= 20;
                    if (range === "30% or more") return productDiscount >= 30;
                    if (range === "50% or more") return productDiscount >= 50;
                    return false;
                });
            });
        }

        setFilteredProducts(currentFiltered);
    }, [selectedFilters, allProducts]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-gray-700">Loading kids' clothing...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-4 h-[calc(100vh-80px)]">
            <div className="lg:hidden flex justify-end mb-4">
                <button
                    onClick={toggleSidebar}
                    className="text-xl text-gray-700 p-2 bg-gray-200 rounded-md"
                    aria-label={isSidebarOpen ? "Close filters" : "Open filters"}
                >
                    {isSidebarOpen ? <FiX /> : <FiFilter />}
                </button>
            </div>

            <div
                className={`w-full lg:w-1/5 border-r-2 h-full self-start transition-all duration-300 overflow-y-auto pr-2 ${
                    isSidebarOpen ? "block" : "hidden lg:block"
                }`}
            >
                <ProductFilter
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                    gender="kids"
                    availableCategories={uniqueFilterOptions.categories}
                    availableKidsSizes={uniqueFilterOptions.kidsSizes} // Pass kids sizes explicitly
                    availableShoeSizes={uniqueFilterOptions.shoeSizes} // Pass shoe sizes for kids
                    availableColors={uniqueFilterOptions.colors}
                    availableBrands={uniqueFilterOptions.brands}
                    // No 'availableSizes' for apparel as it's not relevant to kids' clothing
                />
            </div>

            <div className="w-full lg:w-4/5 overflow-y-auto pr-2">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {filteredProducts.length === 0 && !loading && !error ? (
                    <div className="text-center text-gray-600 text-lg mt-10">
                        No kids' products found matching your criteria.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default KidsClothing;