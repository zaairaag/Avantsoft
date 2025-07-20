import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  People,
  AttachMoney,
  ShoppingCart,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { vendaService } from '../services/api';
import { Estatisticas, VendaPorDia } from '../types';
import Layout from '../components/Layout';

interface StatCard {
  title: string;
  value: string;
  icon: React.ReactElement;
  color: string;
}

const Dashboard: React.FC = () => {
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [vendasPorDia, setVendasPorDia] = useState<VendaPorDia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [estatisticasData, vendasData] = await Promise.all([
        vendaService.obterEstatisticas(),
        vendaService.obterVendasPorDia(),
      ]);
      
      setEstatisticas(estatisticasData);
      setVendasPorDia(vendasData);
    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  const statCards: StatCard[] = [
    {
      title: 'Total do Dia',
      value: `R$ ${estatisticas?.totalDia?.toFixed(2) || '0,00'}`,
      icon: <AttachMoney />,
      color: '#4caf50',
    },
    {
      title: 'Maior Volume',
      value: estatisticas?.maiorVolume?.cliente || 'N/A',
      icon: <TrendingUp />,
      color: '#2196f3',
    },
    {
      title: 'Maior Média',
      value: estatisticas?.maiorMedia?.cliente || 'N/A',
      icon: <People />,
      color: '#ff9800',
    },
    {
      title: 'Maior Frequência',
      value: estatisticas?.maiorFrequencia?.cliente || 'N/A',
      icon: <ShoppingCart />,
      color: '#9c27b0',
    },
  ];

  // Preparar dados para o gráfico (últimos 7 dias)
  const ultimosSeteDias = vendasPorDia.slice(-7).map(item => ({
    ...item,
    dataFormatada: new Date(item.data).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    }),
  }));

  return (
    <Layout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visão geral das vendas e estatísticas
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Cards de Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      {card.title}
                    </Typography>
                    <Typography variant="h4" component="h2" sx={{ color: card.color }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Vendas por Dia (Últimos 7 dias)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={ultimosSeteDias}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="dataFormatada" 
                  fontSize={12}
                />
                <YAxis 
                  fontSize={12}
                  tickFormatter={(value) => `R$ ${value}`}
                />
                <Tooltip 
                  formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Vendas']}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top 5 Clientes
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Cliente com Maior Volume
              </Typography>
              <Typography variant="body1" color="primary">
                {estatisticas?.maiorVolume?.cliente}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                R$ {estatisticas?.maiorVolume?.valor?.toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Cliente com Maior Média
              </Typography>
              <Typography variant="body1" color="primary">
                {estatisticas?.maiorMedia?.cliente}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                R$ {estatisticas?.maiorMedia?.media?.toFixed(2)} por venda
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Cliente Mais Frequente
              </Typography>
              <Typography variant="body1" color="primary">
                {estatisticas?.maiorFrequencia?.cliente}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {estatisticas?.maiorFrequencia?.quantidade} vendas
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Gráfico de barras - Volume total por período */}
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Histórico de Vendas (Últimos 30 dias)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vendasPorDia.slice(-30)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="data" 
                  fontSize={10}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: '2-digit' 
                  })}
                />
                <YAxis 
                  fontSize={12}
                  tickFormatter={(value) => `R$ ${value}`}
                />
                <Tooltip 
                  formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Total']}
                  labelFormatter={(label) => `Data: ${new Date(label).toLocaleDateString('pt-BR')}`}
                />
                <Bar dataKey="valor" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard;


