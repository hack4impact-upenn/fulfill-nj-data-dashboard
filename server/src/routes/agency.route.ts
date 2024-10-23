import express from 'express';
import { isAuthenticated } from '../controllers/auth.middleware';

import {
    getAllAgenciesController,
    getUploadAgencyCSVController,
} from '../controllers/agency.controller';

const router = express.Router();

router.get('/all', getAllAgenciesController);

//create
router.get('/upload', getUploadAgencyCSVController);

//delete


//update agency information

//update agency pickup days

export default router;