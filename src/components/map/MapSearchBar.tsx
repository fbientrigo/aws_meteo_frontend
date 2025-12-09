import { useState, useEffect } from 'react';
import { Search, MapPin, Star, X, History } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useGeocoding } from '@/hooks/useGeocoding';

interface MapSearchBarProps {
  onLocationSelect: (lat: number, lng: number, zoom?: number) => void;
}

const MapSearchBar = ({ onLocationSelect }: MapSearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { results, isLoading, search, clearResults } = useGeocoding();
  const [searchHistory, setSearchHistory] = useState<Array<{ query: string; lat: number; lng: number }>>([]);
  const [favorites, setFavorites] = useState<Array<{ name: string; lat: number; lng: number }>>([]);

  useEffect(() => {
    // Load from localStorage
    const history = localStorage.getItem('searchHistory');
    const favs = localStorage.getItem('searchFavorites');
    if (history) setSearchHistory(JSON.parse(history));
    if (favs) setFavorites(JSON.parse(favs));
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.trim()) {
      await search(searchQuery);
      setIsOpen(true);
    }
  };

  const handleSelectLocation = (lat: number, lng: number, displayName: string) => {
    onLocationSelect(lat, lng, 13);
    setQuery(displayName);
    setIsOpen(false);
    
    // Add to history
    const newHistory = [{ query: displayName, lat, lng }, ...searchHistory.slice(0, 9)];
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    
    toast.success('Location found', {
      description: displayName
    });
  };

  const toggleFavorite = (name: string, lat: number, lng: number) => {
    const exists = favorites.find(f => f.lat === lat && f.lng === lng);
    let newFavorites;
    
    if (exists) {
      newFavorites = favorites.filter(f => !(f.lat === lat && f.lng === lng));
      toast.info('Removed from favorites');
    } else {
      newFavorites = [...favorites, { name, lat, lng }];
      toast.success('Added to favorites');
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('searchFavorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (lat: number, lng: number) => {
    return favorites.some(f => f.lat === lat && f.lng === lng);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(query);
              }
            }}
            onFocus={() => setIsOpen(true)}
            className="pl-10 pr-10 bg-card/95 backdrop-blur-md border-border shadow-lg"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => {
                setQuery('');
                clearResults();
                setIsOpen(false);
              }}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleSearch(query)}
          disabled={isLoading}
          className="bg-card/95 backdrop-blur-md"
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-xl max-h-96 overflow-y-auto z-50"
          >
            {/* Search Results */}
            {results.length > 0 && (
              <div className="p-2">
                <p className="text-xs text-muted-foreground px-2 py-1 font-medium">Results</p>
                {results.map((result, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 hover:bg-accent/50 rounded-lg cursor-pointer group"
                    onClick={() => handleSelectLocation(result.lat, result.lng, result.display_name)}
                  >
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm flex-1 line-clamp-2">{result.display_name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(result.display_name, result.lat, result.lng);
                      }}
                    >
                      <Star className={`w-3 h-3 ${isFavorite(result.lat, result.lng) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Favorites */}
            {favorites.length > 0 && !query && (
              <div className="p-2 border-t border-border">
                <p className="text-xs text-muted-foreground px-2 py-1 font-medium">Favorites</p>
                {favorites.map((fav, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 hover:bg-accent/50 rounded-lg cursor-pointer group"
                    onClick={() => handleSelectLocation(fav.lat, fav.lng, fav.name)}
                  >
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                    <span className="text-sm flex-1 line-clamp-1">{fav.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(fav.name, fav.lat, fav.lng);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Search History */}
            {searchHistory.length > 0 && !query && (
              <div className="p-2 border-t border-border">
                <p className="text-xs text-muted-foreground px-2 py-1 font-medium">Recent searches</p>
                {searchHistory.slice(0, 5).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 hover:bg-accent/50 rounded-lg cursor-pointer"
                    onClick={() => handleSelectLocation(item.lat, item.lng, item.query)}
                  >
                    <History className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm flex-1 line-clamp-1">{item.query}</span>
                  </div>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            )}

            {!isLoading && query && results.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No results found
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapSearchBar;