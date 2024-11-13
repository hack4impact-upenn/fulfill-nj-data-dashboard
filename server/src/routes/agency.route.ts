import express from 'express';
// import { isAuthenticated } from '../controllers/auth.middleware.ts';

import {
  getAllAgencyPickUpController,
  getUploadAgencyJSONController,
} from '../controllers/agency.controller.ts';

const router = express.Router();

// router.get('/all', getAllAgenciesController);

// create
router.post('/uploadagencycontact', getUploadAgencyJSONController);

// delete

// update agency information

// update agency pickup days
router.post('/uploadagencypickup', getAllAgencyPickUpController);

export default router;
