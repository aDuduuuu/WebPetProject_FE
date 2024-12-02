import React, { useState } from 'react';
import Header from '../components/Header';  // Ensure the path is correct
import Footer from '../components/Footer';  // Ensure the path is correct

const Statistics = () => {
  const [activeSection, setActiveSection] = useState('revenue'); // Default section to show "Doanh thu theo thời gian"

  // Function to render the content based on the active section
  const renderContent = () => {
    switch (activeSection) {
      case 'revenue':
        return <div>Display revenue stats by time (day, week, month, quarter, year).</div>;
      case 'orders':
        return <div>Display order count by day, week, month, year.</div>;
      case 'bestSellers':
        return <div>Display best-selling products for the selected time period.</div>;
      case 'returnRate':
        return <div>Display return rate with reasons (defective, mismatched, change of mind, etc.).</div>;
      default:
        return <div>Select a section from the sidebar.</div>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      <Header />
      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className="w-1/4 bg-gray-50 p-4">
          
          <ul className="space-y-4">
            <li>
              <button
                className={`w-full text-left p-2 rounded-md ${activeSection === 'revenue' ? 'bg-teal-500 font-bold text-white' : 'text-teal-500 font-bold hover:bg-gray-300'}`}
                onClick={() => setActiveSection('revenue')}
              >
                Revenue by Time
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded-md ${activeSection === 'orders' ? 'bg-teal-500 font-bold text-white' : 'text-teal-500 font-bold hover:bg-gray-300'}`}
                onClick={() => setActiveSection('orders')}
              >
                Orders Count
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded-md ${activeSection === 'bestSellers' ? 'bg-teal-500 font-bold text-white' : 'text-teal-500 font-bold hover:bg-gray-300'}`}
                onClick={() => setActiveSection('bestSellers')}
              >
                Best Selling Products
              </button>
            </li>
          </ul>
        </div>

        {/* Content Section */}
        <div className="w-3/4 p-6">
          {renderContent()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Statistics;
