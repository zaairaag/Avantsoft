import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Divider,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Dashboard,
  People,
  ShoppingCart,
  Menu as MenuIcon,
  Logout,
  Toys,
  Api,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationCenter from './NotificationCenter';
import GlobalSearch from './GlobalSearch';
import AccountMenu from './AccountMenu';

interface LayoutProps {
  children: React.ReactNode;
}

const SIDEBAR_WIDTH = 280;
const MOBILE_SIDEBAR_WIDTH = 260;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/',
      color: theme.palette.primary.main,
      description: 'Visão geral da loja',
    },
    {
      text: 'Clientes',
      icon: <People />,
      path: '/clientes',
      color: '#22c55e',
      description: 'Cadastro de clientes',
    },
    {
      text: 'Vendas',
      icon: <ShoppingCart />,
      path: '/vendas',
      color: '#f59e0b',
      description: 'Vendas de brinquedos',
    },
    {
      text: 'API Docs',
      icon: <Api />,
      path: '/api-docs',
      color: '#8b5cf6',
      description: 'Documentação da API',
    },
  ];

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)',
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Logo/Header */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          borderBottom: `1px solid ${theme.palette.divider}`,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Avatar
            sx={{
              width: { xs: 48, sm: 64 },
              height: { xs: 48, sm: 64 },
              mx: 'auto',
              mb: { xs: 1.5, sm: 2 },
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.2)',
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              fontWeight: 'bold',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}
          >
            <Toys fontSize={mobileOpen ? 'medium' : 'large'} />
          </Avatar>
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 700,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              letterSpacing: '-0.025em',
              mb: 0.5,
            }}
          >
            Reino dos Brinquedos
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              fontWeight: 500,
            }}
          >
            Sistema de Gestão
          </Typography>
        </Box>
      </Box>



      {/* Menu Items */}
      <Box sx={{ flex: 1, px: { xs: 1, sm: 2 }, py: 2 }}>
        <Typography
          variant="overline"
          sx={{
            px: { xs: 1.5, sm: 2 },
            color: theme.palette.text.secondary,
            fontWeight: 600,
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            letterSpacing: '0.08em',
            mb: 2,
            display: 'block',
          }}
        >
          Navegação Principal
        </Typography>
        <List sx={{ p: 0 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    // Fecha o drawer mobile após navegação
                    if (mobileOpen) {
                      setMobileOpen(false);
                    }
                  }}
                  sx={{
                    borderRadius: 2,
                    mx: { xs: 0.5, sm: 1 },
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 1.2, sm: 1.5 },
                    background: isActive
                      ? alpha(item.color, 0.1)
                      : 'transparent',
                    border: isActive
                      ? `1px solid ${alpha(item.color, 0.2)}`
                      : '1px solid transparent',
                    color: isActive ? item.color : theme.palette.text.secondary,
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      background: alpha(item.color, 0.08),
                      color: item.color,
                      transform: 'translateX(4px)',
                    },
                    '&::before': isActive
                      ? {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 4,
                          height: '60%',
                          background: item.color,
                          borderRadius: '0 2px 2px 0',
                        }
                      : {},
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: 'inherit',
                      minWidth: { xs: 32, sm: 40 },
                      '& .MuiSvgIcon-root': {
                        fontSize: { xs: '1.1rem', sm: '1.25rem' },
                      },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    secondary={!isActive && !mobileOpen ? item.description : undefined}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 500,
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      letterSpacing: '-0.025em',
                    }}
                    secondaryTypographyProps={{
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      color: theme.palette.text.secondary,
                      display: { xs: 'none', sm: 'block' },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Bottom Actions */}
      <Box sx={{ p: { xs: 1.5, sm: 2 }, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Logout sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }} />}
          onClick={() => {
            handleLogout();
            // Fecha o drawer mobile após logout
            if (mobileOpen) {
              setMobileOpen(false);
            }
          }}
          sx={{
            color: theme.palette.text.secondary,
            borderColor: theme.palette.divider,
            py: { xs: 1.2, sm: 1.5 },
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              borderColor: theme.palette.error.main,
              color: theme.palette.error.main,
              backgroundColor: alpha(theme.palette.error.main, 0.04),
            },
            transition: 'all 0.2s ease',
          }}
        >
          Sair do Sistema
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
        fontFamily: theme.typography.fontFamily,
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { sm: SIDEBAR_WIDTH },
          flexShrink: { sm: 0 },
          zIndex: theme.zIndex.drawer + 2,
        }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ 
            keepMounted: true,
            sx: {
              '& .MuiBackdrop-root': {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: MOBILE_SIDEBAR_WIDTH,
              border: 'none',
              boxShadow: '8px 0 32px rgba(0,0,0,0.12)',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: SIDEBAR_WIDTH,
              position: 'fixed',
              height: '100vh',
              border: 'none',
              boxShadow: '4px 0 24px rgba(0,0,0,0.08)',
              zIndex: theme.zIndex.drawer,
              top: 0,
              left: 0,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        {/* Premium Header - Desktop */}
        <Paper
          elevation={0}
          sx={{
            display: { xs: 'none', sm: 'block' },
            position: 'sticky',
            top: 0,
            zIndex: theme.zIndex.appBar,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${theme.palette.divider}`,
            borderRadius: 0,
          }}
        >
          <Box
            sx={{
              px: 4,
              py: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: 72,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  fontSize: '1.75rem',
                  letterSpacing: '-0.025em',
                  mb: 0.5,
                }}
              >
                {menuItems.find((item) => item.path === location.pathname)
                  ?.text || 'Reino dos Brinquedos'}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                {new Date().toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <GlobalSearch />

              <NotificationCenter />

              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: 1, borderColor: theme.palette.divider }}
              />

              <AccountMenu />
            </Box>
          </Box>
        </Paper>

        {/* Mobile Header */}
        <AppBar
          position="fixed"
          sx={{
            display: { xs: 'block', sm: 'none' },
            zIndex: theme.zIndex.drawer + 1,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
            color: theme.palette.text.primary,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Toolbar sx={{ minHeight: '56px !important', px: 2 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 1.5,
                p: 1,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              <MenuIcon sx={{ fontSize: '1.25rem' }} />
            </IconButton>

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: 0.8,
              }}
            >
              <Toys sx={{ fontSize: '1.125rem' }} />
              Reino dos Brinquedos
            </Typography>

            <NotificationCenter />
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, #f1f5f9 100%)`,
            minHeight: '100vh',
            position: 'relative',
            mt: { xs: 8, sm: 0 },
            ml: { xs: 0, sm: `${SIDEBAR_WIDTH}px` },
            width: { xs: '100%', sm: `calc(100% - ${SIDEBAR_WIDTH}px)` },
            overflowX: 'auto',
          }}
        >
          <Box
            sx={{
              py: { xs: 3, sm: 4 },
              px: { xs: 2, sm: 3, md: 4 },
              position: 'relative',
              zIndex: 1,
              width: '100%',
              margin: 0,
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
