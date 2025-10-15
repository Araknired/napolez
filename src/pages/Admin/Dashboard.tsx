import { useState, useEffect } from 'react';
import { Users, ShoppingBag, DollarSign, TrendingUp, Activity, Package } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface StatCard {
  title: string;
  value: string | number;
  change: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Obtener total de usuarios
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Obtener usuarios recientes
      const { data: recentUsersData } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Obtener total de carritos (como proxy de órdenes por ahora)
      const { count: cartsCount } = await supabase
        .from('carts')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: usersCount || 0,
        totalOrders: cartsCount || 0,
        totalRevenue: 15847.50, // Valor de ejemplo
        activeProducts: 192, // Total de productos del data/products.ts
      });

      setRecentUsers(recentUsersData || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards: StatCard[] = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      change: '+12.5%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      change: '+8.2%',
      icon: ShoppingBag,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: '+23.1%',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Products',
      value: stats.activeProducts,
      change: '+5.4%',
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's your overview</p>
        </div>
        <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg">
          <Activity className="w-5 h-5" />
          <span className="font-semibold">Live</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                <span>{stat.change}</span>
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
            <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm">
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {recentUsers.length > 0 ? (
              recentUsers.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{user.full_name || 'Unknown User'}</p>
                    <p className="text-sm text-gray-500">{user.phone || 'No phone'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role || 'user'}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No users yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all group">
              <Users className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-gray-900 text-sm">Manage Users</p>
            </button>
            <button className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-md transition-all group">
              <Package className="w-8 h-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-gray-900 text-sm">Products</p>
            </button>
            <button className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-all group">
              <ShoppingBag className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-gray-900 text-sm">Orders</p>
            </button>
            <button className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:shadow-md transition-all group">
              <TrendingUp className="w-8 h-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-gray-900 text-sm">Reports</p>
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">System Status</h3>
            <p className="text-blue-100">All systems operational</p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-semibold">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}