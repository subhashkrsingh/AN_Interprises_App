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
import AdminPageHeader from './AdminPageHeader.jsx';

const statuses = ['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED'];

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      sku: '',
      barcode: '',
      slug: '',
      description: '',
      shortDescription: '',
      categoryId: '',
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
    if (editing) {
      // Simulate fetching product data
      reset({
        name: 'LifeGuard RO Purifier',
        sku: 'LG-RO-001',
        barcode: '8901234567890',
        slug: 'lifeguard-ro-purifier',
        description: 'Advanced RO water purifier with 7-stage filtration',
        shortDescription: 'Pure & safe drinking water',
        price: 14999,
        stockQuantity: 25,
        status: 'ACTIVE',
      });
    }
  }, [editing, reset]);

  const onSubmit = async (values) => {
    console.log('Saving product:', values);
    navigate('/admin/products');
  };

  return (
    <Stack spacing={3}>
      <AdminPageHeader 
        title={editing ? 'Edit Product' : 'Add Product'} 
        subtitle="Manage product catalog data, stock, SEO and multiple product images." 
      />
      <Stack component="form" spacing={3} onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Product Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller 
                  name="name" 
                  control={control} 
                  rules={{ required: true }} 
                  render={({ field }) => (
                    <TextField {...field} label="Product Name" fullWidth required />
                  )} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller 
                  name="sku" 
                  control={control} 
                  rules={{ required: true }} 
                  render={({ field }) => (
                    <TextField {...field} label="SKU" fullWidth required />
                  )} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller 
                  name="barcode" 
                  control={control} 
                  render={({ field }) => (
                    <TextField {...field} label="Barcode" fullWidth />
                  )} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller 
                  name="slug" 
                  control={control} 
                  render={({ field }) => (
                    <TextField {...field} label="Slug" fullWidth />
                  )} 
                />
              </Grid>
              <Grid item xs={12}>
                <Controller 
                  name="description" 
                  control={control} 
                  render={({ field }) => (
                    <TextField {...field} label="Description" multiline rows={4} fullWidth />
                  )} 
                />
              </Grid>
              <Grid item xs={12}>
                <Controller 
                  name="shortDescription" 
                  control={control} 
                  render={({ field }) => (
                    <TextField {...field} label="Short Description" fullWidth />
                  )} 
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Pricing & Stock
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Controller 
                  name="price" 
                  control={control} 
                  rules={{ required: true }} 
                  render={({ field }) => (
                    <TextField {...field} label="Price" type="number" fullWidth required />
                  )} 
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller 
                  name="salePrice" 
                  control={control} 
                  render={({ field }) => (
                    <TextField {...field} label="Sale Price" type="number" fullWidth />
                  )} 
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller 
                  name="costPrice" 
                  control={control} 
                  render={({ field }) => (
                    <TextField {...field} label="Cost Price" type="number" fullWidth />
                  )} 
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller 
                  name="stockQuantity" 
                  control={control} 
                  render={({ field }) => (
                    <TextField {...field} label="Stock Quantity" type="number" fullWidth />
                  )} 
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller 
                  name="weight" 
                  control={control} 
                  render={({ field }) => (
                    <TextField {...field} label="Weight (kg)" type="number" fullWidth />
                  )} 
                />
              </Grid>
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
            </Grid>
          </CardContent>
        </Card>

        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
          <Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate('/admin/products')}>
            Back
          </Button>
          <Button type="submit" variant="contained" startIcon={<SaveRoundedIcon />}>
            Save product
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}