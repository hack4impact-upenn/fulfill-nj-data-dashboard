import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import { IZipcode } from '../models/zipcode.model';
import {
  getZipcodeById,
  getZipcodeByZipcode,
  getAllZipcodesFromDB,
  removeZipcodeByZipcode,
} from '../services/zipcode.service';

const getZipcodeInfoById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    if (!req.params.id) {
        next(ApiError.missingFields(['id']));
    }
    const zipcodeObj = await getZipcodeById(req.params.id);
    res.status(StatusCode.OK).send(zipcodeObj);
};

const getZipcodeInfoByZipcode = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    if (!req.params.zipcode) {
        next(ApiError.missingFields(['zipcode']));
    }
    const zipcodeObj = await getZipcodeByZipcode(req.params.zipcode);
    res.status(StatusCode.OK).send(zipcodeObj);
};

const getAllZipcodes = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    return (
      getAllZipcodesFromDB()
        .then((zipcodeList) => {
          res.status(StatusCode.OK).send(zipcodeList);
        })
        .catch((e) => {
          next(ApiError.internal('Unable to retrieve all resources'));
        })
    );
  };
  
const removeZipcode = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    const { zipcode } = req.body;
    if (!zipcode) {
      next(ApiError.missingFields(['zipcode']));
      return;
    }
  
    const zipcodeObj = removeZipcodeByZipcode(zipcode);
    res.status(StatusCode.OK).send(zipcodeObj);
};

export {
    getZipcodeInfoById,
    getZipcodeInfoByZipcode,
    getAllZipcodes,
    removeZipcode,
}