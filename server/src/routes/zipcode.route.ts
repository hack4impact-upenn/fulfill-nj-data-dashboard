import express from 'express';
import { isAuthenticated } from '../controllers/auth.middleware';
import {
  getZipcodeInfoById,
  getZipcodeInfoByZipcode,
  getAllZipcodes,
  removeZipcode,
} from '../controllers/zipcode.controller';
import 'dotenv/config';

const router = express.Router();

/**
 * A GET route to get all zipcodes.
 */
router.get('/all', isAuthenticated, getAllZipcodes);

/**
 * A GET route to get zipcode with id
 */
router.get('/:id', isAuthenticated, getZipcodeInfoById);

/**
 * A GET route to get zipcode with zipcode
 */
router.get('/:zipcode', isAuthenticated, getZipcodeInfoByZipcode);

/**
 * A PUT route to delete a zipcode.
 */
router.put('/delete', isAuthenticated, removeZipcode);
