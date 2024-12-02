/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import ReactMapboxGl, { Popup } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getZips, getLocations } from './api.tsx';
import Markers from './Markers';
import PopupComponent from './PopupComponent.tsx';

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoiZGhydXZndXAiLCJhIjoiY20yZjRoaHF1MDU3ZTJvcHFydGNoemR3bSJ9.IQmyIaXEYPl2NWrZ7hHJxQ',
});

const zipCodeData = require('./filtered_nj_zip_codes.min.json');

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
  const [popupCoords, setPopupCoords] = useState<[number, number] | null>(null);
  const [popupData, setPopupData] = useState<ServerZipData | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Fetch ZIP code data from the server
  useEffect(() => {
    const fetchServerData = async () => {
      try {
        const response = await getZips();
        if (response && response.data) {
          const sanitizedData = response.data.map((item: any) => {
            const sanitizedItem = {
              geography: item.geography.trim(),
              tot_pop: parseInt(item[" tot_pop "] || 0, 10),
              number_food_insecure: parseInt(item[" number_food_insecure "] || 0, 10),
              median_income: parseInt(item[" median_income "] || 0, 10),
              pct_food_insecure: parseFloat(item.pct_food_insecure || 0),
              unemployment_rate: parseFloat(item.unemployment_rate || 0),
              pct_poverty: parseFloat(item.pct_poverty || 0),
              pct_black: parseFloat(item.pct_black || 0),
              pct_hispanic: parseFloat(item.pct_hispanic || 0),
              pct_homeowners: parseFloat(item.pct_homeowners || 0),
              pct_disability: parseFloat(item.pct_disability || 0),
            };
            return sanitizedItem;
          });
    
          console.log('Sanitized serverData:', sanitizedData);
          setServerData(sanitizedData);
        }
      } catch (error) {
        console.error('Error fetching ZIP code data:', error);
      }
    };    
    fetchServerData();
  }, []);

  const onMapLoad = (map: mapboxgl.Map) => {
    mapRef.current = map;
  
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
        'fill-opacity': 0, // Increased for better visibility
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
  
    map.on('click', 'zip-layer', (e) => {
      console.log('ZIP layer clicked:', e);
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const zipCode = feature.properties?.ZCTA5CE10;
        console.log('ZIP Code:', zipCode);
  
        const [lng, lat] = e.lngLat.toArray();
        setPopupCoords([lng, lat]);
  
        const matchingData = serverData.find((item) => item.geography === zipCode);
        setPopupData(matchingData || null);
      }
    });
  
    map.on('mouseenter', 'zip-layer', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
  
    map.on('mouseleave', 'zip-layer', () => {
      map.getCanvas().style.cursor = '';
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
        <>
          <Markers
            apiKey="pk.eyJ1IjoiZGhydXZndXAiLCJhIjoiY20yZjRoaHF1MDU3ZTJvcHFydGNoemR3bSJ9.IQmyIaXEYPl2NWrZ7hHJxQ"
            getLocations={getLocations}
          />
          {popupCoords && popupData && (
            <PopupComponent popupData={popupData} setPopupCoords={setPopupCoords} />
          )}
        </>
      </Map>
    </>
  );
}

export default MapDashboard;
