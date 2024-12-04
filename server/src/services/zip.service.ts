import { IZip, Zip } from '../models/zip.model.ts';

const createZip = async (zip: IZip) => {
  const newZip = new Zip(zip);
  const result = await newZip.save();
  return result;
};

const getAllZips = async () => {
  const zipList = await Zip.find({}).exec();
  return zipList;
};

const getZipByGeography = async (geography: string) => {
  const zip = await Zip.findOne({ geography }).exec();
  return zip;
};

const deleteZipByGeography = async (geography: string) => {
  const zip = await Zip.findByIdAndDelete(geography).exec();
  return zip;
};

// eslint-disable-next-line import/prefer-default-export
export {
  createZip,
  getAllZips,
  getZipByGeography,
  deleteZipByGeography,
};
