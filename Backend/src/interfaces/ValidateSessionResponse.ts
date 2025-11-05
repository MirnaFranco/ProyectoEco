import type { User } from "./User";

export interface ValidateSessionResponse {
  message: string;
  user?: User;
}