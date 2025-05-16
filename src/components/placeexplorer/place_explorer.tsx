'use client';
import React, { useState } from 'react';
import MapComponent from './map';
import LocationSummary from './location_summary';

interface PlaceExplorerProps {
  markers: any[];
  fetchMarkers: () => Promise<void>;
}

const PlaceExplorer: React.FC<PlaceExplorerProps> = ({ markers, fetchMarkers }) => {
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);

  return (
    <div className="flex flex-col h-[95vh] gap-4">
      <div className="flex-1 min-h-0 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center  w-full overflow-y-auto">
        {selectedPlace ? (
          <LocationSummary
            name={selectedPlace.name}
            address={selectedPlace.address}
            rating={selectedPlace.rating}
            reviews={selectedPlace.reviews}
            businessStatus={selectedPlace.businessStatus}
            description={selectedPlace.description}
            photoName={selectedPlace.photoName}
          />
        ) : (
          <div className="text-gray-400">Select a marker to see details</div>
        )}
      </div>
      <div className="flex-1 min-h-0 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center p-4">
        <MapComponent
          markers={markers}
          fetchMarkers={fetchMarkers}
          onSelectPlace={place => setSelectedPlace({
            ...place,
            reviews: Array.isArray(place.reviews) ? place.reviews : []
          })}
        />
      </div>
    </div>
  );
};

export default PlaceExplorer;
