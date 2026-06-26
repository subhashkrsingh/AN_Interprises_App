import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { adminNavigation } from '../../app/adminNavigation.js';
import { setSidebarOpen, toggleMode } from '../../features/ui/uiSlice.js';
import { useLogoutMutation } from '../../features/api/adminApi.js';

const drawerWidth = 280;

function SidebarContent({ onNavigate }) {
  const location = useLocation();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 3 }}>
        <Stack>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            RO Commerce
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Admin Console
          </Typography>
        </Stack>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {adminNavigation.map((item) => {
          const Icon = item.icon;
          const selected = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => onNavigate(item.path)}
              sx={{ 
                borderRadius: 2, 
                mb: 0.5, 
                minHeight: 44,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 38 }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ fontSize: 14, fontWeight: 700 }} 
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const compact = useMediaQuery('(max-width: 900px)');
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const mode = useSelector((state) => state.ui.mode);
  const user = useSelector((state) => state.auth.user);
  const [logout] = useLogoutMutation();

  const handleNavigate = (path) => {
    navigate(path);
    dispatch(setSidebarOpen(false));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const drawer = <SidebarContent onNavigate={handleNavigate} />;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ gap: 1.5 }}>
          {compact && (
            <IconButton onClick={() => dispatch(setSidebarOpen(true))} aria-label="Open navigation">
              <MenuRoundedIcon />
            </IconButton>
          )}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={800}>
              Admin Panel
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Manage catalog, orders, customers, reporting and team access
            </Typography>
          </Box>
          <Tooltip title="Toggle theme">
            <IconButton onClick={() => dispatch(toggleMode())} aria-label="Toggle dark mode">
              {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton aria-label="Notifications">
              <Badge color="error" badgeContent={0}>
                <NotificationsRoundedIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Avatar sx={{ width: 36, height: 36 }}>
            {user?.name?.charAt(0) || 'A'}
          </Avatar>
          <Tooltip title="Logout">
            <IconButton onClick={handleLogout} aria-label="Logout">
              <LogoutRoundedIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={() => dispatch(setSidebarOpen(false))}
          ModalProps={{ keepMounted: true }}
          sx={{ 
            display: { xs: 'block', md: 'none' }, 
            '& .MuiDrawer-paper': { 
              width: drawerWidth,
              boxSizing: 'border-box',
            } 
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              width: drawerWidth, 
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1600, mx: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}