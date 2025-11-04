import mongoose from 'mongoose';

export interface IEducation extends mongoose.Document {
  title: string;
  content: string;
  type: 'article' | 'interactive' | 'video';
  duration: string;
  level: 'basic' | 'intermediate' | 'advanced';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const educationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'El contenido es requerido']
  },
  type: {
    type: String,
    required: [true, 'El tipo es requerido'],
    enum: ['article', 'interactive', 'video']
  },
  duration: {
    type: String,
    required: [true, 'La duración es requerida']
  },
  level: {
    type: String,
    required: [true, 'El nivel es requerido'],
    enum: ['basic', 'intermediate', 'advanced']
  },
  tags: [{
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
educationSchema.pre('save', function(next) {
  this.updatedAt = new Date(Date.now());
  next();
});

export default mongoose.model<IEducation>('Education', educationSchema);