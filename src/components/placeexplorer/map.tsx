'use client';

import React, { useEffect, useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!; // Store your API key in .env.local

interface MapComponentProps {
  onSelectPlace: (place: any) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onSelectPlace }) => {
  const [markers, setMarkers] = useState<any[]>([]);

  // Function to fetch markers
  const fetchMarkers = async () => {
    try {
      const res = await fetch('/api/maps/markers');
      const data = await res.json();
      if (data.markers) {
        setMarkers(data.markers);
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  // Refresh markers on 'r' key press
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        try {
          await fetch('/api/force-refresh-markers', { method: 'POST' });
          // Wait a moment for backend to update, then refetch markers
          setTimeout(fetchMarkers, 500);
        } catch (err) {
          // Optionally handle error
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchMarkers();
    const interval = setInterval(fetchMarkers, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Debug: log marker data
  useEffect(() => {
    if (markers.length > 0) {
      console.log('MapComponent markers:', markers);
    }
  }, [markers]);

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <Map
        defaultZoom={12}
        defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
        mapId="e6e131ac87e4a111c61bea89"
        style={{ width: "100%", height: "100%" }}
      >
        {markers
          .filter(poi => {
            const valid =
              typeof poi.lat === 'number' &&
              typeof poi.lng === 'number' &&
              !isNaN(poi.lat) &&
              !isNaN(poi.lng);
            if (!valid) {
              console.warn('Invalid marker:', poi);
            }
            return valid;
          })
          .map((poi, idx) => (
            <AdvancedMarker
              key={poi.id ?? poi.name ?? idx}
              position={{ lat: poi.lat, lng: poi.lng }}
              onClick={() => onSelectPlace(poi)}
            >
              <Pin background="#DD4B3E" glyphColor="#90261D" borderColor="#B74237" />
            </AdvancedMarker>
          ))}
      </Map>
    </APIProvider>
  );
};

export default MapComponent;
