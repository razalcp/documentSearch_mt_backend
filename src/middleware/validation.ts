import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
      return;
    }
    
    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.query);
    
    if (error) {
      res.status(400).json({
        error: 'Query validation error',
        details: error.details.map(detail => detail.message)
      });
      return;
    }
    
    next();
  };
};

// Validation schemas
export const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const searchQuerySchema = Joi.object({
  q: Joi.string().min(1).max(100).required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  sortBy: Joi.string().valid('relevance', 'date', 'title').default('relevance'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  fileType: Joi.string().valid('pdf', 'txt', 'md').optional(),
  dateFrom: Joi.date().optional(),
  dateTo: Joi.date().optional()
});

export const suggestionsQuerySchema = Joi.object({
  q: Joi.string().min(1).max(50).required(),
  limit: Joi.number().integer().min(1).max(10).default(5)
});

