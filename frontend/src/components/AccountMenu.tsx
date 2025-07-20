import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Chip,
  useTheme,
  alpha,
  Fade,
  Zoom,
  keyframes,
} from '@mui/material';
import {
  KeyboardArrowDown,
  Settings,
  Edit,
  AdminPanelSettings,
  AccountCircle,
  SupportAgent,
  Lock,
  ExitToApp,
  Star,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { useNavigate } from 'react-router-dom';
import SupportCenter from './SupportCenter';

// Animações personalizadas
const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

interface AccountMenuProps {
  showText?: boolean;
}

const AccountMenu: React.FC<AccountMenuProps> = ({ showText = true }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const { user, logout } = useAuth();
  const { settings, updateSettings, resetSettings } = useSettings();
  const navigate = useNavigate();
  const theme = useTheme();

  // Estados do formulário de perfil
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: '',
  });

  // Estados locais para o formulário de configurações
  const [localSettings, setLocalSettings] = useState(settings);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const handleProfileSave = () => {
    console.log('Salvando perfil:', profileForm);
    setProfileDialogOpen(false);
  };

  const handleSettingsSave = () => {
    updateSettings(localSettings);
    setSettingsDialogOpen(false);
  };

  const handleSettingsOpen = () => {
    setLocalSettings(settings);
    setSettingsDialogOpen(true);
    handleMenuClose();
  };

  const handleSettingsReset = () => {
    resetSettings();
    setLocalSettings(settings);
  };

  const menuItems = [
    {
      icon: <AccountCircle sx={{ fontSize: '1.25rem' }} />,
      label: 'Meu Perfil',
      description: 'Editar informações pessoais',
      color: theme.palette.primary.main,
      action: () => {
        setProfileDialogOpen(true);
        handleMenuClose();
      },
    },
    {
      icon: <Settings sx={{ fontSize: '1.25rem' }} />,
      label: 'Configurações',
      description: 'Personalizar preferências',
      color: '#22c55e',
      action: handleSettingsOpen,
    },
    {
      icon: <Lock sx={{ fontSize: '1.25rem' }} />,
      label: 'Segurança',
      description: 'Senhas e autenticação',
      color: '#f59e0b',
      action: () => {
        console.log('Abrir configurações de segurança');
        handleMenuClose();
      },
    },
    {
      icon: <SupportAgent sx={{ fontSize: '1.25rem' }} />,
      label: 'Ajuda & Suporte',
      description: 'Central de atendimento',
      color: '#8b5cf6',
      action: () => {
        setSupportDialogOpen(true);
        handleMenuClose();
      },
    },
  ];

  return (
    <>
      <Box
        onClick={handleMenuOpen}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          cursor: 'pointer',
          p: 1.5,
          borderRadius: 3,
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          position: 'relative',
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette.primary.main, 0.08)} 0%, 
            ${alpha('#FF6B9D', 0.05)} 50%, 
            ${alpha('#4FACFE', 0.08)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          backdropFilter: 'blur(10px)',
          '&:hover': {
            background: `linear-gradient(135deg, 
              ${alpha(theme.palette.primary.main, 0.15)} 0%, 
              ${alpha('#FF6B9D', 0.12)} 50%, 
              ${alpha('#4FACFE', 0.15)} 100%)`,
            borderColor: theme.palette.primary.main,
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.25)}`,

          },
        }}
      >
        <Avatar
          className="account-avatar"
          sx={{
            width: 44,
            height: 44,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #FF6B9D 100%)`,
            fontWeight: 700,
            fontSize: '1rem',
            border: `3px solid ${alpha('#ffffff', 0.2)}`,
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            transition: 'all 0.3s ease',
          }}
        >
          {user?.name?.charAt(0)?.toUpperCase() || 'A'}
        </Avatar>
        
        {showText && (
          <Box sx={{ display: { xs: 'none', md: 'block' }, flex: 1 }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                fontSize: '0.9rem',
                lineHeight: 1.3,
                mb: 0.2,
              }}
            >
              {user?.name || 'Administrador'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AdminPanelSettings sx={{ fontSize: '0.75rem', color: theme.palette.primary.main }} />
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Administrador
              </Typography>
            </Box>
          </Box>
        )}
        
        <IconButton
          size="small"
          sx={{ 
            color: theme.palette.primary.main,
            ml: showText ? 0 : -0.5,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              transform: 'rotate(180deg)',
            },
          }}
        >
          <KeyboardArrowDown fontSize="small" />
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
        transitionDuration={300}
        PaperProps={{
          sx: {
            width: 320,
            borderRadius: 4,
            background: `linear-gradient(135deg, 
              rgba(255, 255, 255, 0.95) 0%, 
              rgba(255, 255, 255, 0.9) 100%)`,
            backdropFilter: 'blur(20px)',
            boxShadow: `0 20px 60px ${alpha(theme.palette.primary.main, 0.15)}`,
            border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            mt: 1.5,
            position: 'relative',
            overflow: 'visible',
            zIndex: 9999,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, 
                ${theme.palette.primary.main}, 
                #FF6B9D, 
                #4FACFE, 
                ${theme.palette.primary.main})`,
              backgroundSize: '300% 100%',
              animation: `${shimmer} 3s infinite`,
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header Premium do menu */}
        <Box 
          sx={{ 
            p: 3, 
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            background: `linear-gradient(135deg, 
              ${alpha(theme.palette.primary.main, 0.05)} 0%, 
              ${alpha('#FF6B9D', 0.03)} 100%)`,
            position: 'relative',
            overflow: 'visible',
            zIndex: 1,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 900, 
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #FF6B9D 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '1.4rem',
                lineHeight: 1.2,
                mb: 0.5,
                letterSpacing: '-0.5px',
              }}
            >
              {user?.name || 'Administrador'}
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: theme.palette.text.secondary, 
                fontSize: '0.9rem',
                mb: 1.5,
                fontWeight: 500,
              }}
            >
              {user?.email || 'admin@loja.com'}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<Star sx={{ fontSize: '0.8rem' }} />}
                label="Admin Premium"
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, #FF6B9D)`,
                  color: 'white',
                  fontSize: '0.75rem',
                  height: 28,
                  fontWeight: 700,
                  borderRadius: 3,
                  px: 1,
                  '& .MuiChip-icon': {
                    color: 'white',
                  },
                }}
              />
              <Chip
                icon={<AdminPanelSettings sx={{ fontSize: '0.8rem' }} />}
                label="Sistema Avantsoft"
                sx={{
                  background: `linear-gradient(135deg, #22c55e, #16a34a)`,
                  color: 'white',
                  fontSize: '0.75rem',
                  height: 28,
                  fontWeight: 700,
                  borderRadius: 3,
                  px: 1,
                  '& .MuiChip-icon': {
                    color: 'white',
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Itens do menu modernizados */}
        <Box sx={{ py: 1 }}>
          {menuItems.map((item, index) => (
            <Zoom 
              key={index} 
              in={Boolean(anchorEl)} 
              timeout={200 + (index * 100)}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <MenuItem
                onClick={item.action}
                sx={{
                  py: 2,
                  px: 3,
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '4px',
                    height: '100%',
                    background: `linear-gradient(to bottom, ${item.color}, ${alpha(item.color, 0.5)})`,
                    transform: 'scaleY(0)',
                    transformOrigin: 'center',
                    transition: 'transform 0.3s ease',
                  },
                  '&:hover': {
                    backgroundColor: alpha(item.color, 0.08),
                    transform: 'translateX(8px)',
                    boxShadow: `0 4px 12px ${alpha(item.color, 0.2)}`,
                    '&::before': {
                      transform: 'scaleY(1)',
                    },
                    '& .menu-icon': {
                      color: item.color,
                      transform: 'scale(1.2)',
                    },
                  },
                }}
              >
                <ListItemIcon 
                  className="menu-icon"
                  sx={{ 
                    color: alpha(item.color, 0.7),
                    minWidth: 40,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  secondary={item.description}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                  }}
                  secondaryTypographyProps={{
                    fontSize: '0.75rem',
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                  }}
                />
              </MenuItem>
            </Zoom>
          ))}
        </Box>

        <Divider sx={{ my: 1, opacity: 0.6 }} />

        {/* Logout Premium */}
        <Box sx={{ p: 1 }}>
          <MenuItem
            onClick={handleLogout}
            sx={{
              py: 2,
              px: 3,
              mx: 1,
              borderRadius: 2,
              background: `linear-gradient(135deg, 
                ${alpha(theme.palette.error.main, 0.05)} 0%, 
                ${alpha('#ff6b9d', 0.03)} 100%)`,
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
              color: theme.palette.error.main,
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              '&:hover': {
                background: `linear-gradient(135deg, 
                  ${alpha(theme.palette.error.main, 0.1)} 0%, 
                  ${alpha('#ff6b9d', 0.08)} 100%)`,
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 20px ${alpha(theme.palette.error.main, 0.2)}`,
                '& .logout-icon': {
                  transform: 'rotate(-15deg) scale(1.1)',
                },
              },
            }}
          >
            <ListItemIcon 
              className="logout-icon"
              sx={{ 
                color: 'inherit',
                minWidth: 40,
                transition: 'all 0.3s ease',
              }}
            >
              <ExitToApp sx={{ fontSize: '1.25rem' }} />
            </ListItemIcon>
            <ListItemText
              primary="Sair do Sistema"
              secondary="Logout seguro"
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
              secondaryTypographyProps={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: alpha(theme.palette.error.main, 0.7),
              }}
            />
          </MenuItem>
        </Box>
      </Menu>

      {/* Dialog de Perfil */}
      <Dialog
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
              <Edit />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Editar Perfil
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Nome Completo"
              fullWidth
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
            />
            <TextField
              label="Telefone"
              fullWidth
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              placeholder="(11) 99999-9999"
            />
            <TextField
              label="Biografia"
              multiline
              rows={3}
              fullWidth
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              placeholder="Conte um pouco sobre você..."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button onClick={() => setProfileDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleProfileSave}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            }}
          >
            Salvar Alterações
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Configurações */}
      <Dialog
        open={settingsDialogOpen}
        onClose={() => setSettingsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
              <Settings />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Configurações
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Notificações
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Notificações push</Typography>
                  <Button
                    size="small"
                    variant={localSettings.notifications ? 'contained' : 'outlined'}
                    onClick={() => setLocalSettings({ ...localSettings, notifications: !localSettings.notifications })}
                  >
                    {localSettings.notifications ? 'Ativado' : 'Desativado'}
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Alertas por email</Typography>
                  <Button
                    size="small"
                    variant={localSettings.emailAlerts ? 'contained' : 'outlined'}
                    onClick={() => setLocalSettings({ ...localSettings, emailAlerts: !localSettings.emailAlerts })}
                  >
                    {localSettings.emailAlerts ? 'Ativado' : 'Desativado'}
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Salvamento automático</Typography>
                  <Button
                    size="small"
                    variant={localSettings.autoSave ? 'contained' : 'outlined'}
                    onClick={() => setLocalSettings({ ...localSettings, autoSave: !localSettings.autoSave })}
                  >
                    {localSettings.autoSave ? 'Ativado' : 'Desativado'}
                  </Button>
                </Box>
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Aparência
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Modo escuro</Typography>
                <Button
                  size="small"
                  variant={localSettings.darkMode ? 'contained' : 'outlined'}
                  onClick={() => setLocalSettings({ ...localSettings, darkMode: !localSettings.darkMode })}
                >
                  {localSettings.darkMode ? 'Ativado' : 'Desativado'}
                </Button>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Visualização compacta</Typography>
                <Button
                  size="small"
                  variant={localSettings.compactView ? 'contained' : 'outlined'}
                  onClick={() => setLocalSettings({ ...localSettings, compactView: !localSettings.compactView })}
                >
                  {localSettings.compactView ? 'Ativado' : 'Desativado'}
                </Button>
              </Box>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Idioma
              </Typography>
              <TextField
                select
                fullWidth
                value={localSettings.language}
                onChange={(e) => setLocalSettings({ ...localSettings, language: e.target.value })}
                SelectProps={{ native: true }}
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </TextField>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}`, justifyContent: 'space-between' }}>
          <Button
            onClick={handleSettingsReset}
            sx={{ color: theme.palette.warning.main }}
          >
            Restaurar Padrões
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={() => setSettingsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleSettingsSave}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              }}
            >
              Salvar Configurações
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Support Center Dialog */}
      <SupportCenter
        open={supportDialogOpen}
        onClose={() => setSupportDialogOpen(false)}
      />
    </>
  );
};

export default AccountMenu;
