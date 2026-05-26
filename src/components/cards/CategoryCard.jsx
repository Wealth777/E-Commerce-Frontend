import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const CategoryCard = ({ category }) => {
  const { isDark } = useTheme();

  const cardBg = isDark
    ? 'bg-gray-800'
    : 'bg-white';

  const textColor = isDark
    ? 'text-white'
    : 'text-gray-900';

  const categoryId =
    category?._id ||
    category?.id ||
    '';

  return (
    <Link
      to={`/products?category=${categoryId}`}
    >
      <div
        className={`${cardBg} rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer`}
      >
        <div className="relative w-full h-32 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <img
            src={
              category.image ||
              'https://via.placeholder.com/300x150'
            }
            alt={category.name}
            className="w-full h-full object-cover hover:scale-110 transition duration-300"
          />
        </div>

        <div className="p-4 text-center">
          <h3
            className={`text-lg font-semibold ${textColor} hover:text-red-600 transition`}
          >
            {category.name}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            {category.count ?? 0}{' '}
            {category.count === 1
              ? 'product'
              : 'products'}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;