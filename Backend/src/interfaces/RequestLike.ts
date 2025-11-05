import type { User } from "./User";

export interface RequestLike {
  cookies: { authToken?: string };
  session: { token?: string };
  user?: User;
}