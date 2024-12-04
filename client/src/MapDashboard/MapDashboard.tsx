/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import ReactMapboxGl, { Popup } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getZips, getLocations } from './api.tsx';
import { calculateZipScores, ScoreDashboard } from './calculateZipScores.tsx';
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
  const [zipScores, setZipScores] = useState<Map<string, number>>(new Map<string, number>());
  const [popupInfo, setPopupInfo] = useState<{ coords: [number, number] | null; data: ServerZipData | null }>({ coords: null, data: null });
  const [isLoading, setIsLoading] = useState(true);
  const [variables, setVariables] = useState<{ [key: string]: boolean }>({
    tot_pop: true,
    pct_food_insecure: false,
    number_food_insecure: false,
    unemployment_rate: false,
    pct_poverty: false,
    pct_black: false,
    pct_hispanic: false,
    median_income: false,
    pct_homeowners: false,
    pct_disability: false,
  });

  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const fetchServerData = async () => {
      try {
        console.log("Fetching server data...");
        const response = await getZips();
        if (response && response.data) {
          const sanitizedData = response.data.map((item: any) => ({
            geography: item.geography.trim(),
            tot_pop: parseInt(item[' tot_pop '] || 0, 10),
            pct_food_insecure: parseFloat(item.pct_food_insecure || 0),
            number_food_insecure: parseInt(item[' number_food_insecure '] || 0, 10),
            unemployment_rate: parseFloat(item.unemployment_rate || 0),
            pct_poverty: parseFloat(item.pct_poverty || 0),
            pct_black: parseFloat(item.pct_black || 0),
            pct_hispanic: parseFloat(item.pct_hispanic || 0),
            median_income: parseInt(item[' median_income '] || 0, 10),
            pct_homeowners: parseFloat(item.pct_homeowners || 0),
            pct_disability: parseFloat(item.pct_disability || 0),
          }));
          setServerData(sanitizedData);
  
          const newScores = calculateZipScores(sanitizedData, variables);
          setZipScores(newScores);
  
          const map = mapRef.current;
          if (map) {
            const source = map.getSource('zip-boundaries') as mapboxgl.GeoJSONSource;
            if (source) {
              updateGeoJSONSource(source);
            }
          }
        } else {
          console.error("Empty response from server.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchServerData();
  }, [variables]);    

  const onMapLoad = (map: mapboxgl.Map) => {
    mapRef.current = map;
  
    map.addSource('zip-boundaries', {
      type: 'geojson',
      data: { ...zipCodeData },
    });
  
    map.addLayer({
      id: 'zip-layer',
      type: 'fill',
      source: 'zip-boundaries',
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'score'],
          0, '#ffeeee',
          1, '#660000',
        ],
        'fill-opacity': 0.5,
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
  
    // Ensure zip-layer is clickable
    map.on('mouseenter', 'zip-layer', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
  
    map.on('mouseleave', 'zip-layer', () => {
      map.getCanvas().style.cursor = '';
    });
  
    map.on('click', 'zip-layer', (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const zipCode = feature.properties?.ZCTA5CE10;
        const [lng, lat] = e.lngLat.toArray();
  
        setPopupInfo({
          coords: [lng, lat],
          data: serverData.find((zip) => zip.geography === zipCode) || null,
        });
      }
    });
  
    const source = map.getSource('zip-boundaries') as mapboxgl.GeoJSONSource;
    if (source) {
      updateGeoJSONSource(source);
    } else {
      console.error('Source with ID "zip-boundaries" not found.');
    }
  };
  
  const updateGeoJSONSource = (source: mapboxgl.GeoJSONSource) => {
    const features = zipCodeData.features.map((feature: any) => {
      const zipCode = feature.properties.ZCTA5CE10;
      const score = zipScores.get(zipCode) || 0;
      feature.properties.score = score;
      return feature;
    });
    source.setData({ ...zipCodeData, features });
  };
  

  if (isLoading) {
    return <div>Loading data...</div>;
  }

  return (
    <>
      <Map
        style="mapbox://styles/mapbox/streets-v9"
        maxBounds={[
          [-75.150000, 39.500000],
          [-73.094883, 40.500000],
        ]}
        center={[-74.1224415, 40.000000]} // Longitude and Latitude for center
        zoom={[2]} // Adjust the zoom level as needed (higher values are closer, lower values are farther)
        containerStyle={{
          height: '100vh',
          width: '100vw',
        }}
        onStyleLoad={onMapLoad}
      >
        <Markers apiKey="pk.eyJ1IjoiZGhydXZndXAiLCJhIjoiY20yZjRoaHF1MDU3ZTJvcHFydGNoemR3bSJ9.IQmyIaXEYPl2NWrZ7hHJxQ" getLocations={getLocations} />
        {popupInfo.coords && popupInfo.data && (
          <PopupComponent popupData={popupInfo.data} setPopupCoords={() => setPopupInfo({ coords: null, data: null })} />
        )}
      </Map>
      <ScoreDashboard
        variables={variables}
        setVariables={setVariables}
      />
    </>
  );
}

export default MapDashboard;