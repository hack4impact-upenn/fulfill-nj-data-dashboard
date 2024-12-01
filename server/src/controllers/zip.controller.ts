import express from 'express';
import { IZip } from '../models/zip.model.ts';
import ApiError from '../util/apiError.ts';
import {
  createZip,
  getAllZips,
  getZipByGeography,
  deleteZipByGeography
} from '../services/zip.service.ts';
import StatusCode from '../util/statusCode.ts';

const addZip = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const Zip: IZip | null = req.body as IZip;
  if (!Zip) {
    next(ApiError.missingFields(['geography']));
    return;
  }
  /* const { firstName, imageURL,imageTitle, toxicTrait1, toxicTrait2, toxicTrait3, toxicTrait4, toxicTrait5 } = req.body; */
  // eslint-disable-next-line consistent-return
  return createZip(Zip);
};

const getZips = async (
  req: express.Request,
  res: express.Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: express.NextFunction,
) => {
  const zips = await getAllZips(); // Call the service function to get data
  res.status(200).json({ data: zips });
};

const deleteZip = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { geography } = req.params;
  if (!geography) {
    next(ApiError.missingFields(['geography']));
    return;
  }

  // Check if location to delete is an a valid location
  const zip: IZip | null = await getZipByGeography(geography);
  if (!zip) {
    next(ApiError.notFound(`User with location ${zip} does not exist`));
    return;
  }

};

export { addZip, getZips, deleteZip };
