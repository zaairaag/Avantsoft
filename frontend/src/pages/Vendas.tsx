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
  Grid,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
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

      await vendaService.criar({
        valor: parseFloat(valor),
        data: new Date(data).toISOString(),
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
    // Definir data atual como padrão
    const hoje = new Date();
    const dataAtual = hoje.toISOString().split('T')[0];
    setData(dataAtual);
    setOpenDialog(true);
  };

  const columns: GridColDef[] = [
    {
      field: 'cliente',
      headerName: 'Cliente',
      flex: 1,
      renderCell: (params) => params.row.cliente?.nome || 'N/A',
    },
    {
      field: 'valor',
      headerName: 'Valor',
      width: 120,
      renderCell: (params) => `R$ ${params.value.toFixed(2)}`,
    },
    {
      field: 'data',
      headerName: 'Data',
      width: 120,
      valueFormatter: (value) => {
        return new Date(value).toLocaleDateString('pt-BR');
      },
    },
    {
      field: 'createdAt',
      headerName: 'Criado em',
      width: 140,
      valueFormatter: (value) => {
        return new Date(value).toLocaleDateString('pt-BR') + ' ' + 
               new Date(value).toLocaleTimeString('pt-BR');
      },
    },
  ];

  return (
    <Layout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Gerenciar Vendas
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size="auto">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNewVenda}
            >
              Nova Venda
            </Button>
          </Grid>
        </Grid>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      </Box>

      <Paper sx={{ p: 2 }}>
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
        />
      </Paper>

      {/* Dialog para criar venda */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nova Venda</DialogTitle>
        <DialogContent>
          <TextField
            select
            margin="dense"
            label="Cliente"
            fullWidth
            variant="outlined"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            sx={{ mb: 2 }}
          >
            {clientes.map((cliente) => (
              <MenuItem key={cliente.id} value={cliente.id}>
                {cliente.nome} - {cliente.email}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            autoFocus
            margin="dense"
            label="Valor"
            type="number"
            fullWidth
            variant="outlined"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            sx={{ mb: 2 }}
            inputProps={{
              step: "0.01",
              min: "0"
            }}
          />
          
          <TextField
            margin="dense"
            label="Data da Venda"
            type="date"
            fullWidth
            variant="outlined"
            value={data}
            onChange={(e) => setData(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Vendas;



