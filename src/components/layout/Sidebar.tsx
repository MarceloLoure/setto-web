'use client';

import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Box, Divider } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/AuthContext';
import { menuGroups } from '@/config/menu-items';

const DRAWER_WIDTH = 260;

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { user, activeArenaId } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const content = (
    <Box sx={{ py: 2 }}>
      {menuGroups.map((group) => {
        const visibleItems = group.items.filter((item) => {
          if (item.roles && (!user || !item.roles.includes(user.role))) return false;
          if (item.requiresActiveArena && !activeArenaId) return false;
          return true;
        });

        if (visibleItems.length === 0) return null;

        return (
          <Box key={group.id} sx={{ mb: 2 }}>
            <Typography variant="overline" color="text.secondary" sx={{ px: 3 }}>
              {group.title}
            </Typography>
            <List dense>
              {visibleItems.map((item) => {
                const href = item.path(activeArenaId);
                const isActive = pathname === href;
                return (
                  <ListItemButton
                    key={item.id}
                    selected={isActive}
                    onClick={() => {
                      router.push(href);
                      onClose();
                    }}
                    sx={{ mx: 1.5, borderRadius: 2 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <item.icon fontSize="small" color={isActive ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItemButton>
                );
              })}
            </List>
            <Divider sx={{ mt: 1, opacity: 0.4 }} />
          </Box>
        );
      })}
    </Box>
  );

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, position: 'relative', border: 'none' },
        }}
        open
      >
        {content}
      </Drawer>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        sx={{ display: { xs: 'block', md: 'none' } }}
        ModalProps={{ keepMounted: true }}
      >
        <Box sx={{ width: DRAWER_WIDTH }}>{content}</Box>
      </Drawer>
    </>
  );
}
