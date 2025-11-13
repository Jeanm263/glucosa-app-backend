import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  age?: number;
  diabetesType?: string;
  initialGlucoseLevel?: number;
  preferences?: {
    dietaryRestrictions?: string[];
    favoriteFoods?: string[];
    notificationSettings?: {
      medicationReminders?: boolean;
      mealReminders?: boolean;
      educationalTips?: boolean;
    };
  };
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: 6
  },
  age: {
    type: Number,
    min: 1,
    max: 120
  },
  diabetesType: {
    type: String,
    enum: ['type1', 'type2', 'gestational', 'prediabetes', 'other']
  },
  initialGlucoseLevel: {
    type: Number,
    min: 1,
    max: 1000
  },
  preferences: {
    dietaryRestrictions: [{
      type: String,
      trim: true
    }],
    favoriteFoods: [{
      type: String,
      trim: true
    }],
    notificationSettings: {
      medicationReminders: {
        type: Boolean,
        default: true
      },
      mealReminders: {
        type: Boolean,
        default: true
      },
      educationalTips: {
        type: Boolean,
        default: true
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);