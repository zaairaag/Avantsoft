import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  Paper,
  useTheme,
} from '@mui/material';
import { Dashboard, People, ShoppingCart, TrendingUp } from '@mui/icons-material';

const ThemeTest: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Typography variant="h3" sx={{ mb: 4, color: 'primary.main' }}>
        🎨 Teste do Tema Premium
      </Typography>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {/* Card de Cores Primárias */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Cores Primárias
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ 
                width: 60, 
                height: 60, 
                bgcolor: 'primary.main', 
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                Primary
              </Box>
              <Box sx={{ 
                width: 60, 
                height: 60, 
                bgcolor: 'secondary.main', 
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                Secondary
              </Box>
              <Box sx={{ 
                width: 60, 
                height: 60, 
                bgcolor: 'success.main', 
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                Success
              </Box>
              <Box sx={{ 
                width: 60, 
                height: 60, 
                bgcolor: 'warning.main', 
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                Warning
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Card de Botões */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Botões Premium
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
              <Button variant="contained" color="primary">
                Botão Primário
              </Button>
              <Button variant="outlined" color="secondary">
                Botão Secundário
              </Button>
              <Button variant="text" color="success">
                Botão Texto
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Card de Avatars e Chips */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Avatars e Chips
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <Dashboard />
              </Avatar>
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                <People />
              </Avatar>
              <Avatar sx={{ bgcolor: 'success.main' }}>
                <ShoppingCart />
              </Avatar>
              <Avatar sx={{ bgcolor: 'warning.main' }}>
                <TrendingUp />
              </Avatar>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
              <Chip label="Admin" color="primary" />
              <Chip label="User" color="secondary" />
              <Chip label="Active" color="success" />
              <Chip label="Pending" color="warning" />
            </Box>
          </CardContent>
        </Card>

        {/* Card de Tipografia */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Tipografia Inter
            </Typography>
            <Typography variant="h1" sx={{ fontSize: '2rem', mb: 1 }}>
              Heading 1
            </Typography>
            <Typography variant="h2" sx={{ fontSize: '1.5rem', mb: 1 }}>
              Heading 2
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Body 1 - Lorem ipsum dolor sit amet consectetur.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Body 2 - Texto secundário com fonte Inter.
            </Typography>
          </CardContent>
        </Card>

        {/* Card de Gradientes */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Gradientes Premium
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
              <Paper sx={{ 
                p: 2, 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                textAlign: 'center'
              }}>
                Gradiente Primário
              </Paper>
              <Paper sx={{ 
                p: 2, 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                textAlign: 'center'
              }}>
                Gradiente Sucesso
              </Paper>
              <Paper sx={{ 
                p: 2, 
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                textAlign: 'center'
              }}>
                Gradiente Warning
              </Paper>
            </Box>
          </CardContent>
        </Card>

        {/* Card de Informações do Tema */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Informações do Tema
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Fonte:</strong> {theme.typography.fontFamily}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Cor Primária:</strong> {theme.palette.primary.main}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Cor Secundária:</strong> {theme.palette.secondary.main}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Border Radius:</strong> {theme.shape.borderRadius}px
            </Typography>
            <Typography variant="body2">
              <strong>Modo:</strong> {theme.palette.mode}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ThemeTest;
