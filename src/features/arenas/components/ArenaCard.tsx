'use client';

import React from 'react';
import { Card, CardActionArea, CardMedia, CardContent, Typography, Stack, Chip, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlaceIcon from '@mui/icons-material/Place';
import type { ArenaListItem } from '../types';

interface ArenaCardProps {
  arena: ArenaListItem;
  onClick: () => void;
  onToggleFollow?: () => void;
}

export default function ArenaCard({ arena, onClick, onToggleFollow }: ArenaCardProps) {
  return (
    <Card variant="outlined" sx={{ position: 'relative' }}>
      <CardActionArea onClick={onClick}>
        <CardMedia
          component="img"
          height={140}
          image={arena.logo?.path || arena.photos?.[0]?.path || '/arena-placeholder.png'}
          alt={arena.name}
          sx={{ objectFit: 'cover', bgcolor: 'background.default' }}
        />
        <CardContent>
          <Typography fontWeight={700} noWrap>
            {arena.name}
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.secondary', mb: 1 }}>
            <PlaceIcon fontSize="inherit" />
            <Typography variant="body2" noWrap>
              {arena.city} - {arena.state}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Chip label={`${arena.totalActiveCourts} quadras`} size="small" />
            <Chip label={`${arena.totalFollowers} seguidores`} size="small" variant="outlined" />
          </Stack>
        </CardContent>
      </CardActionArea>
      {onToggleFollow && (
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onToggleFollow();
          }}
          sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper' }}
        >
          {arena.isFollowing ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
      )}
    </Card>
  );
}
