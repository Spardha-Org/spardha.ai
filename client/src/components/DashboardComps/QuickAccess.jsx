import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const quickAccessItems = [
  { title: 'Mock Test 4', subtitle: 'Start', image: 'https://cdn.usegalileo.ai/sdxl10/8662b67f-457b-4c07-aa20-3f8fb140be8e.png' },
  { title: 'Revision Notes', subtitle: 'View All', image: 'https://cdn.usegalileo.ai/sdxl10/025b8567-e5e0-4673-9000-6d44ddfbd0f0.png' },
  { title: 'AI Mentor', subtitle: 'Start', image: 'https://cdn.usegalileo.ai/sdxl10/9ecc077a-e4ac-4993-bfd9-a03fe3e1f54d.png' },
  { title: 'Performance Analytics', subtitle: 'View All', image: 'https://cdn.usegalileo.ai/sdxl10/e1439bad-117c-4d06-a2b2-686ebeb9481d.png' },
  { title: 'Doubts', subtitle: 'Ask a Doubt', image: 'https://cdn.usegalileo.ai/sdxl10/1f55373c-8d5e-431d-81df-a9fca58a2fc8.png' },
  { title: 'Study Resources', subtitle: 'View All', image: 'https://cdn.usegalileo.ai/sdxl10/557be0f8-e3a6-4b61-bf6e-b9242f1059b7.png' },
  { title: 'Mock Tests', subtitle: 'View All', image: 'https://cdn.usegalileo.ai/sdxl10/8e99f867-6387-49cf-b2e9-adff279afcfc.png' },
  { title: 'Courses', subtitle: 'View All', image: 'https://cdn.usegalileo.ai/sdxl10/2f9d9aba-ef13-4990-94be-da98dbbb2237.png' },
  { title: 'Test Series', subtitle: 'View All', image: 'https://cdn.usegalileo.ai/sdxl10/def675e6-e2f9-4465-9d8f-751e6eaf52c7.png' },
];

export function QuickAccess() {
  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Quick Access
      </Typography>
      <Grid container spacing={2}>
        {quickAccessItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.title}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box
                sx={{
                  paddingTop: '100%',
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 2,
                }}
              />
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.subtitle}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

