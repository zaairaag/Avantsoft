import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Card,
  CardContent,
  Avatar,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  ShoppingCart,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Venda, Cliente } from '../types';
import { vendaService, clienteService } from '../services/api';
import Layout from '../components/Layout';

const Vendas: React.FC = () => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  // Form states
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [clienteId, setClienteId] = useState('');

  const theme = useTheme();

  const loadData = async () => {
    try {
      setLoading(true);
      const [vendasData, clientesData] = await Promise.all([
        vendaService.listar(),
        clienteService.listar(),
      ]);
      setVendas(vendasData);
      setClientes(clientesData.data);
    } catch (err) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    try {
      if (!valor || !data || !clienteId) {
        setError('Todos os campos são obrigatórios');
        return;
      }

      // Corrigir problema de fuso horário - usar data local
      const dataLocal = new Date(data + 'T12:00:00'); // Meio-dia local para evitar problemas de fuso

      await vendaService.criar({
        valor: parseFloat(valor),
        data: dataLocal.toISOString(),
        clienteId,
      });
      
      resetForm();
      setOpenDialog(false);
      loadData();
    } catch (err) {
      setError('Erro ao salvar venda');
    }
  };

  const resetForm = () => {
    setValor('');
    setData('');
    setClienteId('');
  };

  const handleNewVenda = () => {
    resetForm();
    const hoje = new Date();
    const dataAtual = hoje.toISOString().split('T')[0];
    setData(dataAtual);
    setOpenDialog(true);
  };

  // Cálculos de estatísticas
  const totalVendas = vendas.reduce((sum, venda) => sum + venda.valor, 0);
  const vendasHoje = vendas.filter(venda => {
    const hoje = new Date();
    const dataVenda = new Date(venda.data);
    return dataVenda.toDateString() === hoje.toDateString();
  });
  const totalHoje = vendasHoje.reduce((sum, venda) => sum + venda.valor, 0);
  const ticketMedio = vendas.length > 0 ? totalVendas / vendas.length : 0;

  const columns: GridColDef[] = [
    {
      field: 'cliente',
      headerName: 'Cliente',
      width: 200,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            fontSize: '0.875rem',
          }}
        >
          {params.row.cliente?.nome || 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'clienteEmail',
      headerName: 'Email',
      width: 220,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: '0.875rem',
          }}
        >
          {params.row.cliente?.email || '-'}
        </Typography>
      ),
    },
    {
      field: 'valor',
      headerName: 'Valor',
      width: 130,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: theme.palette.success.main,
            fontSize: '0.875rem',
            fontFamily: 'monospace',
          }}
        >
          R$ {params.value.toFixed(2).replace('.', ',')}
        </Typography>
      ),
    },
    {
      field: 'data',
      headerName: 'Data',
      width: 120,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.875rem',
            color: theme.palette.text.primary,
            fontWeight: 500,
          }}
        >
          {new Date(params.value).toLocaleDateString('pt-BR')}
        </Typography>
      ),
    },
    {
      field: 'dataHora',
      headerName: 'Hora',
      width: 100,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.875rem',
            color: theme.palette.text.secondary,
            fontFamily: 'monospace',
          }}
        >
          {new Date(params.row.data).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: () => (
        <Chip
          label="Concluída"
          size="small"
          sx={{
            minWidth: 80,
            background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
            color: 'white',
            fontWeight: 600,
            fontSize: '0.75rem',
            border: 'none',
          }}
        />
      ),
    },
  ];

  return (
    <Layout>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              fontSize: { xs: '1.75rem', md: '2rem' },
              lineHeight: 1.2,
              mb: 0.5,
            }}
          >
            Vendas de Brinquedos
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '1rem',
              fontWeight: 500,
            }}
          >
            Acompanhe todas as vendas e conquiste mais sorrisos
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 4 }}>
          <Card
            sx={{
              flex: 1,
              background: 'white',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    mb: 1,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Faturamento Total
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700, 
                    color: theme.palette.success.main,
                    fontSize: '1.5rem',
                    fontFamily: 'monospace',
                  }}
                >
                  R$ {totalVendas.toFixed(2).replace('.', ',')}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card
            sx={{
              flex: 1,
              background: 'white',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    mb: 1,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Brinquedos Hoje
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700, 
                    color: theme.palette.primary.main,
                    fontSize: '1.5rem',
                    fontFamily: 'monospace',
                  }}
                >
                  R$ {totalHoje.toFixed(2).replace('.', ',')}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card
            sx={{
              flex: 1,
              background: 'white',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    mb: 1,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Ticket Médio
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#f59e0b',
                    fontSize: '1.5rem',
                    fontFamily: 'monospace',
                  }}
                >
                  R$ {ticketMedio.toFixed(2).replace('.', ',')}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Stack>

        {/* Action Bar */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            background: 'white',
            border: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                color: theme.palette.text.primary,
                fontSize: '1.125rem',
                mb: 0.5,
              }}
            >
              Vendas Recentes
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme.palette.text.secondary,
                fontSize: '0.875rem',
              }}
            >
              {vendas.length} brinquedos vendidos no sistema
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewVenda}
            sx={{
              background: theme.palette.success.main,
              color: 'white',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '0.875rem',
              boxShadow: `0 2px 8px ${alpha(theme.palette.success.main, 0.2)}`,
              '&:hover': {
                background: theme.palette.success.dark,
                boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`,
              },
            }}
          >
            Nova Venda
          </Button>
        </Paper>

        {error && (
          <Alert
            severity="error"
            sx={{
              mt: 2,
              borderRadius: 2,
              '& .MuiAlert-message': {
                fontSize: '0.875rem',
                fontWeight: 500,
              },
            }}
          >
            {error}
          </Alert>
        )}
      </Box>

      {/* Data Table */}
      <Paper
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <DataGrid
          rows={vendas}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
            sorting: {
              sortModel: [{ field: 'data', sort: 'desc' }],
            },
          }}
          disableRowSelectionOnClick
          autoHeight
          rowHeight={64}
          sx={{
            border: 'none',
            backgroundColor: 'white',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              borderBottom: `1px solid ${theme.palette.divider}`,
              minHeight: 48,
              '& .MuiDataGrid-columnHeader': {
                fontWeight: 600,
                fontSize: '0.875rem',
                color: theme.palette.text.primary,
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 600,
                },
              },
            },
            '& .MuiDataGrid-row': {
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              '&:hover': {
                backgroundColor: alpha(theme.palette.success.main, 0.02),
              },
            },
            '& .MuiDataGrid-cell': {
              borderBottom: 'none',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.875rem',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: '#f8fafc',
              minHeight: 52,
            },
          }}
        />
      </Paper>

      {/* Dialog para criar venda */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.08)} 0%, ${alpha(theme.palette.success.main, 0.04)} 100%)`,
            borderBottom: `1px solid ${theme.palette.divider}`,
            fontWeight: 600,
            fontSize: '1.25rem',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                bgcolor: theme.palette.success.main,
                width: 40,
                height: 40,
              }}
            >
              <ShoppingCart />
            </Avatar>
            Nova Venda
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              select
              label="Cliente"
              fullWidth
              variant="outlined"
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              required
            >
              {clientes.map((cliente) => (
                <MenuItem key={cliente.id} value={cliente.id}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {cliente.nome}
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      {cliente.email}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              autoFocus
              label="Valor da Venda"
              type="number"
              fullWidth
              variant="outlined"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              inputProps={{
                step: "0.01",
                min: "0"
              }}
              InputProps={{
                startAdornment: (
                  <Typography sx={{ mr: 1, color: theme.palette.text.secondary }}>
                    R$
                  </Typography>
                ),
              }}
              required
            />
            
            <TextField
              label="Data da Venda"
              type="date"
              fullWidth
              variant="outlined"
              value={data}
              onChange={(e) => setData(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{ color: theme.palette.text.secondary }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
            }}
          >
            Registrar Venda
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Vendas;



