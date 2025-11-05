import type { Request, Response, NextFunction } from 'express'; // Aseguramos los tipos para middleware
import { validationResult } from 'express-validator';
// Middleware para manejar los resultados de la validación y responder con errores 400

export class ValidationsErrors {

static handleValidationErrors (req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Mapear errores para una respuesta más limpia y solo con el primer error por campo
        const extractedErrors: Record<string, string> = {};
        errors.array({ onlyFirstError: true }).forEach(err => {
            // 'path' es la propiedad que contiene el nombre del campo en versiones recientes
            const key = (err as any).path; 
            if (key) {
                extractedErrors[key] = err.msg;
            }
        });
        
        return res.status(400).json({ 
            mensaje: 'Errores de validación en la solicitud',
            errores: extractedErrors 
        });
    }
    next();
};
}