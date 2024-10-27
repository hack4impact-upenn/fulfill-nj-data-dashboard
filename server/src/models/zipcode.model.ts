/**
 * Defines the Session model for the database, which stores information
 * about user sessions, and also the interface to access the model in TypeScript.
 */
import mongoose from 'mongoose';

interface IZipcode extends mongoose.Document {
  _id: string;
  zipcode: number;
	enabled_agencies: Agency[];
	suppliers: Supplier[];
	lbs_distributed: number;
	lbs_produce_distributed: number;
	total_pop: number;
	pct_food_insecure: number;
	num_food_insecure: number;
	unemployment_rate: number;
	pct_poverty: number;
	pct_black: number;
	pct_hispanic: number;
	median_income: number;	
	pct_homeowners: number;
	pct_disability: number;
}

const ZipcodeSchema = new mongoose.Schema({
  zipcode: {
    type: Number,
    required: true,
  },
  lbs_distributed: {
    type: Number,
    required: false,
  },
  lbs_produce_distributed: {
    type: Number,
    required: false,
  },
  total_pop: {
    type: Number,
    required: false,
  },
  pct_food_insecure: {
    type: Number,
    required: false,
  },
  num_food_insecure: {
    type: Number,
    required: false,
  },
  unemployment_rate: {
    type: Number,
    required: false,
  },
  pct_poverty: {
    type: Number,
    required: false,
  },
  pct_black: {
    type: Number,
    required: false,
  },
  pct_hispanic: {
    type: Number,
    required: false,
  },
  median_income: {
    type: Number,
    required: false,
  },
  pct_homeowners: {
    type: Number,
    required: false,
  },
  pct_disability: {
    type: Number,
    required: false,
  },
});

const Session = mongoose.model<IZipcode>('Session', ZipcodeSchema);

export default Session;
