// src/middlewares/validateSession.ts

import { ValidateToken } from "./ValidateToken";
import type { AuthenticatedRequest } from "../interfaces/AutenticatedRequest";
import type { NextFunction } from "express";
import type {ResponseLike} from "../interfaces/ResponseLike";

export class SessionValidator {
  /**
   * Valida la sesión del usuario a partir de un token JWT.
   */
  static async validateSession(
  req: AuthenticatedRequest,
  res: ResponseLike,
  next: NextFunction // 👈 Importante: La función para continuar
): Promise<void> {
  try {
    // Se busca el token en cookies (si cookie-parser está configurado) o en sesión
    const token = req.cookies.authToken || req.session.token; 
    if (!token) {
      return res.status(401).json({ message: "No se proporcionó token" });
    }

    // Asumo que ValidateToken.validateTokenJWT funciona
    const user = await ValidateToken.validateTokenJWT(token);
    
    if (user) {
      // 1. Adjuntar los datos del usuario a la solicitud para que el controlador los use.
      req.user = { ...user, id: user.id.toString() }; 
      
      // 2. ¡¡LLAMAR A NEXT() PARA CONTINUAR AL CONTROLADOR!!
      next();    } else {
      // Si el token existe pero es inválido o expiró
      return res.status(401).json({ message: "Acceso denegado: Token inválido o expirado" });
    }
  } catch (error) {
    console.error("Error validando la sesión:", error);
    // En caso de error de servidor (ej. DB caída, error de ValidateToken)
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
}