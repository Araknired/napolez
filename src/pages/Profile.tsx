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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

/**
 * User data structure from Supabase
 */
interface UserData {
  user_id: string;
  full_name?: string;
  phone?: string;
  [key: string]: unknown;
}

/**
 * Statistic item configuration
 */
interface StatItem {
  readonly label: string;
  readonly value: string;
  readonly icon: LucideIcon;
}

/**
 * Settings menu item configuration
 */
interface SettingsItem {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly path: string;
  readonly description: string;
}

/**
 * Quick action item configuration
 */
interface QuickAction {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly path: string;
  readonly gradient: string;
}

/**
 * Profile header component displaying user avatar and basic info
 */
const ProfileHeader: FC<{
  displayName: string;
  displayUsername: string;
  displayEmail: string;
}> = ({ displayName, displayUsername, displayEmail }) => (
  <div className="bg-white rounded-2xl shadow-sm p-8">
    <div className="flex flex-col items-center">
      <div className="relative mb-6">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
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

      <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">
        {displayName}
      </h2>
      <p className="text-gray-500 text-sm mb-1">@{displayUsername}</p>
      <p className="text-gray-400 text-xs mb-6">{displayEmail}</p>
    </div>
  </div>
);

/**
 * Statistics card component
 */
const StatisticsCard: FC<{ stats: readonly StatItem[] }> = ({ stats }) => (
  <div className="bg-white rounded-2xl shadow-sm p-6">
    <h3 className="text-lg font-bold text-gray-900 mb-4">Statistics</h3>
    <div className="space-y-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
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
);

/**
 * Quick actions grid component
 */
const QuickActionsCard: FC<{
  actions: readonly QuickAction[];
  onNavigate: (path: string) => void;
}> = ({ actions, onNavigate }) => (
  <div className="bg-white rounded-2xl shadow-sm p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => onNavigate(action.path)}
          className="group relative overflow-hidden p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-all duration-300"
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
            <span className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
              {action.label}
            </span>
          </div>
        </button>
      ))}
    </div>
  </div>
);

/**
 * Settings menu component
 */
const SettingsCard: FC<{
  items: readonly SettingsItem[];
  onNavigate: (path: string) => void;
}> = ({ items, onNavigate }) => (
  <div className="bg-white rounded-2xl shadow-sm p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-6">Settings</h3>
    <div className="space-y-3">
      {items.map((item) => (
        <button
          key={item.label}
          onClick={() => onNavigate(item.path)}
          className="w-full flex items-center gap-4 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
            <item.icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {item.label}
            </div>
            <div className="text-sm text-gray-500">{item.description}</div>
          </div>
          <svg
            className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors"
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

/**
 * Account actions component with sign out button
 */
const AccountActionsCard: FC<{ onSignOut: () => Promise<void> }> = ({
  onSignOut,
}) => (
  <div className="bg-white rounded-2xl shadow-sm p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-6">Account Actions</h3>
    <button
      onClick={onSignOut}
      className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-semibold transition-all duration-200 group"
    >
      <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span>Log Out</span>
    </button>
  </div>
);

/**
 * Main profile page component
 */
const Profile: FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);

  // Fetch user data from Supabase
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

  // Handle user sign out
  const handleSignOut = useCallback(async (): Promise<void> => {
    await signOut();
    navigate('/');
  }, [signOut, navigate]);

  // Compute display values
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

  // Static configuration data
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
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-4 lg:pt-24 pb-24 lg:pb-0">
      <div className="h-auto lg:h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              <ProfileHeader
                displayName={displayName}
                displayUsername={displayUsername}
                displayEmail={displayEmail}
              />
              <StatisticsCard stats={stats} />
            </aside>

            {/* Main Content */}
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