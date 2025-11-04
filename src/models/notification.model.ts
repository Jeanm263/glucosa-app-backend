import mongoose from 'mongoose';

export interface INotification extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'medication' | 'meal' | 'education' | 'security' | 'tip' | 'alert';
  priority: 'low' | 'medium' | 'high';
  scheduledAt: Date;
  sentAt?: Date;
  readAt?: Date;
  isRead: boolean;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID de usuario es requerido']
  },
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'El mensaje es requerido'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'El tipo es requerido'],
    enum: ['medication', 'meal', 'education', 'security', 'tip', 'alert']
  },
  priority: {
    type: String,
    required: [true, 'La prioridad es requerida'],
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  scheduledAt: {
    type: Date,
    required: [true, 'La fecha programada es requerida'],
    default: Date.now
  },
  sentAt: {
    type: Date
  },
  readAt: {
    type: Date
  },
  isRead: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
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
notificationSchema.pre('save', function(next) {
  this.updatedAt = new Date(Date.now());
  next();
});

// Índice para mejorar el rendimiento de las consultas
notificationSchema.index({ userId: 1, scheduledAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ scheduledAt: 1 });

export default mongoose.model<INotification>('Notification', notificationSchema);