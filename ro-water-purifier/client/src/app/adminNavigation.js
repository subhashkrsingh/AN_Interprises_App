import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import BrandingWatermarkRoundedIcon from '@mui/icons-material/BrandingWatermarkRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import WarehouseRoundedIcon from '@mui/icons-material/WarehouseRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';

export const adminNavigation = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: DashboardRoundedIcon },
  { label: 'Products', path: '/admin/products', icon: Inventory2RoundedIcon },
  { label: 'Categories', path: '/admin/categories', icon: CategoryRoundedIcon },
  { label: 'Brands', path: '/admin/brands', icon: BrandingWatermarkRoundedIcon },
  { label: 'Orders', path: '/admin/orders', icon: ReceiptLongRoundedIcon },
  { label: 'Customers', path: '/admin/customers', icon: PeopleRoundedIcon },
  { label: 'Inventory', path: '/admin/inventory', icon: WarehouseRoundedIcon },
  { label: 'Coupons', path: '/admin/coupons', icon: LocalOfferRoundedIcon },
  { label: 'Banners', path: '/admin/banners', icon: CampaignRoundedIcon },
  { label: 'CMS Pages', path: '/admin/cms-pages', icon: ArticleRoundedIcon },
  { label: 'Reviews', path: '/admin/reviews', icon: RateReviewRoundedIcon },
  { label: 'Reports', path: '/admin/reports', icon: AssessmentRoundedIcon },
  { label: 'Notifications', path: '/admin/notifications', icon: NotificationsRoundedIcon },
  { label: 'Users', path: '/admin/users', icon: AdminPanelSettingsRoundedIcon },
  { label: 'Roles', path: '/admin/roles', icon: SecurityRoundedIcon },
  { label: 'Permissions', path: '/admin/permissions', icon: VpnKeyRoundedIcon },
  { label: 'Settings', path: '/admin/settings', icon: SettingsRoundedIcon },
  { label: 'Activity Logs', path: '/admin/activity-logs', icon: HistoryRoundedIcon },
];
