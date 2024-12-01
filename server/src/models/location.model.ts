/**
 * Defines the User model for the database and also the interface to
 * access the model in TypeScript.
 */
import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Address: {
    type: String,
    required: true,
  },
  Category: {
    type: String,
    required: true,
  },
});

interface ILocation extends mongoose.Document {
  Name: string;
  Address: string;
  Category: string;
}

const Location = mongoose.model<ILocation>('Location', locationSchema);

export { ILocation, Location };
