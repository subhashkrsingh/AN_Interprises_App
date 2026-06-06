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
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '../../../components/admin/AdminPageHeader.jsx';
import {
  useCreateResourceMutation,
  useDeleteResourceMutation,
  useListResourceQuery,
  useUpdateResourceMutation,
} from '../../../features/api/adminApi.js';
import { resourceConfigs } from './resourceConfigs.js';

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
  const needsRoles = fields.some((field) => field.type === 'multiResource' && field.resource === 'roles');
  const needsPermissions = fields.some((field) => field.type === 'multiResource' && field.resource === 'permissions');
  const { data, isLoading, error } = useListResourceQuery({ resource, page: page + 1, limit, search });
  const { data: roleOptions } = useListResourceQuery({ resource: 'roles', limit: 100 }, { skip: !needsRoles });
  const { data: permissionOptions } = useListResourceQuery({ resource: 'permissions', limit: 100 }, { skip: !needsPermissions });
  const [createResource, createState] = useCreateResourceMutation();
  const [updateResource, updateState] = useUpdateResourceMutation();
  const [deleteResource] = useDeleteResourceMutation();
  const rows = data?.data || [];
  const meta = data?.meta || { total: 0 };
  const { control, handleSubmit, reset } = useForm({ defaultValues: buildDefaults(fields) });

  const allSelected = rows.length > 0 && selected.length === rows.length;
  const busy = createState.isLoading || updateState.isLoading;

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
    const payload = Object.fromEntries(
      Object.entries(values).map(([key, value]) => {
        if (value === 'true') return [key, true];
        if (value === 'false') return [key, false];
        return [key, value];
      })
    );

    if (editing) {
      await updateResource({ resource, id: editing.id, body: payload }).unwrap();
    } else {
      await createResource({ resource, body: payload }).unwrap();
    }
    setDialogOpen(false);
  };

  const toggleSelected = (id) => {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const bulkDelete = async () => {
    await Promise.all(selected.map((id) => deleteResource({ resource, id }).unwrap()));
    setSelected([]);
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
          <TextField size="small" label="Search" value={search} onChange={(event) => setSearch(event.target.value)} sx={{ minWidth: { md: 320 } }} />
          <Stack direction="row" spacing={1}>
            {selected.length > 0 && !config.disableDelete && (
              <Button color="error" startIcon={<DeleteRoundedIcon />} onClick={bulkDelete}>
                Delete selected
              </Button>
            )}
            {resource === 'orders' && (
              <Button startIcon={<PrintRoundedIcon />} onClick={() => window.print()}>
                Print invoice
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {error && <Alert severity="error">{error.data?.message || 'Unable to load records.'}</Alert>}

      <TableContainer component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              {!config.disableDelete && (
                <TableCell padding="checkbox">
                  <Checkbox checked={allSelected} onChange={(event) => setSelected(event.target.checked ? rows.map((row) => row.id) : [])} />
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
                        <IconButton color="error" onClick={() => deleteResource({ resource, id: row.id })}>
                          <DeleteRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
            {!isLoading && rows.length === 0 && (
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
          count={meta.total || 0}
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

                  if (field.type === 'multiResource') {
                    const options = field.resource === 'roles' ? roleOptions?.data || [] : permissionOptions?.data || [];
                    return (
                      <Stack spacing={0.75}>
                        <InputLabel>{field.label}</InputLabel>
                        <Select
                          multiple
                          value={Array.isArray(controllerField.value) ? controllerField.value : []}
                          onChange={(event) => controllerField.onChange(event.target.value)}
                          input={<OutlinedInput label={field.label} />}
                          renderValue={(selectedValues) =>
                            selectedValues
                              .map((value) => options.find((option) => option.id === value)?.[field.optionLabel || 'name'] || value)
                              .join(', ')
                          }
                        >
                          {options.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              <Checkbox checked={controllerField.value?.includes(option.id) || false} />
                              {option[field.optionLabel || 'name']}
                            </MenuItem>
                          ))}
                        </Select>
                      </Stack>
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
