import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  minCapital: number;
  baseCosts: {
    name: string;
    amount: number;
    isMonthly: boolean;
  }[];
  multipliers: {
    traffic: number;
    competition: number;
  };
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  minCapital: { type: Number, required: true },
  baseCosts: [
    {
      name: { type: String },
      amount: { type: Number },
      isMonthly: { type: Boolean, default: false },
    },
  ],
  multipliers: {
    traffic: { type: Number, default: 1.0 },
    competition: { type: Number, default: 1.0 },
  },
});

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
