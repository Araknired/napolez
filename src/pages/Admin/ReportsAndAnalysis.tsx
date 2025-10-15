import { BarChart3, TrendingUp, Download, Calendar } from 'lucide-react';

export default function ReportsAndAnalysis() {
  const salesData = [
    { month: 'Jan', sales: 4200 },
    { month: 'Feb', sales: 5800 },
    { month: 'Mar', sales: 7200 },
    { month: 'Apr', sales: 6500 },
    { month: 'May', sales: 8900 },
    { month: 'Jun', sales: 10200 },
  ];

  const topProducts = [
    { name: 'Pepperoni Pizza', sales: 245, revenue: 8575 },
    { name: 'Classic Burger', sales: 198, revenue: 5940 },
    { name: 'Chocolate Donut', sales: 156, revenue: 1248 },
    { name: 'Vanilla Ice Cream', sales: 134, revenue: 1608 },
    { name: 'French Fries', sales: 112, revenue: 560 },
  ];

  const maxSales = Math.max(...salesData.map(d => d.sales));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">View insights and download reports</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">Total Revenue</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">$52,847</p>
          <p className="text-sm text-green-600 mt-2">+18.2% from last month</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">Orders</span>
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">1,247</p>
          <p className="text-sm text-blue-600 mt-2">+12.5% from last month</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">Avg. Order Value</span>
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">$42.38</p>
          <p className="text-sm text-purple-600 mt-2">+5.7% from last month</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">New Customers</span>
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">342</p>
          <p className="text-sm text-orange-600 mt-2">+23.1% from last month</p>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Sales Overview</h2>
        <div className="space-y-4">
          {salesData.map((data, index) => (
            <div key={index} className="flex items-center gap-4">
              <span className="w-12 text-sm font-semibold text-gray-700">{data.month}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-10 relative overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-4"
                  style={{ width: `${(data.sales / maxSales) * 100}%` }}
                >
                  <span className="text-white font-bold text-sm">${data.sales}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Top Selling Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sales</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-sm">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">{product.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600">{product.sales} units</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-green-600">${product.revenue}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Period Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-white rounded-2xl p-6 shadow-sm border-2 border-purple-500 hover:shadow-lg transition-all">
          <Calendar className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="font-bold text-gray-900 mb-1">This Month</h3>
          <p className="text-sm text-gray-500">Current month statistics</p>
        </button>

        <button className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all">
          <Calendar className="w-8 h-8 text-gray-400 mb-3" />
          <h3 className="font-bold text-gray-900 mb-1">Last Month</h3>
          <p className="text-sm text-gray-500">Previous month data</p>
        </button>

        <button className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all">
          <Calendar className="w-8 h-8 text-gray-400 mb-3" />
          <h3 className="font-bold text-gray-900 mb-1">Custom Range</h3>
          <p className="text-sm text-gray-500">Select date range</p>
        </button>
      </div>
    </div>
  );
}