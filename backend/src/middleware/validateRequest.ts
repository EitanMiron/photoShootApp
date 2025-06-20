import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      console.error('Validation error:', error.errors);
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors || error.message,
      });
      return;
    }
  };
};
