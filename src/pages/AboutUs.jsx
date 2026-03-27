import React from 'react';

const AboutUs = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">About Us</h1>

      <section className="mb-6">
        <p className="text-gray-600 mb-4">
          GMC is an independent e-commerce platform built to support student and local buying and selling in Ilesa town.
        </p>
        <p className="text-gray-600 mb-4">
          We focus on trust, simplicity, and community commerce to create a safe and easy marketplace for everyone.
        </p>
        <p className="text-gray-600 mb-4">
          Our platform connects Buyers and Vendors directly, making transactions straightforward and reliable.
        </p>
        <p className="text-gray-600">
          We use manual verified payments only, ensuring every transaction is secure and confirmed.
        </p>
      </section>
    </div>
  );
};

export default AboutUs;