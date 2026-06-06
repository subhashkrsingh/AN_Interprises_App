import { Alert, Card, CardContent, Grid, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import AdminPageHeader from '../../components/admin/AdminPageHeader.jsx';
import MetricCard from '../../components/admin/MetricCard.jsx';
import { useDashboardQuery } from '../../features/api/adminApi.js';

const currency = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));

export default function Dashboard() {
  const { data, error } = useDashboardQuery();
  const payload = data?.data;
  const stats = payload?.stats || {};

  const metricCards = [
    { label: 'Total Revenue', value: currency(stats.totalRevenue), icon: AttachMoneyRoundedIcon, tone: 'success' },
    { label: 'Today Sales', value: currency(stats.todaySales), icon: AttachMoneyRoundedIcon, tone: 'secondary' },
    { label: 'Monthly Sales', value: currency(stats.monthlySales), icon: AttachMoneyRoundedIcon, tone: 'primary' },
    { label: 'Total Orders', value: stats.totalOrders || 0, icon: ShoppingCartRoundedIcon, tone: 'primary' },
    { label: 'Customers', value: stats.totalCustomers || 0, icon: PeopleRoundedIcon, tone: 'secondary' },
    { label: 'Products', value: stats.totalProducts || 0, icon: Inventory2RoundedIcon, tone: 'primary' },
    { label: 'Categories', value: stats.totalCategories || 0, icon: CategoryRoundedIcon, tone: 'secondary' },
    { label: 'Vendors', value: stats.totalVendors || 0, icon: StorefrontRoundedIcon, tone: 'primary' },
    { label: 'Pending', value: stats.pendingOrders || 0, icon: HourglassTopRoundedIcon, tone: 'warning' },
    { label: 'Processing', value: stats.processingOrders || 0, icon: LocalShippingRoundedIcon, tone: 'primary' },
    { label: 'Delivered', value: stats.deliveredOrders || 0, icon: LocalShippingRoundedIcon, tone: 'success' },
    { label: 'Cancelled', value: stats.cancelledOrders || 0, icon: CancelRoundedIcon, tone: 'error' },
  ];

  return (
    <Stack spacing={3}>
      <AdminPageHeader title="Dashboard" subtitle="Real-time commerce health, order flow, revenue, customers and stock alerts." />
      {error && <Alert severity="warning">Dashboard API is not available yet. Seed the database and start the backend.</Alert>}
      <Grid container spacing={2}>
        {metricCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} xl={3} key={card.label}>
            <MetricCard {...card} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Revenue Graph
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={payload?.charts?.revenueGraph || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip formatter={(value) => currency(value)} />
                  <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="#2563eb" fillOpacity={0.18} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Order Trend
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={payload?.charts?.orderTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={7}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Latest Orders
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Order</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(payload?.latestOrders || []).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>{order.customer?.email}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell align="right">{currency(order.grandTotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Low Stock Products
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell align="right">Stock</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(payload?.lowStockProducts || []).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product?.name}</TableCell>
                    <TableCell>{item.product?.sku}</TableCell>
                    <TableCell align="right">{item.stockQuantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
