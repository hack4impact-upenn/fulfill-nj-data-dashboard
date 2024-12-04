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
  editedName: {
    type: String,
    required: false,
  },
  total: {
    type: Number,
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
    type: String,
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
});

interface IAgency extends mongoose.Document {
  no: string;
  name: string;
  editedName: string;
  total: number;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  locationCode: string;
  phoneNumber: string;
  phoneExtension: string;
  contact: string;
  searchName: string;
  email: string;
  countyCode: string;
  activityStatus: string;
  hoursOfOperation: string;
}

const Agency = mongoose.model<IAgency>('Agency', AgencySchema);

export { IAgency, Agency };
