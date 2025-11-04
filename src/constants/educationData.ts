import { IEducation } from '../models/education.model';

export const INITIAL_EDUCATION: Partial<IEducation>[] = [
  {
    title: '¿Qué es la Diabetes Tipo 2?',
    content: `La diabetes tipo 2 es una condición crónica donde el cuerpo no usa adecuadamente la insulina o no produce suficiente. Esta hormona permite que las células utilicen la glucosa (azúcar) de los alimentos como energía.

**Factores de Riesgo:**
- Sobrepeso u obesidad
- Antecedentes familiares
- Sedentarismo
- Dieta alta en carbohidratos procesados

**Síntomas Comunes:**
- Aumento de sed y hambre
- Fatiga
- Visión borrosa
- Cicatrización lenta

El diagnóstico temprano y el manejo adecuado son clave para mantener una buena calidad de vida.`,
    type: 'article',
    duration: '8 min',
    level: 'basic',
    tags: ['diabetes', 'básico', 'introducción']
  },
  {
    title: 'El Plato Saludable',
    content: `El método del plato saludable te ayuda a planificar comidas balanceadas:

**50% del plato - Verduras sin almidón:**
- Espinacas, brócoli, zanahorias
- Pimientos, coliflor, lechuga
- Estas aportan fibra y nutrientes sin elevar mucho la glucosa

**25% del plato - Proteínas magras:**
- Pollo, pescado, pavo
- Legumbres, huevos, tofu
- Aportan saciedad y ayudan a mantener masa muscular

**25% del plato - Granos enteros:**
- Quinua, arroz integral, pan integral
- Avena, pasta integral
- Mejor opción que granos refinados

**Agregar:**
- Una porción de fruta
- Lácteos bajos en grasa o alternativas
- Agua como bebida principal`,
    type: 'article',
    duration: '6 min',
    level: 'intermediate',
    tags: ['nutrición', 'plato saludable', 'equilibrio']
  },
  {
    title: 'Entendiendo el Índice Glucémico',
    content: `El índice glucémico (IG) es una clasificación de los carbohidratos según cuánto elevan el nivel de glucosa en sangre en comparación con la glucosa pura.

**Clasificación por IG:**
- **Bajo (0-55):** Lentejas, manzanas, leche
- **Medio (56-69):** Pan integral, plátano verde
- **Alto (70+):** Pan blanco, arroz blanco, azúcar

**Factores que afectan el IG:**
1. **Procesamiento:** Más procesado = mayor IG
2. **Fibra:** Más fibra = menor IG
3. **Grasa y proteína:** Ralentizan la absorción
4. **Temperatura:** Caliente = mayor IG
5. **Madurez:** Más maduro = mayor IG

**Consejos prácticos:**
- Combina alimentos altos con bajos
- Come frutas enteras, no jugos
- Elige granos enteros sobre refinados`,
    type: 'article',
    duration: '10 min',
    level: 'advanced',
    tags: ['índice glucémico', 'carbohidratos', 'glucosa']
  },
  {
    title: 'Ejercicio y Diabetes',
    content: `La actividad física es uno de los pilares del manejo de diabetes.

**Beneficios del Ejercicio:**
- Mejora la sensibilidad a la insulina
- Ayuda a mantener peso saludable
- Reduce riesgo cardiovascular
- Mejora el ánimo y energía

**Recomendaciones:**
- 150 minutos semanales de ejercicio moderado
- Combinar cardio y fuerza
- Caminar, nadar, bicicleta
- Entrenamiento con pesas 2-3 veces/semana

**Consideraciones:**
- Monitorear glucosa antes y después
- Mantenerse hidratado
- Tener snack a mano por si baja la glucosa
- Consultar con médico antes de empezar`,
    type: 'article',
    duration: '7 min',
    level: 'basic',
    tags: ['ejercicio', 'actividad física', 'salud']
  },
  {
    title: 'Planificación de Comidas',
    content: `Planificar tus comidas es clave para un buen control glucémico.

**Tips de Planificación:**
1. Prepara snacks saludables
2. Cocina en batch los fines de semana
3. Ten lista de comidas favoritas balanceadas
4. Lee etiquetas nutricionales
5. Usa el semáforo nutricional como guía

**Ejemplo de Día:**
- Desayuno: Avena + palta + huevo
- Snack: Manzana + nueces
- Almuerzo: Ensalada + quinua + pollo
- Snack: Yogur con semillas
- Cena: Pescado + verduras al vapor + camote

**Preparación:**
- Dedica 2 horas el domingo
- Pre-cortar verduras
- Cocinar proteínas y granos
- Portionar snacks`,
    type: 'interactive',
    duration: '15 min',
    level: 'intermediate',
    tags: ['planificación', 'menú', 'organización']
  }
];