// frontend/src/components/filters/accessoriesfilter.jsx
import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faTag, faStar, faPalette, faRulerHorizontal, faFilter, faShop, faIndianRupeeSign, faTransgender } from '@fortawesome/free-solid-svg-icons';

// Fixed options for price, ratings, discount, and gender (for accessories)
const PRICE_RANGES = [
    { label: "Under ₹500", value: "Under ₹500" },
    { label: "₹500 - ₹1000", value: "₹500 - ₹1000" },
    { label: "₹1000 - ₹2000", value: "₹1000 - ₹2000" },
    { label: "Above ₹2000", value: "Above ₹2000" },
];

const RATINGS_OPTIONS = [
    { label: "★★★★★", value: 5 },
    { label: "★★★★☆", value: 4 },
    { label: "★★★☆☆", value: 3 },
    { label: "★★☆☆☆", value: 2 },
    { label: "★☆☆☆☆", value: 1 },
];

const DISCOUNT_OPTIONS = [
    { label: "10% or more", value: "10% or more" },
    { label: "20% or more", value: "20% or more" },
    { label: "30% or more", value: "30% or more" },
    { label: "50% or more", value: "50% or more" },
];

const GENDER_OPTIONS = [
    { label: "Men", value: "men" },
    { label: "Women", value: "women" },
    { label: "Unisex", value: "unisex" },
];

const AccessoriesFilter = ({
    selectedFilters,
    setSelectedFilters,
    // Props for dynamic options from the Accessories page
    availableCategories,
    availableColors,
    availableBrands,
}) => {
    const [openFilters, setOpenFilters] = useState({});
    const containerRef = useRef(null);
    const [maxHeight, setMaxHeight] = useState('none');

    useEffect(() => {
        const updateMaxHeight = () => {
            if (containerRef.current) {
                const parentHeight = containerRef.current.parentElement?.offsetHeight || window.innerHeight;
                const calculatedMaxHeight = parentHeight - 120; // Adjust as needed
                setMaxHeight(calculatedMaxHeight > 0 ? `${calculatedMaxHeight}px` : 'none');
            } else {
                setMaxHeight('none');
            }
        };

        updateMaxHeight();
        window.addEventListener('resize', updateMaxHeight);

        return () => {
            window.removeEventListener('resize', updateMaxHeight);
        };
    }, []);

    const toggleFilter = (filterName) => {
        setOpenFilters((prev) => ({
            ...prev,
            [filterName]: !prev[filterName],
        }));
    };

    // Construct filterData dynamically using passed props and fixed options
    const filterData = [];

    // Gender Filter (Specific to accessories to allow selection)
    filterData.push({
        name: "gender",
        title: "Gender",
        icon: <FontAwesomeIcon icon={faTransgender} className="mr-2 text-gray-500" />,
        options: GENDER_OPTIONS,
    });

    // Category Filter (dynamic from availableCategories)
    if (availableCategories && availableCategories.length > 0) {
        filterData.push({
            name: "category",
            title: "Category",
            icon: <FontAwesomeIcon icon={faFilter} className="mr-2 text-gray-500" />,
            options: availableCategories.map(cat => ({ label: cat, value: cat })),
        });
    }

    // Color Filter (dynamic from availableColors)
    if (availableColors && availableColors.length > 0) {
        filterData.push({
            name: "color",
            title: "Color",
            icon: <FontAwesomeIcon icon={faPalette} className="mr-2 text-gray-500" />,
            options: availableColors.map(c => ({
                label: c,
                value: c,
                // Handle specific color class mapping
                color: c.toLowerCase() === 'white' ? 'bg-white border border-gray-300' :
                       c.toLowerCase() === 'black' ? 'bg-black' :
                       `bg-${c.toLowerCase()}-500`
            })),
        });
    }

    // Price Filter (fixed options)
    filterData.push({
        name: "price",
        title: "Price",
        icon: <FontAwesomeIcon icon={faIndianRupeeSign} className="mr-2 text-gray-500" />,
        options: PRICE_RANGES,
    });

    // Brands Filter (dynamic from availableBrands)
    if (availableBrands && availableBrands.length > 0) {
        filterData.push({
            name: "brands",
            title: "Brands",
            icon: <FontAwesomeIcon icon={faShop} className="mr-2 text-gray-500" />,
            options: availableBrands.map(b => ({ label: b, value: b })),
        });
    }

    // Ratings Filter (fixed options)
    filterData.push({
        name: "ratings",
        title: "Ratings",
        icon: <FontAwesomeIcon icon={faStar} className="mr-2 text-gray-500" />,
        options: RATINGS_OPTIONS,
    });

    // Discount Filter (fixed options)
    filterData.push({
        name: "discount",
        title: "Discount",
        icon: <FontAwesomeIcon icon={faTag} className="mr-2 text-gray-500" />,
        options: DISCOUNT_OPTIONS,
    });

    const handleChange = (filterName, value) => {
        setSelectedFilters((prev) => {
            const updated = { ...prev };
            if (!updated[filterName]) {
                updated[filterName] = [];
            }
            if (updated[filterName].includes(value)) {
                updated[filterName] = updated[filterName].filter((item) => item !== value);
            } else {
                updated[filterName] = [...updated[filterName], value];
            }
            return updated;
        });
    };

    return (
        <div ref={containerRef} className="bg-white p-4 w-full sm:w-64 top-20 overflow-y-auto rounded-md shadow" style={{ maxHeight: maxHeight }}>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
                <FontAwesomeIcon icon={faFilter} className="w-6 h-6 mr-2 text-gray-700" />
                Filters
            </h2>

            <div className="space-y-3">
                {filterData.map((filter) => (
                    // Only render filter section if there are options for it OR it's a fixed filter like Gender/Price/Ratings/Discount
                    (filter.options.length > 0 || ['gender', 'price', 'ratings', 'discount'].includes(filter.name)) && (
                        <div key={filter.name} className="border-b border-gray-200 pb-3">
                            <button
                                type="button"
                                className="w-full text-left py-2 focus:outline-none"
                                onClick={() => toggleFilter(filter.name)}
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="font-medium flex items-center">{filter.icon} {filter.title}</h3>
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className={`w-5 h-5 text-gray-500 transition-transform ${
                                            openFilters[filter.name] ? "-rotate-180" : ""
                                        }`}
                                    />
                                </div>
                            </button>
                            {openFilters[filter.name] && (
                                <div className="mt-2 pl-2">
                                    {filter.options.map((option) => (
                                        <label key={`${filter.name}-${option.value}`} className="flex items-center space-x-2 mb-1 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                checked={selectedFilters[filter.name]?.includes(option.value) || false}
                                                onChange={() => handleChange(filter.name, option.value)}
                                            />
                                            <span className="text-sm flex items-center">
                                                {filter.name === "color" && option.color && <span className={`inline-block w-4 h-4 rounded-full mr-2 ${option.color}`}></span>}
                                                {option.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default AccessoriesFilter;