import mongoose from 'mongoose';

export interface IGlucose extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  time: string; // HH:MM format
  level: number; // mg/dL
  mealContext: 'fasting' | 'before_meal' | 'after_meal' | 'bedtime' | 'other';
  notes: string;
  relatedFoods: mongoose.Types.ObjectId[]; // IDs de alimentos consumidos
  createdAt: Date;
  updatedAt: Date;
}

const glucoseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID de usuario es requerido']
  },
  date: {
    type: Date,
    required: [true, 'La fecha es requerida']
  },
  time: {
    type: String,
    required: [true, 'La hora es requerida'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
  },
  level: {
    type: Number,
    required: [true, 'El nivel de glucosa es requerido'],
    min: 1,
    max: 1000
  },
  mealContext: {
    type: String,
    required: [true, 'El contexto de la medición es requerido'],
    enum: ['fasting', 'before_meal', 'after_meal', 'bedtime', 'other']
  },
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
glucoseSchema.pre('save', function(next) {
  this.updatedAt = new Date(Date.now());
  next();
});

// Índice para mejorar el rendimiento de las consultas
glucoseSchema.index({ userId: 1, date: -1 });

export default mongoose.model<IGlucose>('Glucose', glucoseSchema);