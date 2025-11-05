import type { Request } from 'express';
import { Session } from 'express-session';

export interface AuthenticatedRequest extends Request {
  session: Session & {
    token?: string;
  };
  user?: {
    id: string;
    // otras propiedades opcionales
  };
}