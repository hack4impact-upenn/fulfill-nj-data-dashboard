import express from 'express';
import {
  getZips,
  addZip,
  deleteZip,
} from '../controllers/zip.controller.ts';
import 'dotenv/config';

const router = express.Router();

router.post('/add-zip', addZip);
router.delete('/delete-zip', deleteZip);
router.get('/get-zips', getZips);

export default router;
