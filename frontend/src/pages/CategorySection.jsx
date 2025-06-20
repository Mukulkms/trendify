import React, { memo } from "react";
import { Link } from "react-router-dom";

import men from "../assets/images/n1.jpg";
import women from "../assets/images/n3.jpg";
import kids from "../assets/images/n7.jpg";
import accessories from "../assets/images/bag.webp";
import heavy from "../assets/images/jeans.webp";
import sneakers from "../assets/images/artem-bondarchuk-XPBYi4K8vFI-unsplash.jpg";
import newarrival from "../assets/images/hoodie2.webp";

const categories = [
  { name: "Men", image: men },
  { name: "Women", image: women },
  { name: "Kids", image: kids },
  { name: "Accessories", image: accessories },
  { name: "Heavy Duty", image: heavy },
  { name: "Sneakers", image: sneakers },
  { name: "New Arrivals", image: newarrival },
];

const CategoryCard = memo(({ category }) => (
  <Link
    to={`/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
    className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 group"
  >
    <img
      src={category.image}
      alt={category.name}
      className="w-full h-64 sm:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <h3 className="text-white text-xl font-semibold text-center transition-opacity duration-300 group-hover:opacity-0">
        {category.name}
      </h3>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="bg-white py-3 px-6 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-indigo-400">
          Shop {category.name}
        </button>
      </div>
    </div>
  </Link>
));

const CategorySection = () => {
  return (
    <section className="bg-gray-100 py-16 font-sans font-normal">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-semibold text-gray-800 mb-10 text-center">
          Shop By Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8">
          {categories.map((category) => (
            <CategoryCard key={category.name} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;