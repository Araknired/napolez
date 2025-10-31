import { useState, useEffect, useCallback, useMemo } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  Heart,
  Moon,
  Trash2,
  LogOut,
  Settings,
  Shield,
  UserCircle,
  Award,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';

interface UserData {
  user_id: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  [key: string]: unknown;
}

interface StatItem {
  readonly label: string;
  readonly value: string;
  readonly icon: LucideIcon;
}

interface SettingsItem {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly path: string;
  readonly description: string;
}

interface QuickAction {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly path: string;
  readonly gradient: string;
}

const ProfileHeader: FC<{
  displayName: string;
  displayUsername: string;
  displayEmail: string;
  avatarUrl?: string | null;
}> = ({ displayName, displayUsername, displayEmail, avatarUrl }) => {
  const { theme } = useTheme();
  const cardClasses = theme === 'dark' ? 'bg-slate-800 shadow-xl shadow-black/30' : 'bg-white shadow-sm';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const textTertiary = theme === 'dark' ? 'text-gray-500' : 'text-gray-400';
  const borderWhite = theme === 'dark' ? 'border-slate-800' : 'border-white';
  
  return (
    <div className={`${cardClasses} rounded-2xl p-8`}>
      <div className="flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl overflow-hidden">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>
          <div className={`absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-4 ${borderWhite}`}>
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h2 className={`text-2xl font-bold mb-1 text-center ${textPrimary}`}>
          {displayName}
        </h2>
        <p className={`text-sm mb-1 ${textSecondary}`}>@{displayUsername}</p>
        <p className={`text-xs mb-6 ${textTertiary}`}>{displayEmail}</p>
      </div>
    </div>
  );
};

const StatisticsCard: FC<{ stats: readonly StatItem[] }> = ({ stats }) => {
  const { theme } = useTheme();
  const cardClasses = theme === 'dark' ? 'bg-slate-800 shadow-xl shadow-black/30' : 'bg-white shadow-sm';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const itemClasses = theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100';

  return (
    <div className={`${cardClasses} rounded-2xl p-6`}>
      <h3 className={`text-lg font-bold mb-4 ${textPrimary}`}>Statistics</h3>
      <div className="space-y-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`flex items-center justify-between p-4 rounded-xl transition-colors ${itemClasses}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className={`font-medium ${textSecondary}`}>{stat.label}</span>
            </div>
            <span className={`text-2xl font-bold ${textPrimary}`}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const QuickActionsCard: FC<{
  actions: readonly QuickAction[];
  onNavigate: (path: string) => void;
}> = ({ actions, onNavigate }) => {
  const { theme } = useTheme();
  const cardClasses = theme === 'dark' ? 'bg-slate-800 shadow-xl shadow-black/30' : 'bg-white shadow-sm';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const buttonBaseClasses = theme === 'dark' ? 'bg-slate-700 hover:shadow-black/50' : 'bg-gray-50';
  const buttonTextClasses = theme === 'dark' ? 'text-gray-200 group-hover:text-white' : 'text-gray-900 group-hover:text-gray-700';
  
  return (
    <div className={`${cardClasses} rounded-2xl p-6`}>
      <h3 className={`text-xl font-bold mb-6 ${textPrimary}`}>Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => {
              if (action.path.startsWith('http://') || action.path.startsWith('https://')) {
                window.open(action.path, '_blank');
              } else {
                onNavigate(action.path);
              }
            }}
            className={`group relative overflow-hidden p-6 rounded-xl hover:shadow-lg transition-all duration-300 ${buttonBaseClasses}`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div
                className={`w-14 h-14 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                <action.icon className="w-7 h-7 text-white" />
              </div>
              <span className={`font-semibold transition-colors ${buttonTextClasses}`}>
                {action.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const SettingsCard: FC<{
  items: readonly SettingsItem[];
  onNavigate: (path: string) => void;
}> = ({ items, onNavigate }) => {
  const { theme } = useTheme();
  const cardClasses = theme === 'dark' ? 'bg-slate-800 shadow-xl shadow-black/30' : 'bg-white shadow-sm';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const itemBaseClasses = theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100';
  const itemIconClasses = theme === 'dark' 
    ? 'from-gray-600 to-gray-800 group-hover:from-blue-500 group-hover:to-purple-500' 
    : 'from-gray-600 to-gray-800 group-hover:from-blue-600 group-hover:to-purple-600';
  const itemArrowClasses = theme === 'dark' ? 'text-gray-500 group-hover:text-blue-500' : 'text-gray-400 group-hover:text-blue-600';

  return (
    <div className={`${cardClasses} rounded-2xl p-6`}>
      <h3 className={`text-xl font-bold mb-6 ${textPrimary}`}>Settings</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.path)}
            className={`w-full flex items-center gap-4 p-5 rounded-xl transition-all duration-200 group ${itemBaseClasses}`}
          >
            <div className={`w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center transition-all duration-300 ${itemIconClasses}`}>
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className={`font-semibold transition-colors ${theme === 'dark' ? 'text-white group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'}`}>
                {item.label}
              </div>
              <div className={`text-sm ${textSecondary}`}>{item.description}</div>
            </div>
            <svg
              className={`w-5 h-5 transition-colors ${itemArrowClasses}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
};

const AccountActionsCard: FC<{ onSignOut: () => Promise<void> }> = ({
  onSignOut,
}) => {
  const { theme } = useTheme();
  const cardClasses = theme === 'dark' ? 'bg-slate-800 shadow-xl shadow-black/30' : 'bg-white shadow-sm';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const buttonClasses = theme === 'dark' 
    ? 'bg-red-700/30 hover:bg-red-700/50 text-red-400' 
    : 'bg-red-50 hover:bg-red-100 text-red-600';

  return (
    <div className={`${cardClasses} rounded-2xl p-6`}>
      <h3 className={`text-xl font-bold mb-6 ${textPrimary}`}>Account Actions</h3>
      <button
        onClick={onSignOut}
        className={`w-full flex items-center justify-center gap-3 p-4 rounded-xl font-semibold transition-all duration-200 group ${buttonClasses}`}
      >
        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span>Log Out</span>
      </button>
    </div>
  );
};

const Profile: FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [userData, setUserData] = useState<UserData | null>(null);

  const fetchUserData = useCallback(async (): Promise<void> => {
    if (!user) return;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!error && data) {
      setUserData(data as UserData);
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleSignOut = useCallback(async (): Promise<void> => {
    await signOut();
    navigate('/');
  }, [signOut, navigate]);

  const displayName = useMemo(
    () =>
      userData?.full_name ||
      user?.user_metadata?.full_name ||
      user?.email?.split('@')[0] ||
      user?.phone ||
      'User',
    [userData, user]
  );

  const displayEmail = useMemo(
    () => user?.email || 'No email',
    [user]
  );

  const displayUsername = useMemo(
    () =>
      userData?.phone || user?.email?.split('@')[0] || 'username',
    [userData, user]
  );

  const avatarUrl = useMemo(
    () => userData?.avatar_url || null,
    [userData]
  );

  const stats: readonly StatItem[] = useMemo(
    () => [
      { label: 'Favorites', value: '24', icon: Heart },
      { label: 'Reviews', value: '12', icon: Award },
      { label: 'Activity', value: '156', icon: TrendingUp },
    ],
    []
  );

  const settingsItems: readonly SettingsItem[] = useMemo(
    () => [
      {
        icon: Settings,
        label: 'Account Settings',
        path: '/profile/edit',
        description: 'Manage your account preferences',
      },
      {
        icon: Shield,
        label: 'Privacy & Security',
        path: '/profile/privacy',
        description: 'Control your privacy settings',
      },
      {
        icon: UserCircle,
        label: 'About Me',
        path: '/about',
        description: 'Learn more about this project',
      },
    ],
    []
  );

  const quickActions: readonly QuickAction[] = useMemo(
    () => [
      {
        icon: Heart,
        label: 'Favorites',
        path: '/profile/favorites',
        gradient: 'from-pink-500 to-rose-500',
      },
      {
        icon: Moon,
        label: 'Theme',
        path: '/profile/theme',
        gradient: 'from-indigo-500 to-purple-500',
      },
      {
        icon: Trash2,
        label: 'Clear History',
        path: '/profile/clear-data',
        gradient: 'from-orange-500 to-red-500',
      },
      {
        icon: ShieldCheck,
        label: 'Admin',
        path: 'https://napolez.vercel.app/admin',
        gradient: 'from-emerald-500 to-teal-500',
      },
    ],
    []
  );

  const containerClasses = theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50';

  return (
    <div className={`min-h-screen ${containerClasses} pt-4 lg:pt-24 pb-24 lg:pb-0`}>
      <div className="h-auto lg:h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <aside className="lg:col-span-4 space-y-6">
              <ProfileHeader
                displayName={displayName}
                displayUsername={displayUsername}
                displayEmail={displayEmail}
                avatarUrl={avatarUrl}
              />
              <StatisticsCard stats={stats} />
            </aside>

            <main className="lg:col-span-8 space-y-6">
              <QuickActionsCard actions={quickActions} onNavigate={navigate} />
              <SettingsCard items={settingsItems} onNavigate={navigate} />
              <AccountActionsCard onSignOut={handleSignOut} />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;