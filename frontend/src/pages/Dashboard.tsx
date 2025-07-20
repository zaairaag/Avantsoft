import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Avatar,
  Chip,
  Paper,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import {
  AttachMoney,
  People,
  ShoppingCart,
  ArrowUpward,
  ArrowDownward,
  BusinessCenter,
} from '@mui/icons-material';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
} from 'recharts';
import Layout from '../components/Layout';
import api, { vendaService } from '../services/api';

interface StatCard {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  subtitle?: string;
  change?: string;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [estatisticas, setEstatisticas] = useState<any>(null);
  const [dailySalesData, setDailySalesData] = useState([
    { data: '14/07', valor: 1200 },
    { data: '15/07', valor: 800 },
    { data: '16/07', valor: 1500 },
    { data: '17/07', valor: 950 },
    { data: '18/07', valor: 2100 },
    { data: '19/07', valor: 1750 },
    { data: '20/07', valor: 1320 },
  ]);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [estadisticasResponse, vendasPorDiaResponse] = await Promise.all([
          api.get('/vendas/stats').catch(() => ({ data: null })),
          vendaService.obterVendasPorDia().catch(() => [])
        ]);
        
        setEstatisticas(estadisticasResponse.data);
        if (vendasPorDiaResponse.length > 0) {
          setDailySalesData(vendasPorDiaResponse);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
            <Typography variant="body2" color="text.secondary">
              Carregando dados empresariais...
            </Typography>
          </Stack>
        </Box>
      </Layout>
    );
  }

  const statCards: StatCard[] = [
    {
      title: 'Vendas Hoje',
      value: `R$ ${estatisticas?.totalDia?.toFixed(2).replace('.', ',') || '1.247,90'}`,
      icon: <AttachMoney />,
      color: theme.palette.primary.main,
      trend: 12.5,
      subtitle: 'vs ontem',
      change: '+12.5%',
    },
    {
      title: 'Cliente VIP',
      value: estatisticas?.maiorVolume?.cliente || 'Maria Silva',
      icon: <BusinessCenter />,
      color: theme.palette.success.main,
      trend: 8.2,
      subtitle: 'maior comprador',
      change: '+8.2%',
    },
    {
      title: 'Clientes Cadastrados',
      value: '1,234',
      icon: <People />,
      color: '#f59e0b',
      trend: -2.1,
      subtitle: 'clientes ativos',
      change: '-2.1%',
    },
    {
      title: 'Brinquedos Vendidos',
      value: '47',
      icon: <ShoppingCart />,
      color: '#8b5cf6',
      trend: 15.3,
      subtitle: 'hoje',
      change: '+15.3%',
    },
  ];

  const salesData = [
    { name: 'Jan', receita: 40000, clientes: 240, meta: 35000 },
    { name: 'Fev', receita: 30000, clientes: 139, meta: 32000 },
    { name: 'Mar', receita: 20000, clientes: 980, meta: 28000 },
    { name: 'Abr', receita: 27800, clientes: 390, meta: 30000 },
    { name: 'Mai', receita: 18900, clientes: 480, meta: 25000 },
    { name: 'Jun', receita: 23900, clientes: 380, meta: 26000 },
  ];

  // Dados de vendas por dia movidos para cima como estado

  const categoryData = [
    { name: 'Brinquedos Educativos', value: 400, color: theme.palette.primary.main },
    { name: 'Jogos e Quebra-cabeças', value: 300, color: theme.palette.success.main },
    { name: 'Bonecas e Acessórios', value: 200, color: '#f59e0b' },
    { name: 'Carrinhos e Veículos', value: 100, color: '#8b5cf6' },
  ];

  return (
    <Layout>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 1,
                fontSize: { xs: '1.75rem', md: '2.125rem' },
              }}
            >
              Painel Executivo
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '1rem',
                fontWeight: 500,
              }}
            >
              Acompanhe o desempenho da sua loja de brinquedos
            </Typography>
          </Box>
          <Chip
            label="Atualizado agora"
            color="success"
            size="small"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              display: { xs: 'none', sm: 'flex' },
            }}
          />
        </Box>
      </Box>

      {/* KPI Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 3,
          mb: 4,
        }}
      >
        {statCards.map((card, index) => (
          <Card
            key={index}
              sx={{
                background: `linear-gradient(135deg, ${alpha(card.color, 0.08)} 0%, ${alpha(card.color, 0.04)} 100%)`,
                border: `1px solid ${alpha(card.color, 0.12)}`,
                borderRadius: 3,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 12px 24px ${alpha(card.color, 0.15)}`,
                  '& .stat-icon': {
                    transform: 'rotate(5deg) scale(1.05)',
                  },
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: card.color,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    mb: 3,
                  }}
                >
                  <Avatar
                    className="stat-icon"
                    sx={{
                      bgcolor: card.color,
                      width: 56,
                      height: 56,
                      transition: 'transform 0.3s ease',
                      boxShadow: `0 8px 16px ${alpha(card.color, 0.3)}`,
                    }}
                  >
                    {card.icon}
                  </Avatar>
                  {card.trend && (
                    <Chip
                      icon={card.trend > 0 ? <ArrowUpward /> : <ArrowDownward />}
                      label={card.change}
                      size="small"
                      sx={{
                        bgcolor: card.trend > 0 ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                        color: card.trend > 0 ? theme.palette.success.main : theme.palette.error.main,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        border: `1px solid ${card.trend > 0 ? alpha(theme.palette.success.main, 0.2) : alpha(theme.palette.error.main, 0.2)}`,
                      }}
                    />
                  )}
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 1,
                    fontSize: '2rem',
                  }}
                >
                  {card.value}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.text.primary,
                    mb: 0.5,
                    fontWeight: 600,
                    fontSize: '1rem',
                  }}
                >
                  {card.title}
                </Typography>
                {card.subtitle && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: '0.875rem',
                    }}
                  >
                    {card.subtitle}
                  </Typography>
                )}
              </CardContent>
            </Card>
        ))}
      </Box>

      {/* Daily Sales Chart */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
          mb: 3,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 1,
            }}
          >
            Vendas de Brinquedos (Últimos 7 dias)
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
            }}
          >
            Acompanhamento diário das vendas de brinquedos da loja
          </Typography>
        </Box>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailySalesData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey="data" 
              stroke={theme.palette.text.secondary}
              fontSize={12}
              fontWeight={500}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              fontSize={12}
              fontWeight={500}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.98)',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                fontSize: '0.875rem',
              }}
            />
            <Line
              type="monotone"
              dataKey="valor"
              stroke={theme.palette.primary.main}
              strokeWidth={3}
              dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: theme.palette.primary.main }}
              name="Vendas (R$)"
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Charts Section */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '2fr 1fr',
          },
          gap: 3,
        }}
      >
        {/* Revenue Chart */}
        <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: 1,
                }}
              >
                Performance de Receita
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                }}
              >
                Acompanhamento mensal da receita vs meta estabelecida
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis 
                  dataKey="name" 
                  stroke={theme.palette.text.secondary}
                  fontSize={12}
                  fontWeight={500}
                />
                <YAxis 
                  stroke={theme.palette.text.secondary}
                  fontSize={12}
                  fontWeight={500}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.98)',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    fontSize: '0.875rem',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="receita"
                  stroke={theme.palette.primary.main}
                  strokeWidth={3}
                  fill="url(#colorReceita)"
                  name="Receita"
                />
                <Area
                  type="monotone"
                  dataKey="meta"
                  stroke={theme.palette.success.main}
                  strokeWidth={2}
                  fill="url(#colorMeta)"
                  strokeDasharray="5 5"
                  name="Meta"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>

        {/* Category Distribution */}
        <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
              height: 'fit-content',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: 1,
                }}
              >
                Categorias de Brinquedos
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                }}
              >
                Vendas por tipo de brinquedo
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.98)',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    fontSize: '0.875rem',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {categoryData.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    borderRadius: 2,
                    background: alpha(item.color, 0.05),
                    border: `1px solid ${alpha(item.color, 0.1)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: item.color,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 500,
                        fontSize: '0.875rem',
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 600,
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
      </Box>
    </Layout>
  );
};

export default Dashboard;

