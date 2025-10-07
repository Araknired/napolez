import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, MapPin, Search } from 'lucide-react';

export default function Location() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('United States');

  const locations = [
    { country: 'United States', flag: '🇺🇸' },
    { country: 'United Kingdom', flag: '🇬🇧' },
    { country: 'Canada', flag: '🇨🇦' },
    { country: 'Australia', flag: '🇦🇺' },
    { country: 'Germany', flag: '🇩🇪' },
    { country: 'France', flag: '🇫🇷' },
    { country: 'Spain', flag: '🇪🇸' },
    { country: 'Italy', flag: '🇮🇹' },
    { country: 'Japan', flag: '🇯🇵' },
    { country: 'Brazil', flag: '🇧🇷' },
    { country: 'Mexico', flag: '🇲🇽' },
    { country: 'Colombia', flag: '🇨🇴' },
  ];

  const filteredLocations = locations.filter(location =>
    location.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h1 className="text-xl font-semibold">Location</h1>
            <div className="w-10"></div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 mt-4">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {filteredLocations.map((location, index) => (
            <button
              key={index}
              onClick={() => setSelectedLocation(location.country)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{location.flag}</span>
                <span className="font-medium text-gray-900">{location.country}</span>
              </div>
              {selectedLocation === location.country && (
                <MapPin className="w-5 h-5 text-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}