import { useNavigate } from 'react-router-dom';
import { ChevronRight, Heart } from 'lucide-react';

export default function Favorites() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-28 pb-20">
      <div className="bg-white">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6 rotate-180" />
            </button>
            <h1 className="text-xl font-semibold">Favourites</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 mt-8">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Favourites Yet</h2>
          <p className="text-gray-500 text-center max-w-sm">
            Start adding your favorite cans to see them here
          </p>
        </div>
      </div>
    </div>
  );
}