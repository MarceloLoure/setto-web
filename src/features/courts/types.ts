import type { UserFile } from '@/features/auth/types';
import type { Sport } from '@/features/arenas/types';

export interface Court {
  id: string;
  name: string;
  sport: Sport;
  hourlyRate: string;
  isCovered: boolean;
  isActive: boolean;
  arenaId: string;
  photos?: UserFile[];
}
