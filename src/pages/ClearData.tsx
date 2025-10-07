import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Trash2, AlertCircle } from 'lucide-react';

export default function ClearData() {
  const navigate = useNavigate();
  const [showConfirmCache, setShowConfirmCache] = useState(false);
  const [showConfirmHistory, setShowConfirmHistory] = useState(false);

  const handleClearCache = () => {
    setShowConfirmCache(false);
  };

  const handleClearHistory = () => {
    setShowConfirmHistory(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6 rotate-180" />
            </button>
            <h1 className="text-xl font-semibold">Clear Data</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 mt-4">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          <button
            onClick={() => setShowConfirmCache(true)}
            className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium text-gray-900">Clear Cache</span>
                <span className="text-sm text-gray-500">Free up storage space</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={() => setShowConfirmHistory(true)}
            className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium text-gray-900">Clear History</span>
                <span className="text-sm text-gray-500">Remove browsing history</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-1">
                About Data Management
              </h3>
              <p className="text-sm text-blue-700">
                Clearing cache improves performance. Clearing history removes your browsing data permanently.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showConfirmCache && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-6 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Clear Cache?</h2>
            <p className="text-gray-600 mb-6">
              This will remove temporary files to free up storage space. Your data will remain safe.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmCache(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearCache}
                className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-6 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Clear History?</h2>
            <p className="text-gray-600 mb-6">
              This will permanently delete your browsing history. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmHistory(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}