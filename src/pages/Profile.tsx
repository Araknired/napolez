import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Heart, Moon, Trash2, LogOut, Settings, Shield, Bell, Award, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    fetchUserData();
  }, [user]);

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

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const displayName = userData?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || user?.phone || 'User';
  const displayEmail = user?.email || 'No email';
  const displayUsername = userData?.phone || user?.email?.split('@')[0] || 'username';

  const stats = [
    { label: 'Favorites', value: '24', icon: Heart },
    { label: 'Reviews', value: '12', icon: Award },
    { label: 'Activity', value: '156', icon: TrendingUp },
  ];

  const settingsItems = [
    { icon: Settings, label: 'Account Settings', path: '/profile/edit', description: 'Manage your account preferences' },
    { icon: Shield, label: 'Privacy & Security', path: '/profile/privacy', description: 'Control your privacy settings' },
    { icon: Bell, label: 'Notifications', path: '/profile/notifications', description: 'Manage notification preferences' },
  ];

  const quickActions = [
    { icon: Heart, label: 'Favorites', path: '/profile/favorites', gradient: 'from-pink-500 to-rose-500' },
    { icon: Moon, label: 'Theme', path: '/profile/theme', gradient: 'from-indigo-500 to-purple-500' },
    { icon: Trash2, label: 'Clear History', path: '/profile/clear-data', gradient: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-4 lg:pt-24">
      <div className="h-[calc(100vh-1rem)] lg:h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">
                    {displayName}
                  </h2>
                  <p className="text-gray-500 text-sm mb-1">
                    @{displayUsername}
                  </p>
                  <p className="text-gray-400 text-xs mb-6">
                    {displayEmail}
                  </p>
                  
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Statistics</h3>
                <div className="space-y-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium text-gray-700">{stat.label}</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => navigate(action.path)}
                      className="group relative overflow-hidden p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                      <div className="relative z-10 flex flex-col items-center gap-3">
                        <div className={`w-14 h-14 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <action.icon className="w-7 h-7 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                          {action.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Settings</h3>
                <div className="space-y-3">
                  {settingsItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => navigate(item.path)}
                      className="w-full flex items-center gap-4 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {item.label}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.description}
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Account Actions</h3>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-semibold transition-all duration-200 group"
                >
                  <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}