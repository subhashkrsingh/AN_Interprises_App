import { Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from '@mui/material';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import AdminPageHeader from '../../components/admin/AdminPageHeader.jsx';
import { useReportQuery } from '../../features/api/adminApi.js';

const reportTypes = [
  { value: 'sales', label: 'Sales Report' },
  { value: 'revenue', label: 'Revenue Report' },
  { value: 'products', label: 'Product Report' },
  { value: 'inventory', label: 'Inventory Report' },
  { value: 'customers', label: 'Customer Report' },
];

export default function Reports() {
  const [type, setType] = useState('sales');
  const token = useSelector((state) => state.auth.token);
  const { data } = useReportQuery({ type });
  const baseUrl = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5000/api/admin';
  const rows = data?.data || [];

  const download = async (format) => {
    const response = await fetch(`${baseUrl}/reports/export?type=${type}&format=${format}`, {
      headers: { authorization: `Bearer ${token}` },
      credentials: 'include',
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const extension = format === 'excel' ? 'xlsx' : format;
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${type}-report.${extension}`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Stack spacing={3}>
      <AdminPageHeader title="Reports" subtitle="Generate daily, monthly and yearly operational reports with CSV, Excel-compatible and JSON export." />
      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <TextField select label="Report type" value={type} onChange={(event) => setType(event.target.value)} sx={{ minWidth: 260 }}>
              {reportTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Button startIcon={<FileDownloadRoundedIcon />} onClick={() => download('csv')}>
              CSV
            </Button>
            <Button startIcon={<FileDownloadRoundedIcon />} onClick={() => download('excel')}>
              Excel
            </Button>
            <Button startIcon={<FileDownloadRoundedIcon />} onClick={() => download('pdf')}>
              PDF
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Preview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {rows.length} records loaded for the selected report.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}
