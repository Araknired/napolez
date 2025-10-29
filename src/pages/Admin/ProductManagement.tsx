import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Star, DollarSign, X, Save, ImageIcon } from 'lucide-react';
import { products as initialProductsData } from '@/data/products';

// Types
type Category = 'Donuts' | 'Burger' | 'Ice' | 'Potato' | 'Pizza' | 'Fuchka' | 'Hot dog' | 'Chicken' | 'Tacos' | 'Drinks' | 'Coffee' | 'Pasta' | 'Snacks' | 'Energy Drinks' | 'Desserts' | 'Sushi';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  image: string;
  color: string;
  category: Category;
}

const categories: Category[] = [
  'Burger', 'Donuts', 'Ice', 'Potato', 'Pizza', 'Fuchka', 'Hot dog', 'Chicken', 
  'Tacos', 'Drinks', 'Coffee', 'Pasta', 'Snacks', 'Energy Drinks', 'Desserts', 'Sushi'
];

const colorOptions = [
  '#FFF4E6', '#FFE8E8', '#FFF9E6', '#F0FFE6', '#FFE6F0', '#E6F7FF',
  '#F0F4FF', '#FFF0F5', '#F5FFFA', '#FFFACD'
];

// Convertir productos iniciales a formato plano
const flattenInitialProducts = (): Product[] => {
  const flat: Product[] = [];
  Object.entries(initialProductsData).forEach(([category, items]) => {
    items.forEach(item => {
      flat.push({ ...item, category: category as Category });
    });
  });
  return flat;
};

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    originalPrice: 0,
    rating: 2.5,
    image: '',
    color: '#FFF4E6',
    category: 'Burger'
  });

  // Cargar productos al iniciar
  useEffect(() => {
    const savedProducts = localStorage.getItem('arena-products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      const initialProducts = flattenInitialProducts();
      setProducts(initialProducts);
      localStorage.setItem('arena-products', JSON.stringify(initialProducts));
    }
  }, []);

  // Guardar productos en localStorage
  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem('arena-products', JSON.stringify(updatedProducts));
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: 0,
        originalPrice: 0,
        rating: 2.5,
        image: '',
        color: '#FFF4E6',
        category: 'Burger'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.category) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    let updatedProducts: Product[];

    if (editingProduct) {
      // Actualizar producto existente
      updatedProducts = products.map(p => 
        p.id === editingProduct.id ? { ...formData, id: editingProduct.id } as Product : p
      );
    } else {
      // Crear nuevo producto
      const newProduct: Product = {
        ...formData,
        id: `${formData.category?.toLowerCase().substring(0, 2)}${Date.now()}`,
      } as Product;
      updatedProducts = [...products, newProduct];
    }

    saveProducts(updatedProducts);
    handleCloseModal();
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      saveProducts(updatedProducts);
    }
  };

  // Resetear a productos originales
  const handleReset = () => {
    if (window.confirm('¿Deseas restaurar todos los productos a los valores originales? Esto eliminará todos los cambios.')) {
      const initialProducts = flattenInitialProducts();
      saveProducts(initialProducts);
    }
  };

  const totalValue = filteredProducts.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
            <p className="text-gray-500 mt-1">Administra todos los productos de Arena</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Restaurar Original
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Agregar Producto
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm font-medium">Total Productos</span>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{products.length}</p>
            <p className="text-sm text-green-600 mt-2">Todas las categorías</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm font-medium">Filtrados</span>
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Search className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{filteredProducts.length}</p>
            <p className="text-sm text-gray-500 mt-2">Vista actual</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm font-medium">Valor Total</span>
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">${totalValue.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-2">Elementos filtrados</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar productos..."
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
              <option value="all">Todas las Categorías</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all group"
              >
                <div className="relative mb-4">
                  <div className="h-40 flex items-center justify-center rounded-xl overflow-hidden" style={{ backgroundColor: product.color }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-32 h-32 object-contain group-hover:scale-110 transition-transform"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-lg shadow-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-semibold">{product.rating}K+</span>
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-lg shadow-sm text-xs font-semibold">
                    {product.category}
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 mb-2 text-sm min-h-[40px]">{product.name}</h3>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-green-600 font-bold text-xl">${product.price}</span>
                  <span className="text-gray-400 text-sm line-through">${product.originalPrice.toFixed(2)}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="flex-1 p-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-xs">Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-xs">Eliminar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron productos</h3>
            <p className="text-gray-500">Intenta ajustar tu búsqueda o filtros</p>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre del Producto *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: Hamburguesa Especial"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rating (K+)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="2.5"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Precio *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="25.00"
                    />
                  </div>

                  {/* Original Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Precio Original
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="30.00"
                    />
                  </div>

                  {/* Image URL */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      URL de la Imagen
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="/images/arena/media/burger/burger-1.png"
                      />
                      <div className="w-16 h-12 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
                        {formData.image ? (
                          <img src={formData.image} alt="Preview" className="w-full h-full object-contain" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Color */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Color de Fondo
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {colorOptions.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData({ ...formData, color })}
                          className={`w-12 h-12 rounded-lg border-2 transition-all ${
                            formData.color === color ? 'border-blue-500 scale-110' : 'border-gray-200'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {editingProduct ? 'Actualizar' : 'Crear'} Producto
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}