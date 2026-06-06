import { Card, CardContent, Stack, Typography } from '@mui/material';

export default function MetricCard({ label, value, icon: Icon, tone = 'primary' }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          {Icon && (
            <Stack sx={{ width: 46, height: 46, borderRadius: 2, bgcolor: `${tone}.main`, color: `${tone}.contrastText` }} alignItems="center" justifyContent="center">
              <Icon />
            </Stack>
          )}
          <Stack>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="h5">{value}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
