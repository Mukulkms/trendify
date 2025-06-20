// src/super-admin/components/DashboardOverview.jsx

const DashboardOverview = () => {
    return (
        <div className="">           
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