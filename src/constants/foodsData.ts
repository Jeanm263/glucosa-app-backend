import { IFood } from '../models/food.model';

export const INITIAL_FOODS: Partial<IFood>[] = [
  {
    name: 'Manzana',
    category: 'frutas',
    glycemicIndex: 36,
    carbohydrates: 14,
    fiber: 2.4,
    sugars: 10,
    portion: '1 unidad mediana (180g)',
    trafficLight: 'green',
    commonNames: ['manzana', 'poma']
  },
  {
    name: 'Arroz Integral',
    category: 'cereales',
    glycemicIndex: 68,
    carbohydrates: 23,
    fiber: 1.8,
    sugars: 0.4,
    portion: '1 taza cocida (150g)',
    trafficLight: 'yellow',
    commonNames: ['arroz integral', 'arroz moreno']
  },
  {
    name: 'Palta/Aguacate',
    category: 'frutas',
    glycemicIndex: 15,
    carbohydrates: 2,
    fiber: 7,
    sugars: 0.7,
    portion: '1 unidad mediana (150g)',
    trafficLight: 'green',
    commonNames: ['palta', 'aguacate']
  },
  {
    name: 'Pan Blanco',
    category: 'cereales',
    glycemicIndex: 75,
    carbohydrates: 50,
    fiber: 2,
    sugars: 6,
    portion: '2 rebanadas (60g)',
    trafficLight: 'red',
    commonNames: ['pan', 'pan blanco']
  },
  {
    name: 'Quinua',
    category: 'cereales',
    glycemicIndex: 53,
    carbohydrates: 21,
    fiber: 2.8,
    sugars: 0.9,
    portion: '1 taza cocida (185g)',
    trafficLight: 'green',
    commonNames: ['quinua', 'quinoa']
  },
  {
    name: 'Brócoli',
    category: 'verduras',
    glycemicIndex: 15,
    carbohydrates: 6,
    fiber: 2.6,
    sugars: 1.5,
    portion: '1 taza cruda (90g)',
    trafficLight: 'green',
    commonNames: ['brócoli', 'brécol']
  },
  {
    name: 'Plátano Maduro',
    category: 'frutas',
    glycemicIndex: 62,
    carbohydrates: 23,
    fiber: 2.6,
    sugars: 12,
    portion: '1 unidad mediana (118g)',
    trafficLight: 'yellow',
    commonNames: ['plátano', 'banana', 'banano']
  },
  {
    name: 'Azúcar Blanca',
    category: 'endulzantes',
    glycemicIndex: 100,
    carbohydrates: 99.8,
    fiber: 0,
    sugars: 99.8,
    portion: '1 cucharada (12g)',
    trafficLight: 'red',
    commonNames: ['azúcar', 'azúcar blanco']
  },
  {
    name: 'Lentejas',
    category: 'legumbres',
    glycemicIndex: 25,
    carbohydrates: 20,
    fiber: 8,
    sugars: 1.8,
    portion: '1 taza cocida (198g)',
    trafficLight: 'green',
    commonNames: ['lentejas']
  },
  {
    name: 'Fideos Blancos',
    category: 'cereales',
    glycemicIndex: 61,
    carbohydrates: 31,
    fiber: 1.8,
    sugars: 0.6,
    portion: '1 taza cocida (140g)',
    trafficLight: 'yellow',
    commonNames: ['fideos', 'pasta', 'espagueti']
  }
];