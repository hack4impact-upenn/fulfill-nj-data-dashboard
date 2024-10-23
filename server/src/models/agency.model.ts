/**
 * Defines the User model for the database and also the interface to
 * access the model in TypeScript.
 */
import mongoose from 'mongoose';

const AgencySchema = new mongoose.Schema({
  no: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipcode: {
    type: Number,
    required: true,
  },
  permitWebOrders: {
    type: Boolean,
    required: true,
  },
  locationCode: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  phoneExtension: {
    type: String,
    required: false,
  },
  contact: {
    type: String,
    required: false,
  },
  searchName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
    match:
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g,
  },
  countyCode: {
    type: String,
    required: true,
  },
  activityStatus: {
    type: String,
    required: true,
  },
  hoursOfOperation: {
    type: String,
    required: false,
  },
  suppliers: {
    type: Map,
    of: [String],
     //replace with supplier objects
  }
});

interface IAgency extends mongoose.Document {
  no: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: number;
  permitWebOrders: boolean;
  locationCode: string;
  phoneNumber: string;
  phoneExtension: string;
  contact: string;
  searchName: string; 
  email: string;
  countyCode: string;
  activityStatus: string;
  hoursOfOperation: string;
  suppliers: Map<string, string[]>;
}

const Agency = mongoose.model<IAgency>('Agency', AgencySchema);

export { IAgency, Agency };
