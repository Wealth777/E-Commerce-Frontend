import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiBookOpen, FiTruck } from 'react-icons/fi';
import { FaUniversity } from 'react-icons/fa';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-green-600 to-green-800 dark:from-green-800 dark:to-green-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div>
            <div className="flex items-center mb-6">
              <FaUniversity className="h-12 w-12 mr-4" />
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  CampusTrade
                </h1>
                <p className="text-lg text-green-100">
                  E-commerce Platform for univerties use
                </p>
              </div>
            </div>
            
            <p className="text-xl mb-8 text-green-50">
              Buy, sell, and trade campus essentials with fellow students and university stores. 
              Everything you need for your academic journey in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-lg bg-yellow-500 text-black hover:bg-yellow-600 transition-colors"
              >
                <FiShoppingBag className="mr-2 h-5 w-5" />
                Start Shopping
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-lg bg-transparent border-2 border-white text-white hover:bg-white/10 transition-colors"
              >
                <FiBookOpen className="mr-2 h-5 w-5" />
                Become a Seller
              </Link>
            </div>
            
            {/* Quick stats */}
            <div className="mt-12 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-green-200">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">2,000+</div>
                <div className="text-sm text-green-200">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm text-green-200">Satisfaction</div>
              </div>
            </div>
          </div>
          
          {/* Right side - Illustration */}
          <div className="relative">
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 rounded-xl p-4 animate-pulse">
                  <div className="h-32 bg-white/30 rounded-lg mb-2"></div>
                  <div className="h-4 bg-white/30 rounded w-3/4"></div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 animate-pulse delay-100">
                  <div className="h-32 bg-white/30 rounded-lg mb-2"></div>
                  <div className="h-4 bg-white/30 rounded w-3/4"></div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 animate-pulse delay-200">
                  <div className="h-32 bg-white/30 rounded-lg mb-2"></div>
                  <div className="h-4 bg-white/30 rounded w-3/4"></div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 animate-pulse delay-300">
                  <div className="h-32 bg-white/30 rounded-lg mb-2"></div>
                  <div className="h-4 bg-white/30 rounded w-3/4"></div>
                </div>
              </div>
              
              {/* Delivery badge */}
              <div className="absolute -bottom-4 -right-4 bg-yellow-500 text-black rounded-lg p-4 shadow-lg">
                <div className="flex items-center">
                  <FiTruck className="h-6 w-6 mr-2" />
                  {/* <div>
                    <div className="font-bold">Campus Delivery</div>
                    <div className="text-sm">Available Now</div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave separator */}
      <div className="absolute bottom-0 w-full overflow-hidden">
        <svg
          className="relative block w-full h-12"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="fill-current text-gray-50 dark:text-gray-900"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="fill-current text-gray-50 dark:text-gray-900"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="fill-current text-gray-50 dark:text-gray-900"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;