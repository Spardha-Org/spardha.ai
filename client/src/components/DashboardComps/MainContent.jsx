import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DailyInspiration } from './DailyInspiration';
import { CurrentAffairs } from './CurrentAffairs';
import { ProgressTrackers } from './ProgressTrackers';
import { QuickAccess } from './QuickAccess';

export function MainContent() {
  return (
    <Box sx={{ flexGrow: 1, p: 3, maxWidth: 960 }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Good morning, Akshay
      </Typography>
      <Typography variant="body2" color="text.secondary" marginBottom={2} gutterBottom >
        Here's your daily dose of inspiration
      </Typography>
      <DailyInspiration />
      <CurrentAffairs />
      <ProgressTrackers />
      <QuickAccess />
    </Box>
  );
}

