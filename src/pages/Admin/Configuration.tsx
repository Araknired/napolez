import { useState } from 'react';
import { Save, Bell, Shield, Mail, Globe, DollarSign, Truck, Check } from 'lucide-react';

export default function Configuration() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'NAPOLEZ',
    siteEmail: 'admin@napolez.com',
    currency: 'USD',
    taxRate: 6,
    shippingFee: 5,
    emailNotifications: true,
    smsNotifications: false,
    orderAlerts: true,
    maintenanceMode: false,
  });

  const handleSave = () => {
    // Aquí guardarías en Supabase
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateSetting = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuration</h1>
          <p className="text-gray-500 mt-1">Manage system settings</p>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl animate-in slide-in-from-top">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500" />
            <p className="text-green-700 font-semibold">Settings saved successfully!</p>
          </div>
        </div>
      )}

      {/* General Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">General Settings</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => updateSetting('siteName', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              value={settings.siteEmail}
              onChange={(e) => updateSetting('siteEmail', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => updateSetting('currency', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="COP">COP ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                value={settings.taxRate}
                onChange={(e) => updateSetting('taxRate', parseFloat(e.target.value))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payment & Shipping */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
            <Truck className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Payment & Shipping</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Shipping Fee ($)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={settings.shippingFee}
                onChange={(e) => updateSetting('shippingFee', parseFloat(e.target.value))}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-semibold text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive email alerts for new orders</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
              className="w-5 h-5 text-purple-500 rounded focus:ring-2 focus:ring-purple-400"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-semibold text-gray-900">SMS Notifications</p>
                <p className="text-sm text-gray-500">Get text messages for important updates</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={(e) => updateSetting('smsNotifications', e.target.checked)}
              className="w-5 h-5 text-purple-500 rounded focus:ring-2 focus:ring-purple-400"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-semibold text-gray-900">Order Alerts</p>
                <p className="text-sm text-gray-500">Real-time alerts when orders are placed</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.orderAlerts}
              onChange={(e) => updateSetting('orderAlerts', e.target.checked)}
              className="w-5 h-5 text-purple-500 rounded focus:ring-2 focus:ring-purple-400"
            />
          </label>
        </div>
      </div>

      {/* System */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">System</h2>
        </div>

        <label className="flex items-center justify-between p-4 bg-red-50 rounded-xl cursor-pointer hover:bg-red-100 transition-colors border-2 border-red-200">
          <div>
            <p className="font-semibold text-gray-900">Maintenance Mode</p>
            <p className="text-sm text-gray-600">Disable site access for maintenance</p>
          </div>
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) => updateSetting('maintenanceMode', e.target.checked)}
            className="w-5 h-5 text-red-500 rounded focus:ring-2 focus:ring-red-400"
          />
        </label>
      </div>
    </div>
  );
}