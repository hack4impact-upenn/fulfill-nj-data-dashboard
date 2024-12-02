import { ILocation, Location } from '../models/location.model.ts';

const createLocation = async (loc: ILocation) => {
  const newLocation = new Location(loc);
  const result = await newLocation.save();
  return result;
};

const getAllLocations = async () => {
  const locationList = await Location.find({}).exec();
  return locationList;
};

const getLocationByName = async (Name: string) => {
  const location = await Location.findOne({ Name }).exec();
  return location;
};

const deleteLocationByName = async (Name: string) => {
  const location = await Location.findByIdAndDelete(Name).exec();
  return location;
};

// eslint-disable-next-line import/prefer-default-export
export {
  createLocation,
  getAllLocations,
  getLocationByName,
  deleteLocationByName,
};
