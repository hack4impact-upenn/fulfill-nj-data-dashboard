/* eslint-disable consistent-return */
import express from 'express';
import ApiError from '../util/apiError.ts';
import StatusCode from '../util/statusCode.ts';
import { IAgency } from '../models/agency.model.ts';

import {
  getAllAgencies,
  createAgency,
  uploadAgencyJSON,
  uploadAgencyMonthlyData,
} from '../services/agency.service.ts';

const getAllAgenciesController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  return getAllAgencies()
    .then((agencyList: any) => {
      res.status(StatusCode.OK).send(agencyList);
    })
    .catch(() => {
      next(ApiError.internal('Unable to retrieve all agencies'));
    });
};

const getUploadAgencyJSONController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const data: any | null = req.body;
  if (!data) {
    next(ApiError.missingFields(['agency']));
    return;
  }
  return uploadAgencyJSON(data)
    .then((results: any) => {
      res.status(StatusCode.OK).send(results);
    })
    .catch((e) => {
      console.log('unable to upload agency error', e.message);
      next(ApiError.internal('Unable to upload agency'));
    });
};

const uploadAgencyPickUpController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const data: any | null = req.body;
  if (!data) {
    next(ApiError.missingFields(['agency']));
    return;
  }
  return uploadAgencyJSON(data)
    .then((results: any) => {
      res.status(StatusCode.OK).send(results);
    })
    .catch((e) => {
      console.log('unable to upload agency error', e.message);
      next(ApiError.internal('Unable to upload agency'));
    });
};

export { getAllAgenciesController, getUploadAgencyJSONController, uploadAgencyPickUpController };

