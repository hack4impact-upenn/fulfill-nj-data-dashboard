import express from 'express';
// import { isAuthenticated } from '../controllers/auth.middleware.ts';

import {
  getAllAgenciesController,
  getUploadAgencyJSONController,
} from '../controllers/agency.controller.ts';

const router = express.Router();

router.get('/all', getAllAgenciesController);

// create
router.get('/uploadagencycontact', getUploadAgencyJSONController);

// delete

// update agency information

// update agency pickup days

export default router;
