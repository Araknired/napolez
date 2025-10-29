import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Star, DollarSign, X, Save, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Category } from '../../types';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number;
  rating: number;
  image: string;
  category: Category;
  color: string;
  created_at?: string;
  updated_at?: string;
}

export default function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    original_price: '',
    rating: '2.5',
    image: '',
    category: 'Burger' as Category,
    color: '#FFF4E6'
  });

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

  const colors = [
    '#FFF4E6', '#FFE8E8', '#FFF9E6', '#F0FFE6', 
    '#FFE6F0', '#E6F7FF', '#F5F5F5', '#FFF0F5'
  ];

  // Cargar productos desde Supabase
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      showMessage('error', 'Error loading products');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Abrir modal para crear nuevo producto
  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      original_price: '',
      rating: '2.5',
      image: '',
      category: 'Burger',
      color: '#FFF4E6'
    });
    setIsModalOpen(true);
  };

  // Abrir modal para editar producto
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      original_price: product.original_price.toString(),
      rating: product.rating.toString(),
      image: product.image,
      category: product.category,
      color: product.color
    });
    setIsModalOpen(true);
  };

  // Guardar producto (crear o actualizar)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.name.trim()) {
      showMessage('error', 'Product name is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      showMessage('error', 'Valid price is required');
      return;
    }
    if (!formData.image.trim()) {
      showMessage('error', 'Image URL is required');
      return;
    }

    setSaving(true);

    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        original_price: parseFloat(formData.original_price),
        rating: parseFloat(formData.rating),
        image: formData.image,
        category: formData.category,
        color: formData.color,
        updated_at: new Date().toISOString()
      };

      if (editingProduct) {
        // Actualizar producto existente
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        showMessage('success', 'Product updated successfully!');
      } else {
        // Crear nuevo producto
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        showMessage('success', 'Product created successfully!');
      }

      setIsModalOpen(false);
      loadProducts();
    } catch (error: any) {
      console.error('Error saving product:', error);
      showMessage('error', error.message || 'Error saving product');
    } finally {
      setSaving(false);
    }
  };

  // Eliminar producto
  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;
      
      showMessage('success', 'Product deleted successfully!');
      loadProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      showMessage('error', error.message || 'Error deleting product');
    }
  };

  // Mostrar mensaje temporal
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const totalProducts = products.length;
  const totalValue = filteredProducts.reduce((sum, p) => sum + p.price, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-500 mt-1">Manage all products in your store</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`p-4 rounded-xl border-l-4 ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-500' 
            : 'bg-red-50 border-red-500'
        } animate-in slide-in-from-top`}>
          <div className="flex items-center gap-3">
            <AlertCircle className={`w-5 h-5 ${
              message.type === 'success' ? 'text-green-500' : 'text-red-500'
            }`} />
            <p className={`font-semibold ${
              message.type === 'success' ? 'text-green-700' : 'text-red-700'
            }`}>{message.text}</p>
          </div>
        </div>
      )}

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
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image';
                  }}
                />
              </div>
              <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-lg shadow-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-semibold">{product.rating}</span>
                </div>
              </div>
              <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                {product.category}
              </div>
            </div>

            <h3 className="font-bold text-gray-900 mb-2 text-sm truncate" title={product.name}>
              {product.name}
            </h3>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-600 font-bold text-xl">${product.price}</span>
              <span className="text-gray-400 text-sm line-through">${product.original_price.toFixed(2)}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEditProduct(product)}
                className="flex-1 p-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Edit className="w-4 h-4 mx-auto" />
              </button>
              <button
                onClick={() => handleDeleteProduct(product)}
                className="flex-1 p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Original Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    {categories.filter(cat => cat !== 'all').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com/image.png"
                  required
                />
                {formData.image && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-24 h-24 object-contain mx-auto"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/150?text=Invalid+URL';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        formData.color === color ? 'border-purple-500 scale-110' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}