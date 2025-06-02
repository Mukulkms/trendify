// src/super-admin/components/DashboardOverview.jsx
import React from 'react';

const DashboardOverview = () => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Sales Card */}
                <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Total Sales</p>
                        <p className="text-2xl font-semibold">$8,245.00</p>
                        <p className="text-xs text-green-500">↑ +0.5% from last week</p>
                    </div>
                    <div className="bg-green-100 p-2 rounded-full">
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                    </div>
                </div>
                {/* Total Order Card */}
                <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Total Order</p>
                        <p className="text-2xl font-semibold">1,256</p>
                        <p className="text-xs text-red-500">↓ -1.0% from last week</p>
                    </div>
                    <div className="bg-red-100 p-2 rounded-full">
                        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm-1 11a1 1 0 100-2h2a1 1 0 100 2h-2z" clipRule="evenodd"></path></svg>
                    </div>
                </div>
                {/* Net Sales Card */}
                <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Net Sales</p>
                        <p className="text-2xl font-semibold">$431.00</p>
                        <p className="text-xs text-green-500">↑ +1.0% from last week</p>
                    </div>
                    <div className="bg-green-100 p-2 rounded-full">
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zm0 7a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zm0 7a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1z"></path></svg>
                    </div>
                </div>
                {/* Total Variant Card */}
                <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Total Variant</p>
                        <p className="text-2xl font-semibold">456K</p>
                        <p className="text-xs text-green-500">↑ +2.5% from last week</p>
                    </div>
                    <div className="bg-green-100 p-2 rounded-full">
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zm0 7a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zm0 7a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1z"></path></svg>
                    </div>
                </div>
            </div>

            {/* Total Order Overview & Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Total Order Overview</h3>
                    <div className="flex items-center mb-4">
                        <div className="bg-green-500 text-white text-3xl font-bold p-4 rounded-lg">128</div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Total orders</p>
                            <p className="text-xs text-gray-400">Last update: Apr 20, 2024</p>
                        </div>
                    </div>
                    <div className="border-t pt-4">
                        <p className="text-sm text-gray-500">Lifetime Spent</p>
                        <p className="text-xl font-semibold">$45,289.00</p>
                        <p className="text-xs text-green-500">↑ +12.0% from last month</p>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-gray-500">Average orders</p>
                        <p className="text-xl font-semibold">$689.00</p>
                        <p className="text-xs text-red-500">↓ -12.0% from last month</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Statistics</h3>
                    {/* Placeholder for chart - you'd integrate a charting library here */}
                    <div className="h-48 bg-gray-50 flex items-center justify-center text-gray-400">
                        Graph Placeholder ($25,765.00 in Feb)
                    </div>
                </div>
            </div>

            {/* Stock Unit & Most Selling Product */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Stock Unit</h3>
                    {/* Placeholder for pie chart */}
                    <div className="h-48 bg-gray-50 flex items-center justify-center text-gray-400">
                        Pie Chart Placeholder (50% Production, 30% Store, 20% In Stock)
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex justify-between items-center">
                        Most Selling Product
                        <button className="bg-blue-500 text-white text-sm px-3 py-1 rounded">+ Add products</button>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {/* Example product items */}
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="border p-2 rounded-lg text-center">
                                <img src={`https://via.placeholder.com/100?text=Product${i}`} alt={`Product ${i}`} className="mx-auto mb-2" />
                                <p className="text-sm font-medium">Rompi Berkaning</p>
                                <p className="text-xs text-gray-500">$1400.00</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;