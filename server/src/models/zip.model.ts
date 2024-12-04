import mongoose from 'mongoose';

const ZipSchema = new mongoose.Schema({
  geography: {
    type: String,
    required: true,
  },
  tot_pop: {
    type: Number,
  },
  pct_food_insecure: {
    type: Number,
  },
  number_food_insecure: {
    type: Number,
  },
  unemployment_rate: {
    type: Number,
  },
  pct_poverty: {
    type: Number,
  },
  pct_black: {
    type: Number,
  },
  pct_hispanic: {
    type: Number,
  },
  median_income: {
    type: Number,
  },
  pct_homeowners: {
    type: Number,
  },
  pct_disability: {
    type: Number,
  },
});

interface IZip extends mongoose.Document {
  geography: string;
  tot_pop: number;
  pct_food_insecure: number;
  number_food_insecure: number;
  unemployment_rate: number;
  pct_poverty: number;
  pct_black: number;
  pct_hispanic: number;
  median_income: number;
  pct_homeowners: number;
  pct_disability: number;
}

const Zip = mongoose.model<IZip>('Zip', ZipSchema);

export { IZip, Zip };