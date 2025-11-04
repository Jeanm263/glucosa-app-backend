import mongoose from 'mongoose';
import { IFood } from './food.model';

export interface IFoodLog extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  foodId: mongoose.Types.ObjectId;
  food: Partial<IFood>;
  portion: string;
  consumedAt: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const foodLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID de usuario es requerido']
  },
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food'
  },
  food: {
    name: String,
    category: String,
    glycemicIndex: Number,
    carbohydrates: Number,
    fiber: Number,
    sugars: Number,
    portion: String,
    trafficLight: {
      type: String,
      enum: ['green', 'yellow', 'red']
    }
  },
  portion: {
    type: String,
    required: [true, 'La porción es requerida']
  },
  consumedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Actualizar el campo updatedAt antes de guardar
foodLogSchema.pre('save', function(next) {
  this.updatedAt = new Date(Date.now());
  next();
});

export default mongoose.model<IFoodLog>('FoodLog', foodLogSchema);