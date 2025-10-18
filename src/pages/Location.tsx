import { useState, useCallback, useMemo } from 'react';
import type { FC, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, MapPin, Search } from 'lucide-react';

interface Location {
  country: string;
  flag: string;
  code: string;
}

const SUPPORTED_LOCATIONS: readonly Location[] = [
  { country: 'United States', flag: '🇺🇸', code: 'US' },
  { country: 'United Kingdom', flag: '🇬🇧', code: 'GB' },
  { country: 'Canada', flag: '🇨🇦', code: 'CA' },
  { country: 'Australia', flag: '🇦🇺', code: 'AU' },
  { country: 'Germany', flag: '🇩🇪', code: 'DE' },
  { country: 'France', flag: '🇫🇷', code: 'FR' },
  { country: 'Spain', flag: '🇪🇸', code: 'ES' },
  { country: 'Italy', flag: '🇮🇹', code: 'IT' },
  { country: 'Japan', flag: '🇯🇵', code: 'JP' },
  { country: 'Brazil', flag: '🇧🇷', code: 'BR' },
  { country: 'Mexico', flag: '🇲🇽', code: 'MX' },
  { country: 'Colombia', flag: '🇨🇴', code: 'CO' },
] as const;

const DEFAULT_LOCATION = 'United States';

/**
 * Filters locations based on search query
 */
const filterLocations = (
  locations: readonly Location[],
  query: string
): Location[] => {
  if (!query.trim()) return [...locations];

  const normalizedQuery = query.toLowerCase();
  return locations.filter((location) =>
    location.country.toLowerCase().includes(normalizedQuery)
  );
};

/**
 * Header component with back navigation, title, and search bar
 */
interface LocationHeaderProps {
  onBack: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const LocationHeader: FC<LocationHeaderProps> = ({
  onBack,
  searchQuery,
  onSearchChange,
}) => {
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value);
    },
    [onSearchChange]
  );

  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <h1 className="text-xl font-semibold">Location</h1>
          <div className="w-10" aria-hidden="true" />
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search country..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Search countries"
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Individual location option button with flag and selection indicator
 */
interface LocationOptionProps {
  location: Location;
  isSelected: boolean;
  onSelect: (country: string) => void;
}

const LocationOption: FC<LocationOptionProps> = ({
  location,
  isSelected,
  onSelect,
}) => {
  const handleClick = useCallback(() => {
    onSelect(location.country);
  }, [location.country, onSelect]);

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
      aria-pressed={isSelected}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl" role="img" aria-label={`${location.country} flag`}>
          {location.flag}
        </span>
        <span className="font-medium text-gray-900">{location.country}</span>
      </div>
      {isSelected && (
        <MapPin className="w-5 h-5 text-blue-500" aria-label="Selected location" />
      )}
    </button>
  );
};

/**
 * Location list container component
 */
interface LocationListProps {
  locations: Location[];
  selectedLocation: string;
  onLocationSelect: (country: string) => void;
}

const LocationList: FC<LocationListProps> = ({
  locations,
  selectedLocation,
  onLocationSelect,
}) => {
  if (locations.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 mt-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <p className="text-gray-500">No countries found matching your search.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 mt-4">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {locations.map((location) => (
          <LocationOption
            key={location.code}
            location={location}
            isSelected={selectedLocation === location.country}
            onSelect={onLocationSelect}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Location selection page component
 * Allows users to search and select their country/region
 */
const Location: FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>(DEFAULT_LOCATION);

  const handleBack = useCallback((): void => {
    navigate('/profile');
  }, [navigate]);

  const handleSearchChange = useCallback((query: string): void => {
    setSearchQuery(query);
  }, []);

  const handleLocationSelect = useCallback((country: string): void => {
    setSelectedLocation(country);
    // TODO: Persist location selection to user preferences/context
  }, []);

  const filteredLocations = useMemo(
    () => filterLocations(SUPPORTED_LOCATIONS, searchQuery),
    [searchQuery]
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <LocationHeader
        onBack={handleBack}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      <LocationList
        locations={filteredLocations}
        selectedLocation={selectedLocation}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
};

export default Location;