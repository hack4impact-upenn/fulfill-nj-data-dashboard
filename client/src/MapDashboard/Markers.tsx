/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Marker } from 'react-mapbox-gl';

// Define Marker Interface
interface MarkerData {
  lat: number | null;
  lng: number | null;
  name: string;
  category: string;
}

// Props Interface
interface MarkersProps {
  apiKey: string; // Mapbox API Key
  getLocations: () => Promise<any>; // Function to fetch location data
}

const categoryColors: { [key: string]: string } = {
  Garden: 'green',
  SFSP: 'red',
  'Assistant Sites': 'blue',
  CACFP: 'purple',
};

const Markers: React.FC<MarkersProps> = ({ apiKey, getLocations }) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [visibleCategories, setVisibleCategories] = useState<string[]>(Object.keys(categoryColors));
  const [hoveredMarkerIndex, setHoveredMarkerIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchMarkerData = async () => {
      try {
        const response = await getLocations(); // Fetch location data from the API
        if (response && response.data) {
          const sanitizedMarkers = await Promise.all(
            response.data.map(async (item: any) => {
              try {
                // Geocode Address
                const geocoded = await fetch(
                  `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                    item.Address
                  )}.json?access_token=${apiKey}`
                );
                const data = await geocoded.json();
                const [lng, lat] = data.features[0]?.geometry.coordinates || [null, null];

                return {
                  lat,
                  lng,
                  name: item.Name,
                  category: item.Category,
                };
              } catch (error) {
                console.error('Geocoding failed for:', item.Address, error);
                return {
                  lat: null,
                  lng: null,
                  name: item.Name,
                  category: item.Category,
                };
              }
            })
          );

          // Filter out invalid markers
          const validMarkers = sanitizedMarkers.filter(
            (marker) => marker.lat !== null && marker.lng !== null
          );

          console.log('Sanitized Markers:', validMarkers);
          setMarkers(validMarkers);
        } else {
          console.error('Invalid response format for locations:', response);
        }
      } catch (error) {
        console.error('Error fetching or processing markers:', error);
      }
    };

    fetchMarkerData();
  }, [getLocations, apiKey]);

  const handleCategoryToggle = (category: string) => {
    setVisibleCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((c) => c !== category)
        : [...prevCategories, category]
    );
  };

  return (
    <>
      {/* Category Toggle UI */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
          zIndex: 1000,
        }}
      >
        <h4 style={{ margin: 0 }}>Toggle Categories</h4>
        {Object.keys(categoryColors).map((category) => (
          <label key={category} style={{ display: 'block', margin: '5px 0' }}>
            <input
              type="checkbox"
              checked={visibleCategories.includes(category)}
              onChange={() => handleCategoryToggle(category)}
              style={{ marginRight: '5px' }}
            />
            <span
              style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                backgroundColor: categoryColors[category],
                marginRight: '5px',
                borderRadius: '50%',
              }}
            ></span>
            {category}
          </label>
        ))}
      </div>

      {/* Render Markers */}
      {markers
        .filter((marker) => visibleCategories.includes(marker.category))
        .map((marker, index) => (
          <Marker
            key={index}
            coordinates={[marker.lng as number, marker.lat as number]}
            anchor="center"
            onMouseEnter={() => setHoveredMarkerIndex(index)}
            onMouseLeave={() => setHoveredMarkerIndex(null)}
          >
            <div
              style={{
                backgroundColor: categoryColors[marker.category],
                width: '10px',
                height: '10px',
                borderRadius: '50%',
              }}
            />
            {hoveredMarkerIndex === index && (
              <div
                style={{
                  color: 'white',
                  backgroundColor: 'black',
                  padding: '5px',
                  borderRadius: '3px',
                  fontSize: '12px',
                  boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.5)',
                  whiteSpace: 'nowrap',
                  position: 'absolute',
                  top: '-30px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              >
                {marker.name}
              </div>
            )}
          </Marker>
        ))}
    </>
  );
};

export default Markers;
