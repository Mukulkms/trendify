import React, { useState, useEffect } from "react";
import { FiFilter, FiX } from "react-icons/fi";
import AccessoriesFilter from "../components/filters/accessoriesfilter"; // Import the correct AccessoriesFilter
// import { menAccessories, womenAccessories } from "../Dummydata/AccessoriesData"; // Keep this if you want dummy fallback but remember to uncomment `allProducts` logic.
import ProductCard from "../components/ProductCard";

const Accessories = () => {
    // Renamed `products` to `allProducts` for consistency with previous dynamic examples
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state
    const [error, setError] = useState(null);   // Added error state

    // State to store unique filter options for accessories, extracted dynamically
    const [uniqueFilterOptions, setUniqueFilterOptions] = useState({
        categories: [],
        colors: [],
        brands: [],
        // No 'size' for accessories unless your schema specifically includes it
    });

    const [selectedFilters, setSelectedFilters] = useState({
        gender: [], // New: to filter men/women/unisex accessories
        category: [],
        // size: [], // Uncomment if accessories have a 'size' field in your product schema
        color: [],
        price: [],
        brands: [], // Maps to `brandname` from backend, assuming this is correct
        ratings: [],
        discount: [],
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch all products. We'll filter for accessories client-side.
                // If your API can directly filter by type/category:
                // const res = await fetch("/api/products?type=accessories"); or `?category=Watch,Belt` etc.
                const res = await fetch("http://localhost:5000/api/products"); // Assuming this fetches all products

                if (!res.ok) {
                    const errorDetail = await res.json().catch(() => ({ message: 'Unknown error' }));
                    throw new Error(
                        `Failed to fetch products: ${res.status} ${res.statusText} - ${errorDetail.message || 'Server error'}`
                    );
                }
                const data = await res.json();
                setAllProducts(data); // Store all fetched products
            } catch (err) {
                console.error("Error fetching products from API:", err);
                setError(`Failed to load products from server: ${err.message}.`);
                // Fallback to dummy data if API fails
                // setAllProducts([...menAccessories, ...womenAccessories]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []); // Empty dependency array means this runs once on mount

    // Effect to extract unique filter options from the fetched data
    useEffect(() => {
        const extractUniqueOptions = () => {
            // Filter products that are actually accessories from the full list
            // IMPORTANT: Adjust this condition based on how your backend identifies accessories.
            // Common ways: product.category === "Accessories", or p.category being one of "Wallet", "Belt", "Watch" etc.
            const accessoryProducts = allProducts.filter(p =>
                p.category && (
                    p.category.toLowerCase().includes("accessories") || // if a general "accessories" category exists
                    ["wallet", "belts", "watches", "sunglasses", "bags", "hats"].includes(p.category.toLowerCase()) // specific accessory categories
                )
            );

            const categories = new Set();
            const colors = new Set();
            const brands = new Set();

            accessoryProducts.forEach(product => {
                if (product.category) categories.add(product.category);
                if (product.color) colors.add(product.color);
                if (product.brandname) brands.add(product.brandname); // Assuming `brandname` is the correct field
            });

            setUniqueFilterOptions({
                categories: Array.from(categories).sort(),
                colors: Array.from(colors).sort(),
                brands: Array.from(brands).sort(),
            });
        };

        if (allProducts.length > 0) {
            extractUniqueOptions();
        }
    }, [allProducts]); // Recalculate unique options when `allProducts` changes

    // Effect to apply filters whenever selectedFilters or products (now `allProducts`) change
    useEffect(() => {
        let currentFiltered = allProducts;

        // Step 1: Initial filter to only show accessories from the overall product list
        currentFiltered = currentFiltered.filter(p =>
            p.category && (
                p.category.toLowerCase().includes("accessories") ||
                ["wallet", "belts", "watches", "sunglasses", "bags", "hats"].includes(p.category.toLowerCase())
            )
        );

        const { gender, category, color, price, brands, ratings, discount } = selectedFilters;

        // Apply gender filter (men, women, unisex)
        if (gender.length > 0) {
            currentFiltered = currentFiltered.filter((p) => gender.includes(p.gender));
        }

        // Apply accessory-specific category filter
        if (category.length > 0) {
            currentFiltered = currentFiltered.filter((p) => category.includes(p.category));
        }

        // Commented out size filter as accessories typically don't have this.
        // If your accessories DO have sizes, re-enable this and pass `availableSizes` to AccessoriesFilter.
        // if (selectedFilters.size.length > 0) {
        //     currentFiltered = currentFiltered.filter((p) => p.sizes?.some((s) => selectedFilters.size.includes(s)));
        // }

        if (color.length > 0) {
            currentFiltered = currentFiltered.filter((p) => color.includes(p.color));
        }

        if (price.length > 0) {
            currentFiltered = currentFiltered.filter((p) =>
                price.some((range) => {
                    const productPrice = p.price;
                    if (range === "Under ₹500") return productPrice < 500;
                    if (range === "₹500 - ₹1000") return productPrice >= 500 && productPrice <= 1000;
                    if (range === "₹1000 - ₹2000") return productPrice > 1000 && productPrice <= 2000;
                    if (range === "Above ₹2000") return productPrice > 2000;
                    return false; // Return false for unhandled ranges to not include product
                })
            );
        }
        if (brands.length > 0) {
            // Changed `p.brand` to `p.brandname` to match previous discussions and common schema patterns
            currentFiltered = currentFiltered.filter((p) => brands.includes(p.brandname));
        }
        if (ratings.length > 0) {
            // Changed `p.rating` to `p.ratings` to match previous discussions and common schema patterns
            currentFiltered = currentFiltered.filter((p) => ratings.some((r) => p.ratings >= r));
        }
        if (discount.length > 0) {
            currentFiltered = currentFiltered.filter((p) => discount.some((range) => {
                const productDiscount = p.discount || 0;
                if (range === "10% or more") return productDiscount >= 10;
                if (range === "20% or more") return productDiscount >= 20;
                if (range === "30% or more") return productDiscount >= 30;
                if (range === "50% or more") return productDiscount >= 50;
                return false; // Return false for unhandled ranges
            }));
        }

        setFilteredProducts(currentFiltered);
    }, [selectedFilters, allProducts]); // Ensure filtering reacts to changes in `selectedFilters` or `allProducts`

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-gray-700">Loading accessories...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-4 h-[calc(100vh-80px)]">
            <div className="lg:hidden flex justify-end mb-4">
                <button onClick={toggleSidebar} className="text-xl text-gray-700 p-2 bg-gray-200 rounded-md" aria-label={isSidebarOpen ? "Close filters" : "Open filters"}>
                    {isSidebarOpen ? <FiX /> : <FiFilter />}
                </button>
            </div>

            <div className={`w-full lg:w-1/5 border-r-2 h-full self-start transition-all duration-300 overflow-y-auto pr-2 ${isSidebarOpen ? "block" : "hidden lg:block"}`}>
                <AccessoriesFilter
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                    // Pass the dynamically extracted options to the filter component
                    availableCategories={uniqueFilterOptions.categories}
                    availableColors={uniqueFilterOptions.colors}
                    availableBrands={uniqueFilterOptions.brands}
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
                        No accessories found matching your criteria.
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

export default Accessories;