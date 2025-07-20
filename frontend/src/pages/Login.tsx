import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Avatar,
  useTheme,
  alpha,
  Divider,
  IconButton,
  InputAdornment,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Toys,
  Lock,
  Email,
  Visibility,
  VisibilityOff,
  LoginRounded,
  Security,
  ChildCare,
  Celebration,
  Stars,
  Favorite,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError('Credenciais inválidas. Verifique seu email e senha.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const floatingIcons = [
    { icon: Toys, top: '10%', left: '5%', delay: 0, color: '#FF6B9D', size: '2rem' },
    { icon: ChildCare, top: '20%', right: '8%', delay: 0.5, color: '#4FACFE', size: '1.8rem' },
    { icon: Celebration, bottom: '25%', left: '8%', delay: 1, color: '#43E97B', size: '2.2rem' },
    { icon: Stars, bottom: '15%', right: '5%', delay: 1.5, color: '#FA709A', size: '1.6rem' },
    { icon: Favorite, top: '60%', left: '3%', delay: 2, color: '#FECA57', size: '1.4rem' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          radial-gradient(ellipse at top left, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
          radial-gradient(ellipse at top right, rgba(79, 172, 254, 0.1) 0%, transparent 50%),
          radial-gradient(ellipse at bottom, rgba(67, 233, 123, 0.08) 0%, transparent 50%),
          linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #cbd5e1 100%)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23e2e8f0" fill-opacity="0.4"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3Ccircle cx="27" cy="27" r="1"/%3E%3Ccircle cx="47" cy="47" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.6,
          animation: 'float 20s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        '@keyframes bounce': {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translateY(0)' },
          '40%, 43%': { transform: 'translateY(-15px)' },
          '70%': { transform: 'translateY(-8px)' },
          '90%': { transform: 'translateY(-3px)' },
        },
        '@keyframes pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        '@keyframes glow': {
          '0%, 100%': { 
            boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
          },
          '50%': { 
            boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.5)}`,
          },
        },
      }}
    >
      {/* Floating Background Icons */}
      {floatingIcons.map((item, index) => (
        <Fade key={index} in={mounted} timeout={1000 + item.delay * 300}>
          <Box
            sx={{
              position: 'absolute',
              top: item.top,
              bottom: item.bottom,
              left: item.left,
              right: item.right,
              opacity: 0.15,
              animation: `bounce 4s ease-in-out infinite ${item.delay}s`,
              zIndex: 0,
            }}
          >
            <item.icon 
              sx={{ 
                fontSize: item.size, 
                color: item.color,
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))',
              }} 
            />
          </Box>
        </Fade>
      ))}

      <Zoom in={mounted} timeout={800}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 600,
            zIndex: 1,
          }}
        >
          {/* Logo e Branding */}
          <Fade in={mounted} timeout={1200}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  width: 70,
                  height: 70,
                  mx: 'auto',
                  mb: 1.5,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #FF6B9D 100%)`,
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                  animation: 'glow 3s ease-in-out infinite',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05) rotate(5deg)',
                  },
                }}
              >
                <Toys sx={{ fontSize: '2.5rem', color: 'white' }} />
              </Avatar>
              
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #FF6B9D 50%, #4FACFE 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5,
                  letterSpacing: '-1px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  fontSize: { xs: '1.75rem', sm: '2rem' },
                }}
              >
                Reino dos Brinquedos
              </Typography>
              
              <Typography
                variant="subtitle1"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 600,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                }}
              >
                ✨ Sistema de Gestão Mágico ✨
              </Typography>
            </Box>
          </Fade>

          {/* Formulário de Login */}
          <Fade in={mounted} timeout={1000}>
            <Paper
              elevation={12}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: 4,
                width: '100%',
                maxWidth: 550,
                background: `
                  linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)
                `,
                backdropFilter: 'blur(20px)',
                border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                mx: 'auto',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, #FF6B9D 50%, #4FACFE 100%)`,
                  animation: 'pulse 2s ease-in-out infinite',
                },
              }}
            >
              {/* Header do Formulário */}
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    width: 50,
                    height: 50,
                    mx: 'auto',
                    mb: 1.5,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha('#FF6B9D', 0.1)} 100%)`,
                    border: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    animation: 'pulse 3s ease-in-out infinite',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <Security sx={{ fontSize: '1.5rem', color: theme.palette.primary.main }} />
                </Avatar>
                
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 0.5,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  }}
                >
                  🎪 Bem-vindo ao Reino! 🎪
                </Typography>
                
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    lineHeight: 1.5,
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  }}
                >
                  Entre com suas credenciais mágicas para começar a diversão
                </Typography>
              </Box>

              {/* Alerta de Erro */}
              {error && (
                <Zoom in={!!error}>
                  <Alert
                    severity="error"
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      border: '1px solid rgba(211, 47, 47, 0.3)',
                      background: 'rgba(253, 237, 237, 0.9)',
                      '& .MuiAlert-message': {
                        fontSize: '0.8rem',
                      },
                    }}
                  >
                    {error}
                  </Alert>
                </Zoom>
              )}

              {/* Formulário */}
              <Box component="form" onSubmit={handleSubmit}>
                {/* Credenciais de Teste */}
                <Box 
                  sx={{ 
                    mb: 2.5, 
                    p: 2, 
                    borderRadius: 2, 
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha('#FF6B9D', 0.05)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'stretch', sm: 'center' },
                    gap: { xs: 1.5, sm: 2 },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        fontSize: '0.85rem',
                        mb: 0.5,
                      }}
                    >
                      🎯 Credenciais de Teste
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.primary,
                        fontSize: '0.8rem',
                        lineHeight: 1.4,
                        fontWeight: 600,
                        background: alpha(theme.palette.primary.main, 0.05),
                        padding: '4px 8px',
                        borderRadius: 1,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      }}
                    >
                      <strong style={{ color: theme.palette.primary.main }}>Email:</strong> admin@loja.com<br />
                      <strong style={{ color: theme.palette.primary.main }}>Senha:</strong> admin123
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setEmail('admin@loja.com');
                      setPassword('admin123');
                    }}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      minWidth: { xs: 'auto', sm: '160px' },
                      height: '40px',
                      '&:hover': {
                        borderColor: theme.palette.primary.dark,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    🚀 Preencher
                  </Button>
                </Box>

                {/* Campos Email e Senha lado a lado no desktop */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: { xs: 0, md: 2 },
                  mb: 2.5,
                }}>
                  <Box sx={{ mb: { xs: 2.5, md: 0 } }}>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        fontWeight: 700,
                        color: theme.palette.text.secondary,
                        fontSize: '0.85rem',
                      }}
                    >
                      📧 Email Mágico
                    </Typography>
                    <TextField
                      fullWidth
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      placeholder="Digite seu email"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ 
                              color: theme.palette.primary.main, 
                              fontSize: '1.2rem',
                              transition: 'all 0.3s ease',
                            }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: alpha('#f8fafc', 0.8),
                          height: 45,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                              borderWidth: 2,
                            },
                            transform: 'translateY(-1px)',
                            boxShadow: `0 3px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'white',
                            transform: 'translateY(-1px)',
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                              borderWidth: 2,
                            },
                          },
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        fontWeight: 700,
                        color: theme.palette.text.secondary,
                        fontSize: '0.85rem',
                      }}
                    >
                      🔐 Senha Secreta
                    </Typography>
                    <TextField
                      fullWidth
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      placeholder="Digite sua senha"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ 
                              color: theme.palette.primary.main, 
                              fontSize: '1.2rem',
                              transition: 'all 0.3s ease',
                            }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="alternar visibilidade da senha"
                              onClick={togglePasswordVisibility}
                              edge="end"
                              disabled={isLoading}
                              sx={{
                                color: theme.palette.text.secondary,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  color: theme.palette.primary.main,
                                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                  transform: 'scale(1.1)',
                                },
                              }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: alpha('#f8fafc', 0.8),
                          height: 45,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                              borderWidth: 2,
                            },
                            transform: 'translateY(-1px)',
                            boxShadow: `0 3px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'white',
                            transform: 'translateY(-1px)',
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                              borderWidth: 2,
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <LoginRounded />}
                  sx={{
                    height: 45,
                    borderRadius: 2,
                    fontSize: '1rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #FF6B9D 50%, #4FACFE 100%)`,
                    backgroundSize: '200% 100%',
                    transition: 'all 0.4s ease',
                    boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                    '&:hover': {
                      backgroundPosition: '100% 0',
                      transform: 'translateY(-2px)',
                      boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                    },
                    '&:active': {
                      transform: 'translateY(-1px)',
                    },
                    '&:disabled': {
                      background: alpha(theme.palette.primary.main, 0.6),
                      color: 'white',
                    },
                  }}
                >
                  {isLoading ? '🎪 Entrando no Reino...' : '🚀 Entrar no Reino Mágico'}
                </Button>
              </Box>

              <Divider sx={{ my: 2, opacity: 0.6 }} />

              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  🎮 © 2024 Reino dos Brinquedos 🎮
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: alpha(theme.palette.text.secondary, 0.7),
                    fontSize: '0.7rem',
                    mt: 0.5,
                  }}
                >
                  Onde a diversão encontra a gestão! 🌟
                </Typography>
              </Box>
            </Paper>
          </Fade>
        </Box>
      </Zoom>
    </Box>
  );
};

export default Login;