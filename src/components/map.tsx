'use client';

import React, { useEffect, useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!; // Store your API key in .env.local

const MapComponent = () => {
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchMarkers = async () => {
      try {
        const res = await fetch('/api/maps/markers');
        const data = await res.json();
        if (isMounted && data.markers) {
          setMarkers(data.markers);
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchMarkers();
    const interval = setInterval(fetchMarkers, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <Map
        defaultZoom={13}
        defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
        mapId="e6e131ac87e4a111c61bea89"
        style={{ width: "100%", height: "100%" }}
      >
        {markers.map((poi, idx) => (
          <AdvancedMarker key={poi.name + idx} position={{ lat: poi.lat, lng: poi.lng }}>
            <Pin background="#FBBC04" glyphColor="#000" borderColor="#000" />
          </AdvancedMarker>
        ))}
      </Map>
    </APIProvider>
  );
};

export default MapComponent;
