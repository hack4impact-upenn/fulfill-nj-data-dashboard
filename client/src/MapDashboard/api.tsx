/* eslint-disable */
import { postData, putData, deleteData } from '../util/api.tsx';

// Fetch all locations
async function getLocations() {
  try {
    const response = await fetch('http://localhost:4000/api/location/get-locations', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      console.error('Failed to fetch locations:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    console.log('Fetched Locations:', data);
    return data; // Return full response object
  } catch (error) {
    console.error('Error in getLocations:', error);
    return null;
  }
}

// Add a new location
async function addLocation(name: string, address: string, category: string) {
  const res = await putData('locations/add-location', { name, address, category });
  if (res.error) return false;
  return true;
}

// Delete a location
async function deleteLocation(name: string) {
  const res = await deleteData('locations/delete-location', { name });
  if (res.error) return false;
  return true;
}

// Fetch ZIP code data from the server
async function getZips() {
  try {
    console.log('getZips function called');
    const res = await fetch('http://localhost:4000/api/zip/get-zips', {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) {
      console.error('Failed request:', res.status, res.statusText);
      throw new Error('Failed to fetch ZIP codes');
    }
    const json = await res.json();
    console.log('getZips response:', json);
    return json; // Ensure this returns the whole object {data: [...]}
  } catch (error) {
    console.error('Error in getZips:', error);
    return null;
  }
}


// eslint-disable-next-line import/prefer-default-export
export { getLocations, addLocation, deleteLocation, getZips };
