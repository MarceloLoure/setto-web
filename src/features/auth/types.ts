export type UserRole = 'ATHLETE' | 'ARENA_ADMIN' | 'RECEPTIONIST' | 'TEACHER' | 'SUPERADMIN';

export interface UserFile {
  id: string;
  name: string;
  path: string; // URL pública do arquivo no Storage
}

export interface ArenaRef {
  id: string;
  name: string;
}

/** Espelha o retorno de GET /users/me na API */
export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  avatar?: UserFile | null;
  cover?: UserFile | null;
  bio?: string | null;
  role: UserRole;
  btRating?: number | null;
  footvolleyElo?: number | null;
  arenasManaged: ArenaRef[];
  arenasEmployed: ArenaRef[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  city?: string;
  state?: string;
  bio?: string;
}
