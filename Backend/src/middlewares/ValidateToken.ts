import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import type { JwtPayload } from "../interfaces/JwtPayload";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;
// Define el tipo de la carga útil (payload) del JWT

export class ValidateToken {
  /**
   * Valida un token JWT y devuelve su carga útil (payload).
   */
  static async validateTokenJWT(token: string): Promise<JwtPayload | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      // Opcional: buscar el usuario en la DB para asegurarse de que aún existe
      return decoded;
    } catch (error) {
      console.error("Error de validación de token:", error);
      return null;
    }
  }
}