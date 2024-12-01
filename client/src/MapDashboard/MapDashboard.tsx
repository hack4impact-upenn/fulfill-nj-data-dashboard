/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import ReactMapboxGl, { Marker, Popup } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getZips } from './api.tsx'; // Adjusted relative path for client-side API integration

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoiZGhydXZndXAiLCJhIjoiY20yZjRoaHF1MDU3ZTJvcHFydGNoemR3bSJ9.IQmyIaXEYPl2NWrZ7hHJxQ',
});

const zipCodeData = require('./filtered_nj_zip_codes.min.json'); // Adjusted relative path for GeoJSON data

interface Coordinate {
  lng: number;
  lat: number;
  Agency: string;
}

interface ServerZipData {
  geography: string;
  tot_pop: number;
  pct_food_insecure: number;
  number_food_insecure: number;
  unemployment_rate: number;
  pct_poverty: number;
  pct_black: number;
  pct_hispanic: number;
  median_income: number;
  pct_homeowners: number;
  pct_disability: number;
}

function MapDashboard() {
  const [serverData, setServerData] = useState<ServerZipData[]>([]);
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [popupCoords, setPopupCoords] = useState<[number, number] | null>(null);
  const [popupData, setPopupData] = useState<ServerZipData | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Fetch ZIP code data from the server
  useEffect(() => {
    const fetchServerData = async () => {
      try {
        const response = await getZips(); // Fetch data from API
        console.log('Fetched ZIP Data:', response);
        if (response && response.data) {
          // Sanitize field names and ensure numeric fields are properly handled
          const sanitizedData = response.data.map((item: any) => ({
            ...item,
            geography: item.geography.trim(),
            tot_pop: parseInt(item[" tot_pop "] || item.tot_pop || 0, 10),
            median_income: parseInt(item[" median_income "] || item.median_income || 0, 10),
            number_food_insecure: parseInt(item[" number_food_insecure "] || item.number_food_insecure || 0, 10),
          }));
          setServerData(sanitizedData); // Set sanitized data
          console.log('Sanitized Server Data:', sanitizedData);
        } else {
          console.error('Invalid response format:', response);
        }
      } catch (error) {
        console.error('Error fetching ZIP code data:', error);
      }
    };
    fetchServerData();
  }, []);
  
  
  // Mapbox map load handler
  const onMapLoad = (map: mapboxgl.Map) => {
    console.log('Map loaded');
    mapRef.current = map;

    // Add GeoJSON source and layer
    map.addSource('zip-boundaries', {
      type: 'geojson',
      data: zipCodeData,
    });

    map.addLayer({
      id: 'zip-layer',
      type: 'fill',
      source: 'zip-boundaries',
      paint: {
        'fill-color': '#6e5642',
        'fill-opacity': 0.1,
        'fill-outline-color': '#6e5642',
      },
    });

    map.addLayer({
      id: 'zip-borders',
      type: 'line',
      source: 'zip-boundaries',
      paint: {
        'line-color': '#6e5642',
        'line-width': 2,
      },
    });

    // Add click event for ZIP layer
    map.on('click', 'zip-layer', (e) => {
      console.log('ZIP layer clicked:', e);
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const zipCode = feature.properties?.ZCTA5CE10; // Extract ZIP code
        const [lng, lat] = e.lngLat.toArray(); // Get click coordinates
        console.log('Clicked ZIP code:', zipCode);
        console.log('Click coordinates:', [lng, lat]);

        setPopupCoords([lng, lat]);
        console.log('Popup coordinates set:', [lng, lat]);

        if (serverData && Array.isArray(serverData)) {
          const matchingData = serverData.find((item) => item.geography === zipCode);
          console.log('Matching server data:', matchingData);
          setPopupData(matchingData || null);
        } else {
          console.error('serverData is not an array or is undefined:', serverData);
        }
      } else {
        console.error('No features found on click event');
      }
    });

    // Update cursor style on hover
    map.on('mouseenter', 'zip-layer', () => {
      map.getCanvas().style.cursor = 'pointer';
      console.log('Mouse entered ZIP layer');
    });

    map.on('mouseleave', 'zip-layer', () => {
      map.getCanvas().style.cursor = '';
      console.log('Mouse left ZIP layer');
    });
  };

  return (
    <>
      <Map
        style="mapbox://styles/mapbox/light-v11"
        maxBounds={[
          [-74.450000, 39.500000],
          [-73.894883, 40.500000],
        ]}
        containerStyle={{
          height: '100vh',
          width: '100vw',
        }}
        onStyleLoad={onMapLoad}
      >
        {/* Render markers */}
        {coordinates.map((marker, index) => (
          <Marker
            key={index}
            coordinates={[marker.lng, marker.lat]}
            anchor="center"
          >
            <div
              style={{
                backgroundColor: 'red',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
              }}
            />
            <div
              style={{
                color: 'black',
                backgroundColor: 'white',
                padding: '2px 5px',
                borderRadius: '3px',
                fontSize: '12px',
                boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.5)',
              }}
            >
              {marker.Agency}
            </div>
          </Marker>
        ))}

        {/* Render popup with server data */}
        {popupCoords && popupData && (
          <Popup 
            coordinates={popupCoords} 
            offset={[0, -15]}
            onClose={() => {
              console.log('Popup closed');
              setPopupCoords(null);
              setPopupData(null);
            }}
          >
            <div
              style={{
                padding: '10px',
                backgroundColor: 'white',
                border: '1px solid black',
                borderRadius: '5px',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
              }}
            >
              <h4>ZIP Code: {popupData.geography}</h4>
              <p>
                Total Population: {popupData.tot_pop ? popupData.tot_pop.toLocaleString() : 'N/A'}
              </p>
              <p>
                Median Income: 
                {popupData.median_income ? `$${popupData.median_income.toLocaleString()}` : 'N/A'}
              </p>
              <p>
                Poverty Rate: 
                {popupData.pct_poverty
                  ? `${(popupData.pct_poverty * 100).toFixed(1)}%`
                  : 'N/A'}
              </p>
              <p>
                Unemployment Rate: 
                {popupData.unemployment_rate
                  ? `${(popupData.unemployment_rate * 100).toFixed(1)}%`
                  : 'N/A'}
              </p>
              <p>
                Food Insecurity: 
                {popupData.pct_food_insecure
                  ? `${(popupData.pct_food_insecure * 100).toFixed(1)}%`
                  : 'N/A'}
              </p>
              <p>
                Black Population: 
                {popupData.pct_black
                  ? `${(popupData.pct_black * 100).toFixed(1)}%`
                  : 'N/A'}
              </p>
              <p>
                Hispanic Population: 
                {popupData.pct_hispanic
                  ? `${(popupData.pct_hispanic * 100).toFixed(1)}%`
                  : 'N/A'}
              </p>
              <p>
                Homeownership: 
                {popupData.pct_homeowners
                  ? `${(popupData.pct_homeowners * 100).toFixed(1)}%`
                  : 'N/A'}
              </p>
              <p>
                Disability Rate: 
                {popupData.pct_disability
                  ? `${(popupData.pct_disability * 100).toFixed(1)}%`
                  : 'N/A'}
              </p>
            </div>
          </Popup>

        )}
      </Map>
    </>
  );
}

export default MapDashboard;
