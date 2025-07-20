import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,

  Button,
  Divider,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Notifications,
  ShoppingCart,
  Person,
  TrendingUp,
  Warning,
  CheckCircle,
  Info,
  Close,
  MarkEmailRead,
} from '@mui/icons-material';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationCenterProps {
  onNotificationClick?: (notification: Notification) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ onNotificationClick }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const theme = useTheme();

  // Simular notificações iniciais
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'Nova venda realizada!',
        message: 'Maria Silva comprou um conjunto de blocos educativos por R$ 89,90',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min atrás
        read: false,
        icon: <ShoppingCart />,
        action: {
          label: 'Ver detalhes',
          onClick: () => console.log('Ver venda'),
        },
      },
      {
        id: '2',
        type: 'info',
        title: 'Novo cliente cadastrado',
        message: 'João Santos se cadastrou no sistema',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min atrás
        read: false,
        icon: <Person />,
      },
      {
        id: '3',
        type: 'warning',
        title: 'Meta mensal em risco',
        message: 'Você está 15% abaixo da meta de vendas deste mês',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h atrás
        read: true,
        icon: <TrendingUp />,
        action: {
          label: 'Ver relatório',
          onClick: () => console.log('Ver relatório'),
        },
      },
    ];
    setNotifications(mockNotifications);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const open = Boolean(anchorEl);

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return theme.palette.success.main;
      case 'warning': return theme.palette.warning.main;
      case 'error': return theme.palette.error.main;
      default: return theme.palette.info.main;
    }
  };

  const getNotificationIcon = (notification: Notification) => {
    if (notification.icon) return notification.icon;
    
    switch (notification.type) {
      case 'success': return <CheckCircle />;
      case 'warning': return <Warning />;
      case 'error': return <Close />;
      default: return <Info />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: theme.palette.text.secondary,
          '&:hover': {
            backgroundColor: alpha(theme.palette.warning.main, 0.08),
            color: theme.palette.warning.main,
          },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.75rem',
              minWidth: 18,
              height: 18,
            },
          }}
        >
          <Notifications />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
            borderRadius: 3,
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            border: `1px solid ${theme.palette.divider}`,
            mt: 1,
          },
        }}
      >
        <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
              Notificações
            </Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                startIcon={<MarkEmailRead />}
                onClick={markAllAsRead}
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: '0.75rem',
                  textTransform: 'none',
                }}
              >
                Marcar todas como lidas
              </Button>
            )}
          </Stack>
          {unreadCount > 0 && (
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
              {unreadCount} nova{unreadCount > 1 ? 's' : ''} notificaç{unreadCount > 1 ? 'ões' : 'ão'}
            </Typography>
          )}
        </Box>

        <List sx={{ p: 0, maxHeight: 350, overflow: 'auto' }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Nenhuma notificação no momento
              </Typography>
            </Box>
          ) : (
            notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    py: 2,
                    px: 3,
                    backgroundColor: notification.read 
                      ? 'transparent' 
                      : alpha(getNotificationColor(notification.type), 0.05),
                    borderLeft: `4px solid ${notification.read 
                      ? 'transparent' 
                      : getNotificationColor(notification.type)}`,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                  onClick={() => {
                    markAsRead(notification.id);
                    onNotificationClick?.(notification);
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: alpha(getNotificationColor(notification.type), 0.1),
                        color: getNotificationColor(notification.type),
                        width: 40,
                        height: 40,
                      }}
                    >
                      {getNotificationIcon(notification)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: notification.read ? 500 : 600,
                            color: theme.palette.text.primary,
                            fontSize: '0.875rem',
                          }}
                        >
                          {notification.title}
                        </Typography>
                        {!notification.read && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: getNotificationColor(notification.type),
                            }}
                          />
                        )}
                      </Stack>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: '0.8rem',
                            lineHeight: 1.4,
                            mb: 1,
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography
                            variant="caption"
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: '0.75rem',
                            }}
                          >
                            {formatTimestamp(notification.timestamp)}
                          </Typography>
                          {notification.action && (
                            <Button
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                notification.action!.onClick();
                              }}
                              sx={{
                                fontSize: '0.7rem',
                                textTransform: 'none',
                                color: getNotificationColor(notification.type),
                              }}
                            >
                              {notification.action.label}
                            </Button>
                          )}
                        </Stack>
                      </Box>
                    }
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                    sx={{
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        color: theme.palette.error.main,
                      },
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </List>

        {notifications.length > 0 && (
          <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
            <Button
              fullWidth
              variant="text"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.875rem',
                textTransform: 'none',
              }}
              onClick={handleClose}
            >
              Ver todas as notificações
            </Button>
          </Box>
        )}
      </Popover>
    </>
  );
};

export default NotificationCenter;
