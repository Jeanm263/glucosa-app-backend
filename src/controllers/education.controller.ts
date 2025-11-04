import { Request, Response } from 'express';
import Education, { IEducation } from '../models/education.model';

export const getAllEducation = async (req: Request, res: Response) => {
  try {
    const { level, search } = req.query;
    
    // Construir filtro
    const filter: any = {};
    
    if (level && level !== 'todos') {
      filter.level = level;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    const education = await Education.find(filter).sort({ title: 1 });
    
    res.json({
      success: true,
      count: education.length,
      data: education
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el contenido educativo',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getEducationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const education = await Education.findById(id);
    
    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Contenido educativo no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: education
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el contenido educativo',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const createEducation = async (req: Request, res: Response) => {
  try {
    const education = new Education(req.body);
    await education.save();
    
    res.status(201).json({
      success: true,
      data: education
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        error: Object.values(error.errors).map((err: any) => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al crear el contenido educativo',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const updateEducation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const education = await Education.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Contenido educativo no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: education
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        error: Object.values(error.errors).map((err: any) => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el contenido educativo',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const deleteEducation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const education = await Education.findByIdAndDelete(id);
    
    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Contenido educativo no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Contenido educativo eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el contenido educativo',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};