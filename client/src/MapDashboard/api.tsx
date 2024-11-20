import { postData, putData, deleteData } from '../util/api.tsx';

async function getLocations() {
  const res = await postData('locations/get-locations');
  if (res.error) return null;
  return res.data;
}


async function addLocation(name: string, address: string, category: string) {
  const res = await putData('locations/add-location', { name, address, category });
  if (res.error) return false;
  return true;
}

async function deleteLocation(name: string) {
    const res = await deleteData('locations/delete-location', {name});
    if (res.error) return false;
    return true;
}

// eslint-disable-next-line import/prefer-default-export
export { getLocations, addLocation, deleteLocation };
