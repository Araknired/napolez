import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Star, DollarSign } from 'lucide-react';
import { products } from '../../data/products';
import type { Category } from '../../types';

export default function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  const categories: (Category | 'all')[] = [
    'all',
    'Burger',
    'Donuts',
    'Ice',
    'Potato',
    'Pizza',
    'Fuchka',
    'Hot dog',
    'Chicken',
    'Tacos',
    'Drinks',
    'Coffee',
    'Pasta',
    'Snacks',
    'Energy Drinks',
    'Desserts',
    'Sushi'
  ];

  const getAllProducts = () => {
    if (selectedCategory === 'all') {
      return Object.values(products).flat();
    }
    return products[selectedCategory as Category] || [];
  };

  const filteredProducts = getAllProducts().filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProducts = Object.values(products).flat().length;
  const totalValue = filteredProducts.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-500 mt-1">Manage all products in Arena</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all">
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">Total Products</span>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
          <p className="text-sm text-green-600 mt-2">All categories</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">Filtered Products</span>
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{filteredProducts.length}</p>
          <p className="text-sm text-gray-500 mt-2">Current view</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">Total Value</span>
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">${totalValue.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-2">Filtered items</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as Category | 'all')}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all group"
          >
            <div className="relative mb-4">
              <div className="h-40 flex items-center justify-center rounded-xl overflow-hidden bg-gray-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-32 h-32 object-contain group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-lg shadow-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-semibold">{product.rating}K+</span>
                </div>
              </div>
            </div>

            <h3 className="font-bold text-gray-900 mb-2 text-sm">{product.name}</h3>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-600 font-bold text-xl">${product.price}</span>
              <span className="text-gray-400 text-sm line-through">${product.originalPrice.toFixed(2)}</span>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 p-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                <Edit className="w-4 h-4 mx-auto" />
              </button>
              <button className="flex-1 p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}