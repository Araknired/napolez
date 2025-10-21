import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Heart, Trash2, ShoppingCart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface FavoriteItem {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string;
  product_category: string;
  product_rating: number;
  created_at: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Favorites() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();

  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isDarkMode = theme === 'dark';

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchFavorites();
  }, [user, navigate]);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  /**
   * Fetches all favorite items for the current user
   */
  const fetchFavorites = async (): Promise<void> => {
    if (!user) return;

    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      showNotification('error', 'Failed to load favorites');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Removes an item from favorites
   */
  const handleRemoveFavorite = async (favoriteId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      setFavorites((prev) => prev.filter((item) => item.id !== favoriteId));
      showNotification('success', 'Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      showNotification('error', 'Failed to remove favorite');
    }
  };

  /**
   * Shows a temporary notification
   */
  const showNotification = (type: 'success' | 'error', text: string): void => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3000);
  };

  // ============================================================================
  // THEME STYLES
  // ============================================================================

  const themeStyles = {
    container: isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900',
    header: isDarkMode ? 'border-slate-700' : 'border-gray-200',
    breadcrumb: isDarkMode ? 'text-gray-500' : 'text-gray-400',
    card: isDarkMode ? 'bg-slate-800 shadow-xl shadow-black/30' : 'bg-white shadow-lg',
    emptyText: isDarkMode ? 'text-gray-400' : 'text-gray-500',
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isLoading) {
    return (
      <div className={`min-h-screen ${themeStyles.container} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeStyles.container}`}>
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div
            className={`px-6 py-3 rounded-lg shadow-lg ${
              notification.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {notification.text}
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`border-b ${themeStyles.header}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm mb-2">
                <button
                  onClick={() => navigate('/profile')}
                  className={themeStyles.breadcrumb}
                >
                  Profile
                </button>
                <ChevronRight size={16} className={themeStyles.breadcrumb} />
                <span className="text-green-500">Favorites</span>
              </div>
              <h1 className="text-3xl font-bold">My Favorites</h1>
            </div>

            <Heart size={32} className="text-red-500" fill="currentColor" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favorites.length === 0 ? (
          <div className={`text-center py-16 ${themeStyles.emptyText}`}>
            <Heart size={64} className="mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
            <p className="mb-6">Start adding your favorite items from the Arena!</p>
            <button
              onClick={() => navigate('/arena')}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((item) => (
              <div
                key={item.id}
                className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 ${themeStyles.card}`}
              >
                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFavorite(item.id)}
                  className="absolute top-3 right-3 z-10 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-md"
                >
                  <Trash2 size={18} />
                </button>

                {/* Product Image */}
                <div className={`relative h-48 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} overflow-hidden`}>
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Information */}
                <div className="p-4">
                  <h3 className={`font-semibold text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                    {item.product_name}
                  </h3>

                  <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.product_category}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      ${item.product_price.toFixed(2)}
                    </span>

                    <button
                      onClick={() => navigate('/arena')}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                      title="View in Arena"
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
