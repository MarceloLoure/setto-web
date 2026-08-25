import DashboardIcon from '@mui/icons-material/Dashboard';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ScheduleIcon from '@mui/icons-material/Schedule';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EditIcon from '@mui/icons-material/Edit';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import PaidIcon from '@mui/icons-material/Paid';
import type { UserRole } from '@/features/auth/types';

export interface MenuItem {
  id: string;
  title: string;
  /** Recebe o arenaId ativo pra montar rotas que dependem de uma arena específica */
  path: (activeArenaId: string | null) => string;
  icon: React.ElementType;
  roles?: UserRole[];
  /** Se true, o item só aparece quando existe uma arena ativa selecionada */
  requiresActiveArena?: boolean;
}

export interface MenuGroup {
  id: string;
  title: string;
  items: MenuItem[];
}

export const menuGroups: MenuGroup[] = [
  {
    id: 'overview',
    title: 'Visão Geral',
    items: [
      { id: 'dashboard', title: 'Dashboard', path: () => '/dashboard', icon: DashboardIcon },
      {
        id: 'my-bookings',
        title: 'Minhas Reservas',
        path: () => '/my-bookings',
        icon: EventAvailableIcon,
        roles: ['ATHLETE', 'ARENA_ADMIN', 'RECEPTIONIST', 'TEACHER', 'SUPERADMIN'],
      },
    ],
  },
  {
    id: 'arena-management',
    title: 'Gestão da Arena',
    items: [
      {
        id: 'arena-dashboard',
        title: 'Dashboard',
        path: (arenaId) => `/arenas/${arenaId}/dashboard`,
        icon: QueryStatsIcon,
        roles: ['ARENA_ADMIN', 'RECEPTIONIST', 'SUPERADMIN'],
        requiresActiveArena: true,
      },
      {
        id: 'edit-arena',
        title: 'Dados da Arena',
        path: (arenaId) => `/arenas/${arenaId}/edit`,
        icon: EditIcon,
        roles: ['ARENA_ADMIN', 'SUPERADMIN'],
        requiresActiveArena: true,
      },
      {
        id: 'courts',
        title: 'Quadras',
        path: (arenaId) => `/arenas/${arenaId}/courts`,
        icon: SportsTennisIcon,
        roles: ['ARENA_ADMIN', 'RECEPTIONIST', 'SUPERADMIN'],
        requiresActiveArena: true,
      },
      {
        id: 'schedule',
        title: 'Horário de Funcionamento',
        path: (arenaId) => `/arenas/${arenaId}/schedule`,
        icon: ScheduleIcon,
        roles: ['ARENA_ADMIN', 'RECEPTIONIST', 'SUPERADMIN'],
        requiresActiveArena: true,
      },
      {
        id: 'arena-bookings',
        title: 'Agenda da Arena',
        path: (arenaId) => `/arenas/${arenaId}/bookings`,
        icon: EventAvailableIcon,
        roles: ['ARENA_ADMIN', 'RECEPTIONIST', 'SUPERADMIN'],
        requiresActiveArena: true,
      },
      {
        id: 'arena-payments',
        title: 'Recebimentos',
        path: (arenaId) => `/arenas/${arenaId}/payments`,
        icon: PaidIcon,
        roles: ['ARENA_ADMIN', 'RECEPTIONIST', 'SUPERADMIN'],
        requiresActiveArena: true,
      },
    ],
  },
  {
    id: 'discover',
    title: 'Descobrir',
    items: [
      {
        id: 'arenas-list',
        title: 'Arenas',
        path: () => '/arenas',
        icon: StorefrontIcon,
        roles: ['ATHLETE'],
      },
      {
        id: 'become-admin',
        title: 'Cadastrar minha arena',
        path: () => '/become-admin',
        icon: AddBusinessIcon,
        roles: ['ATHLETE'],
      },
    ],
  },
  {
    id: 'super-admin',
    title: 'Administração Global',
    items: [
      {
        id: 'master-panel',
        title: 'Painel SuperAdmin',
        path: () => '/super-admin',
        icon: SupervisorAccountIcon,
        roles: ['SUPERADMIN'],
      },
    ],
  },
];
