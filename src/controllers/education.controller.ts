import { Request, Response } from 'express';
// import { IEducation } from '../models/education.model'; // Comentado porque no se usa directamente
import Education from '../models/education.model';
import logger from '../utils/logger';

// Obtener todas las entradas educativas
export const getAllEducation = async (req: Request, res: Response) => {
  try {
    const educationEntries = await Education.find().sort({ category: 1, level: 1 });
    res.json(educationEntries);
  } catch (error: any) {
    logger.error('Error al obtener entradas educativas:', error);
    res.status(500).json({ message: 'Error al obtener entradas educativas' });
  }
};

// Obtener entradas educativas por categoría
export const getEducationByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const educationEntries = await Education.find({ category }).sort({ level: 1 });
    res.json(educationEntries);
  } catch (error: any) {
    logger.error('Error al obtener entradas educativas por categoría:', error);
    res.status(500).json({ message: 'Error al obtener entradas educativas por categoría' });
  }
};

// Obtener una entrada educativa por ID
export const getEducationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const educationEntry = await Education.findById(id);
    
    if (!educationEntry) {
      return res.status(404).json({ message: 'Entrada educativa no encontrada' });
    }
    
    res.json(educationEntry);
  } catch (error: any) {
    logger.error('Error al obtener entrada educativa:', error);
    res.status(500).json({ message: 'Error al obtener entrada educativa' });
  }
};

// Crear una nueva entrada educativa (solo para administradores)
export const createEducation = async (req: Request, res: Response) => {
  try {
    const educationEntry = new Education(req.body);
    const savedEntry = await educationEntry.save();
    res.status(201).json(savedEntry);
  } catch (error: any) {
    logger.error('Error al crear entrada educativa:', error);
    res.status(500).json({ message: 'Error al crear entrada educativa' });
  }
};

// Actualizar una entrada educativa (solo para administradores)
export const updateEducation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedEntry = await Education.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedEntry) {
      return res.status(404).json({ message: 'Entrada educativa no encontrada' });
    }
    
    res.json(updatedEntry);
  } catch (error: any) {
    logger.error('Error al actualizar entrada educativa:', error);
    res.status(500).json({ message: 'Error al actualizar entrada educativa' });
  }
};

// Eliminar una entrada educativa (solo para administradores)
export const deleteEducation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedEntry = await Education.findByIdAndDelete(id);
    
    if (!deletedEntry) {
      return res.status(404).json({ message: 'Entrada educativa no encontrada' });
    }
    
    res.json({ message: 'Entrada educativa eliminada correctamente' });
  } catch (error: any) {
    logger.error('Error al eliminar entrada educativa:', error);
    res.status(500).json({ message: 'Error al eliminar entrada educativa' });
  }
};