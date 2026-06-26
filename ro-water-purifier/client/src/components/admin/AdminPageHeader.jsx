import { Box, Button, Stack, Typography } from '@mui/material';


export default function AdminPageHeader({
  title,
  subtitle,
  actionLabel,
  actionIcon,
  onAction,
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ sm: 'center' }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight={800}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {actionLabel && onAction && (
          <Button
            variant="contained"
            startIcon={actionIcon}
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Box>
  );
}