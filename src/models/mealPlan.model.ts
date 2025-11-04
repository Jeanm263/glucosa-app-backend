import mongoose from 'mongoose';

export interface IMealPlan extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  meals: {
    day: Date;
    meals: {
      type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
      foods: {
        foodId?: mongoose.Types.ObjectId;
        food: {
          name: string;
          category: string;
          glycemicIndex: number;
          carbohydrates: number;
          fiber: number;
          sugars: number;
          portion: string;
          trafficLight: 'green' | 'yellow' | 'red';
        };
        portion: string;
        notes: string;
      }[];
    }[];
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const mealPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID de usuario es requerido']
  },
  name: {
    type: String,
    required: [true, 'El nombre del plan es requerido'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'La fecha de inicio es requerida']
  },
  endDate: {
    type: Date,
    required: [true, 'La fecha de fin es requerida']
  },
  meals: [{
    day: {
      type: Date,
      required: true
    },
    meals: [{
      type: {
        type: String,
        required: true,
        enum: ['breakfast', 'lunch', 'dinner', 'snack']
      },
      foods: [{
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
          required: true
        },
        notes: {
          type: String,
          trim: true
        }
      }]
    }]
  }],
  isActive: {
    type: Boolean,
    default: true
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
mealPlanSchema.pre('save', function(next) {
  this.updatedAt = new Date(Date.now());
  next();
});

export default mongoose.model<IMealPlan>('MealPlan', mealPlanSchema);