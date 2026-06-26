import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  InputLabel,
  IconButton,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from './AdminPageHeader.jsx';
import { resourceConfigs } from '../../app/resourceConfigs.js';

function getValue(row, key) {
  return key.split('.').reduce((value, part) => value?.[part], row);
}

function formatValue(value, format) {
  if (format === 'currency') return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(value || 0));
  if (format === 'date') return value ? new Date(value).toLocaleString() : '-';
  if (format === 'boolean') return value ? 'Yes' : 'No';
  if (format === 'array') return Array.isArray(value) ? value.join(', ') : '-';
  if (format === 'json') return typeof value === 'object' ? JSON.stringify(value) : String(value ?? '-');
  return value ?? '-';
}

function buildDefaults(fields = [], record = {}) {
  return Object.fromEntries(
    fields.map((field) => [field.name, record[field.name] ?? field.defaultValue ?? (field.type === 'boolean' ? false : '')])
  );
}

// Sample data for each resource
const sampleData = {
  products: [
    { id: 1, name: 'LifeGuard RO Purifier', sku: 'LG-001', category: { name: 'RO Systems' }, brand: { name: 'LifeGuard' }, price: 14999, stockQuantity: 25, status: 'ACTIVE' },
    { id: 2, name: 'LifeGuard Booster Pump', sku: 'LG-002', category: { name: 'Accessories' }, brand: { name: 'LifeGuard' }, price: 4999, stockQuantity: 15, status: 'ACTIVE' },
    { id: 3, name: 'LifeGuard MAX', sku: 'LG-003', category: { name: 'RO Systems' }, brand: { name: 'LifeGuard' }, price: 19999, stockQuantity: 10, status: 'ACTIVE' },
  ],
  categories: [
    { id: 1, name: 'RO Systems', slug: 'ro-systems', status: true },
    { id: 2, name: 'Accessories', slug: 'accessories', status: true },
    { id: 3, name: 'Filters', slug: 'filters', status: true },
  ],
  brands: [
    { id: 1, name: 'LifeGuard', slug: 'lifeguard', status: true },
    { id: 2, name: 'AquaPure', slug: 'aquapure', status: true },
  ],
  orders: [
    { id: 1, orderNumber: 'ORD-001', customer: { email: 'john@example.com' }, status: 'DELIVERED', paymentStatus: 'PAID', grandTotal: 14999, createdAt: new Date() },
    { id: 2, orderNumber: 'ORD-002', customer: { email: 'jane@example.com' }, status: 'PROCESSING', paymentStatus: 'PENDING', grandTotal: 19999, createdAt: new Date() },
  ],
  customers: [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '9876543210', status: 'ACTIVE' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '9876543211', status: 'ACTIVE' },
  ],
  inventory: [
    { id: 1, product: { name: 'RO Membrane', sku: 'RM-001' }, stockQuantity: 3, reservedQuantity: 0, lowStockThreshold: 5, stockStatus: 'LOW_STOCK' },
    { id: 2, product: { name: 'Carbon Filter', sku: 'CF-002' }, stockQuantity: 5, reservedQuantity: 1, lowStockThreshold: 5, stockStatus: 'IN_STOCK' },
  ],
  coupons: [
    { id: 1, code: 'SAVE10', discountType: 'PERCENTAGE', discountValue: 10, usageLimit: 100, usedCount: 25, isActive: true },
    { id: 2, code: 'FREESHIP', discountType: 'FREE_SHIPPING', discountValue: 0, usageLimit: 50, usedCount: 10, isActive: true },
  ],
  reviews: [
    { id: 1, product: { name: 'LifeGuard RO' }, customer: { email: 'user1@example.com' }, rating: 5, title: 'Excellent product!', status: 'APPROVED' },
    { id: 2, product: { name: 'LifeGuard MAX' }, customer: { email: 'user2@example.com' }, rating: 4, title: 'Good value', status: 'PENDING' },
  ],
  banners: [
    { id: 1, title: 'Summer Sale', type: 'HOMEPAGE_SLIDER', imageUrl: '/banner1.jpg', isEnabled: true },
    { id: 2, title: 'New Arrival', type: 'PROMOTIONAL', imageUrl: '/banner2.jpg', isEnabled: true },
  ],
  'cms-pages': [
    { id: 1, title: 'About Us', slug: 'about', status: 'PUBLISHED', updatedAt: new Date() },
    { id: 2, title: 'Privacy Policy', slug: 'privacy', status: 'PUBLISHED', updatedAt: new Date() },
  ],
  notifications: [
    { id: 1, type: 'ORDER', title: 'New Order', message: 'Order ORD-001 placed', isRead: false, createdAt: new Date() },
    { id: 2, type: 'STOCK', title: 'Low Stock', message: 'RO Membrane low stock', isRead: true, createdAt: new Date() },
  ],
  users: [
    { id: 1, name: 'Admin User', email: 'admin@example.com', roles: ['super_admin'], status: 'ACTIVE' },
    { id: 2, name: 'Manager', email: 'manager@example.com', roles: ['manager'], status: 'ACTIVE' },
  ],
  roles: [
    { id: 1, name: 'Super Admin', slug: 'super_admin', permissionSlugs: ['*'], isSystem: true },
    { id: 2, name: 'Manager', slug: 'manager', permissionSlugs: ['products.*', 'orders.*'], isSystem: true },
  ],
  permissions: [
    { id: 1, name: 'View Products', slug: 'products.view', module: 'products', createdAt: new Date() },
    { id: 2, name: 'Edit Products', slug: 'products.edit', module: 'products', createdAt: new Date() },
  ],
  settings: [
    { id: 1, group: 'general', key: 'site_name', value: 'RO Commerce', isPublic: true },
    { id: 2, group: 'email', key: 'smtp_host', value: 'smtp.example.com', isPublic: false },
  ],
  'activity-logs': [
    { id: 1, module: 'products', action: 'CREATE', user: { email: 'admin@example.com' }, entity: 'LifeGuard RO', createdAt: new Date() },
    { id: 2, module: 'orders', action: 'UPDATE', user: { email: 'admin@example.com' }, entity: 'ORD-001', createdAt: new Date() },
  ],
};

export default function ResourceListPage({ resource }) {
  const config = resourceConfigs[resource];
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [editing, setEditing] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const fields = config.fields || [];
  const { control, handleSubmit, reset } = useForm({ defaultValues: buildDefaults(fields) });

  const rows = sampleData[resource] || [];
  const total = rows.length;
  const allSelected = rows.length > 0 && selected.length === rows.length;
  const busy = false;

  const openCreate = () => {
    if (config.createPath) return navigate(config.createPath);
    setEditing(null);
    reset(buildDefaults(fields));
    setDialogOpen(true);
  };

  const openEdit = (row) => {
    if (config.editPath) return navigate(config.editPath(row.id));
    setEditing(row);
    reset(buildDefaults(fields, row));
    setDialogOpen(true);
  };

  const onSubmit = async (values) => {
    console.log('Saving:', values);
    setDialogOpen(false);
  };

  const toggleSelected = (id) => {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const titleAction = useMemo(() => {
    if (config.disableCreate) return {};
    return { actionLabel: 'Add Record', actionIcon: <AddRoundedIcon />, onAction: openCreate };
  }, [config]);

  return (
    <Stack spacing={2.5}>
      <AdminPageHeader title={config.title} subtitle={config.subtitle} {...titleAction} />

      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ md: 'center' }} justifyContent="space-between">
          <TextField 
            size="small" 
            label="Search" 
            value={search} 
            onChange={(event) => setSearch(event.target.value)} 
            sx={{ minWidth: { md: 320 } }} 
          />
          <Stack direction="row" spacing={1}>
            {selected.length > 0 && !config.disableDelete && (
              <Button color="error" startIcon={<DeleteRoundedIcon />} onClick={() => setSelected([])}>
                Delete selected
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      <TableContainer component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              {!config.disableDelete && (
                <TableCell padding="checkbox">
                  <Checkbox 
                    checked={allSelected} 
                    onChange={(event) => setSelected(event.target.checked ? rows.map((row) => row.id) : [])} 
                  />
                </TableCell>
              )}
              {config.columns.map((column) => (
                <TableCell key={column.key}>{column.label}</TableCell>
              ))}
              {!config.disableEdit && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} hover>
                {!config.disableDelete && (
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected.includes(row.id)} onChange={() => toggleSelected(row.id)} />
                  </TableCell>
                )}
                {config.columns.map((column) => (
                  <TableCell key={column.key}>
                    <Typography variant="body2" sx={{ maxWidth: 260 }} noWrap>
                      {formatValue(getValue(row, column.key), column.format)}
                    </Typography>
                  </TableCell>
                ))}
                {!config.disableEdit && (
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => openEdit(row)}>
                        <EditRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {!config.disableDelete && (
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => console.log('Delete:', row.id)}>
                          <DeleteRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={config.columns.length + 2}>
                  <Box sx={{ py: 5, textAlign: 'center' }}>
                    <Typography color="text.secondary">No records found.</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={limit}
          onPageChange={(event, nextPage) => setPage(nextPage)}
          onRowsPerPageChange={(event) => {
            setLimit(Number(event.target.value));
            setPage(0);
          }}
        />
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? `Edit ${config.title}` : `Add ${config.title}`}</DialogTitle>
        <DialogContent>
          <Stack component="form" id={`${resource}-form`} spacing={2} sx={{ pt: 1 }} onSubmit={handleSubmit(onSubmit)}>
            {fields.map((field) => (
              <Controller
                key={field.name}
                name={field.name}
                control={control}
                rules={{ required: field.required }}
                render={({ field: controllerField, fieldState }) => {
                  if (field.type === 'boolean') {
                    return (
                      <FormControlLabel
                        control={<Checkbox checked={Boolean(controllerField.value)} onChange={(event) => controllerField.onChange(event.target.checked)} />}
                        label={field.label}
                      />
                    );
                  }
                  return (
                    <TextField
                      {...controllerField}
                      label={field.label}
                      type={field.type === 'password' ? 'password' : field.type === 'number' ? 'number' : 'text'}
                      multiline={field.multiline}
                      rows={field.multiline ? 4 : undefined}
                      select={field.type === 'select'}
                      error={!!fieldState.error}
                      helperText={fieldState.error ? `${field.label} is required` : ''}
                      fullWidth
                    >
                      {field.options?.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  );
                }}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button type="submit" form={`${resource}-form`} variant="contained" disabled={busy}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}