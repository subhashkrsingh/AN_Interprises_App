import {
  Alert,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Controller, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../../components/admin/AdminPageHeader.jsx';
import {
  useCreateResourceMutation,
  useGetResourceQuery,
  useListResourceQuery,
  useUpdateResourceMutation,
} from '../../../features/api/adminApi.js';

const statuses = ['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED'];

function appendFormData(values) {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (key === 'images') {
      Array.from(value || []).forEach((file) => formData.append('images', file));
      return;
    }
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  return formData;
}

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const { data: productData } = useGetResourceQuery({ resource: 'products', id }, { skip: !editing });
  const { data: categories } = useListResourceQuery({ resource: 'categories', limit: 100 });
  const { data: brands } = useListResourceQuery({ resource: 'brands', limit: 100 });
  const { data: vendors } = useListResourceQuery({ resource: 'vendors', limit: 100 });
  const [createProduct, createState] = useCreateResourceMutation();
  const [updateProduct, updateState] = useUpdateResourceMutation();
  const { control, handleSubmit, reset, register } = useForm({
    defaultValues: {
      name: '',
      sku: '',
      barcode: '',
      slug: '',
      description: '',
      shortDescription: '',
      categoryId: '',
      subCategoryId: '',
      brandId: '',
      vendorId: '',
      price: '',
      salePrice: '',
      costPrice: '',
      stockQuantity: 0,
      weight: '',
      taxPercentage: 0,
      status: 'DRAFT',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
    },
  });

  useEffect(() => {
    if (productData?.data) {
      reset({
        ...productData.data,
        categoryId: productData.data.categoryId || '',
        brandId: productData.data.brandId || '',
        vendorId: productData.data.vendorId || '',
      });
    }
  }, [productData, reset]);

  const onSubmit = async (values) => {
    const body = appendFormData(values);
    if (editing) {
      await updateProduct({ resource: 'products', id, body }).unwrap();
    } else {
      await createProduct({ resource: 'products', body }).unwrap();
    }
    navigate('/admin/products');
  };

  const busy = createState.isLoading || updateState.isLoading;
  const error = createState.error || updateState.error;

  return (
    <Stack spacing={3}>
      <AdminPageHeader title={editing ? 'Edit Product' : 'Add Product'} subtitle="Manage product catalog data, stock, SEO and multiple product images." />
      {error && <Alert severity="error">{error.data?.message || 'Product save failed.'}</Alert>}
      <Stack component="form" spacing={3} onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Product Information
            </Typography>
            <Grid container spacing={2}>
              {[
                ['name', 'Product Name'],
                ['sku', 'SKU'],
                ['barcode', 'Barcode'],
                ['slug', 'Slug'],
                ['shortDescription', 'Short Description'],
              ].map(([name, label]) => (
                <Grid item xs={12} md={name === 'shortDescription' ? 12 : 6} key={name}>
                  <Controller name={name} control={control} rules={{ required: ['name', 'sku'].includes(name) }} render={({ field }) => <TextField {...field} label={label} fullWidth />} />
                </Grid>
              ))}
              <Grid item xs={12}>
                <Controller name="description" control={control} render={({ field }) => <TextField {...field} label="Description" multiline rows={4} fullWidth />} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Merchandising
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Controller
                  name="categoryId"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField {...field} label="Category" select fullWidth>
                      {(categories?.data || []).map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="brandId"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Brand" select fullWidth>
                      <MenuItem value="">None</MenuItem>
                      {(brands?.data || []).map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="vendorId"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Vendor" select fullWidth>
                      <MenuItem value="">None</MenuItem>
                      {(vendors?.data || []).map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Pricing, Stock & SEO
            </Typography>
            <Grid container spacing={2}>
              {[
                ['price', 'Price'],
                ['salePrice', 'Sale Price'],
                ['costPrice', 'Cost Price'],
                ['stockQuantity', 'Stock Quantity'],
                ['weight', 'Weight'],
                ['taxPercentage', 'Tax %'],
              ].map(([name, label]) => (
                <Grid item xs={12} md={4} key={name}>
                  <Controller name={name} control={control} rules={{ required: name === 'price' }} render={({ field }) => <TextField {...field} label={label} type="number" fullWidth />} />
                </Grid>
              ))}
              <Grid item xs={12} md={4}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Status" select fullWidth>
                      {statuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField label="Product Images" type="file" inputProps={{ multiple: true, accept: 'image/*' }} {...register('images')} fullWidth />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller name="metaTitle" control={control} render={({ field }) => <TextField {...field} label="Meta Title" fullWidth />} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller name="metaKeywords" control={control} render={({ field }) => <TextField {...field} label="Meta Keywords" fullWidth />} />
              </Grid>
              <Grid item xs={12}>
                <Controller name="metaDescription" control={control} render={({ field }) => <TextField {...field} label="Meta Description" multiline rows={3} fullWidth />} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
          <Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate('/admin/products')}>
            Back
          </Button>
          <Button type="submit" variant="contained" startIcon={<SaveRoundedIcon />} disabled={busy}>
            Save product
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
