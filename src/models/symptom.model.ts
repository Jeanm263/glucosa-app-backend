import mongoose from 'mongoose';

export interface ISymptom extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  symptoms: {
    type: 'energy' | 'mood' | 'physical' | 'other';
    severity: number; // 1-10
    description: string;
  }[];
  notes: string;
  relatedFoods: mongoose.Types.ObjectId[]; // IDs de alimentos consumidos ese día
  createdAt: Date;
  updatedAt: Date;
}

const symptomSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID de usuario es requerido']
  },
  date: {
    type: Date,
    required: [true, 'La fecha es requerida']
  },
  symptoms: [{
    type: {
      type: String,
      required: true,
      enum: ['energy', 'mood', 'physical', 'other']
    },
    severity: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    description: {
      type: String,
      required: true,
      trim: true
    }
  }],
  notes: {
    type: String,
    trim: true
  },
  relatedFoods: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food'
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
symptomSchema.pre('save', function(next) {
  this.updatedAt = new Date(Date.now());
  next();
});

// Índice para mejorar el rendimiento de las consultas
symptomSchema.index({ userId: 1, date: -1 });

export default mongoose.model<ISymptom>('Symptom', symptomSchema);