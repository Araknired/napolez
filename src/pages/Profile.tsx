import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Heart, Globe, MapPin, Moon, Trash2, LogOut, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!error && data) {
          setUserData(data);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const displayName = userData?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || user?.phone || 'User';
  const displayUsername = userData?.phone || user?.email?.split('@')[0] || 'username';

  const menuItems = [
    { icon: Heart, label: 'Favourites', path: '/profile/favorites', color: 'text-gray-700' },
    { icon: Globe, label: 'Language', path: '/profile/language', color: 'text-gray-700' },
    { icon: MapPin, label: 'Location', path: '/profile/location', color: 'text-gray-700' },
    { icon: Moon, label: 'Theme', path: '/profile/theme', color: 'text-gray-700' },
    { icon: Trash2, label: 'Clear history', path: '/profile/clear-data', color: 'text-gray-700' },
    { icon: LogOut, label: 'Log out', action: handleSignOut, color: 'text-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-24 md:h-28"></div>
      <div className="bg-white">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6 rotate-180" />
            </button>
            <h1 className="text-xl font-semibold">My Profile</h1>
            <div className="w-10"></div>
          </div>
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
                <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {displayName}
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              @{displayUsername}
            </p>
            <button
              onClick={() => navigate('/profile/edit')}
              className="px-8 py-2.5 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors shadow-sm"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-6 mt-4 pb-20">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => item.action ? item.action() : navigate(item.path)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className={`font-medium ${item.color}`}>{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}