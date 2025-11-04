import mongoose from 'mongoose';

export interface IFood extends mongoose.Document {
  name: string;
  category: string;
  glycemicIndex: number;
  carbohydrates: number;
  fiber: number;
  sugars: number;
  portion: string;
  trafficLight: 'green' | 'yellow' | 'red';
  commonNames: string[];
  createdAt: Date;
  updatedAt: Date;
}

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del alimento es requerido'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'La categoría del alimento es requerida'],
    trim: true
  },
  glycemicIndex: {
    type: Number,
    required: [true, 'El índice glucémico es requerido'],
    min: 0,
    max: 100
  },
  carbohydrates: {
    type: Number,
    required: [true, 'Los carbohidratos son requeridos'],
    min: 0
  },
  fiber: {
    type: Number,
    required: [true, 'La fibra es requerida'],
    min: 0
  },
  sugars: {
    type: Number,
    required: [true, 'Los azúcares son requeridos'],
    min: 0
  },
  portion: {
    type: String,
    required: [true, 'La porción es requerida'],
    trim: true
  },
  trafficLight: {
    type: String,
    required: [true, 'El semáforo nutricional es requerido'],
    enum: ['green', 'yellow', 'red']
  },
  commonNames: [{
    type: String,
    trim: true
  }],
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
foodSchema.pre('save', function(next) {
  this.updatedAt = new Date(Date.now());
  next();
});

export default mongoose.model<IFood>('Food', foodSchema);