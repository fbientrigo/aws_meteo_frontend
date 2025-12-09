import { useState } from 'react';

interface GeocodingResult {
  display_name: string;
  lat: number;
  lng: number;
  boundingbox?: number[];
}

export const useGeocoding = () => {
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=cl&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'es'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }

      const data = await response.json();
      
      const formattedResults: GeocodingResult[] = data.map((item: any) => ({
        display_name: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        boundingbox: item.boundingbox
      }));

      setResults(formattedResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return {
    results,
    isLoading,
    error,
    search,
    clearResults
  };
};