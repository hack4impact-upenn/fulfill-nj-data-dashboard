/* eslint-disable consistent-return */
import express from 'express';
import ApiError from '../util/apiError.ts';
import StatusCode from '../util/statusCode.ts';
import { IAgency } from '../models/agency.model.ts';

import { getAllAgencies, createAgency } from '../services/agency.service.ts';

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

const getUploadAgencyCSVController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  // The controller receives the file in the request.
  // It validates the input (checking if a file is present).
  // It calls the processCsvFile function from the agencyService.

  const agency: IAgency | null = req.body;
  if (!agency) {
    next(ApiError.missingFields(['agency']));
    return;
  }
  return createAgency(agency)
    .then((results: any) => {
      res.status(StatusCode.OK).send(results);
    })
    .catch((e) => {
      console.log('unable to create donor error', e.message);
      next(ApiError.internal('Unable to create donor'));
    });
};

export { getAllAgenciesController, getUploadAgencyCSVController };
