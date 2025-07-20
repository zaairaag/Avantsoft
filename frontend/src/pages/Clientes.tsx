import React, { useState, useEffect, useCallback } from 'react';
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
  Chip,
  Grid,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import type { Cliente } from '../types';
import { clienteService } from '../services/api';
import { normalizeClienteJSON } from '../utils/normalizeJSON';
import Layout from '../components/Layout';

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [openJSONDialog, setOpenJSONDialog] = useState(false);
  const [jsonInput, setJsonInput] = useState('');

  // Filtros e paginação
  const [searchTerm, setSearchTerm] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);

  // Form states
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');

  const loadClientes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await clienteService.listar({
        search: searchTerm,
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      setClientes(response.data);
      setRowCount(response.pagination.total);
    } catch (err) {
      setError('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, paginationModel]);

  useEffect(() => {
    loadClientes();
  }, [loadClientes]);

  const handleSearch = () => {
    setSearchTerm(searchValue);
    setPaginationModel({ ...paginationModel, page: 0 });
  };

  const handleClearSearch = () => {
    setSearchValue('');
    setSearchTerm('');
    setPaginationModel({ ...paginationModel, page: 0 });
  };

  const handleSave = async () => {
    try {
      const clienteData = {
        nome,
        email,
        nascimento,
        ...(telefone && { telefone }),
        ...(cpf && { cpf }),
      };

      if (editingCliente) {
        await clienteService.atualizar(editingCliente.id, clienteData);
      } else {
        await clienteService.criar(clienteData);
      }
      
      resetForm();
      setOpenDialog(false);
      loadClientes();
    } catch (err) {
      setError('Erro ao salvar cliente');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este cliente?')) {
      try {
        await clienteService.deletar(id);
        loadClientes();
      } catch (err) {
        setError('Erro ao deletar cliente');
      }
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setNome(cliente.nome);
    setEmail(cliente.email);
    setNascimento(cliente.nascimento.split('T')[0]);
    setTelefone(cliente.telefone || '');
    setCpf(cliente.cpf || '');
    setOpenDialog(true);
  };

  const resetForm = () => {
    setNome('');
    setEmail('');
    setNascimento('');
    setTelefone('');
    setCpf('');
    setEditingCliente(null);
  };

  const handleNewCliente = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleProcessJSON = () => {
    try {
      const rawData = JSON.parse(jsonInput);
      const normalizedClientes = normalizeClienteJSON(rawData);
      
      // Aqui você pode processar os dados normalizados
      console.log('Dados normalizados:', normalizedClientes);
      alert(`${normalizedClientes.length} clientes processados com sucesso!`);
      setOpenJSONDialog(false);
      setJsonInput('');
    } catch (err) {
      setError('JSON inválido');
    }
  };

  const columns: GridColDef[] = [
    { field: 'nome', headerName: 'Nome', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'telefone', headerName: 'Telefone', width: 140 },
    {
      field: 'nascimento',
      headerName: 'Nascimento',
      width: 120,
      valueFormatter: (value) => {
        return new Date(value).toLocaleDateString('pt-BR');
      },
    },
    {
      field: 'vendas',
      headerName: 'Vendas',
      width: 100,
      renderCell: (params) => (
        <Chip 
          label={params.row.vendas?.length || 0} 
          color="primary" 
          size="small" 
        />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Ações',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          onClick={() => handleEdit(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Deletar"
          onClick={() => handleDelete(params.row.id)}
        />,
      ],
    },
  ];

  const handleImportClick = (): void => {
    // TODO: Implementar importação de CSV
    console.log('Importar CSV - funcionalidade a ser implementada');
  };

  return (
    <Layout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Gerenciar Clientes
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              placeholder="Buscar por nome ou email..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchValue && (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClearSearch} size="small">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size="auto">
            <Button variant="outlined" onClick={handleSearch}>
              Buscar
            </Button>
          </Grid>
          <Grid size="auto">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNewCliente}
            >
              Novo Cliente
            </Button>
          </Grid>
          <Grid size="auto">
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={handleImportClick}
            >
              Importar CSV
            </Button>
          </Grid>
        </Grid>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      </Box>

      <Paper sx={{ p: 2 }}>
        <DataGrid
          rows={clientes}
          columns={columns}
          loading={loading}
          rowCount={rowCount}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25, 50]}
          disableRowSelectionOnClick
          autoHeight
        />
      </Paper>

      {/* Dialog para criar/editar cliente */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            fullWidth
            variant="outlined"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Telefone"
            fullWidth
            variant="outlined"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(11) 99999-9999"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="CPF"
            fullWidth
            variant="outlined"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="000.000.000-00"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Data de Nascimento"
            type="date"
            fullWidth
            variant="outlined"
            value={nascimento}
            onChange={(e) => setNascimento(e.target.value)}
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

      {/* Dialog para processar JSON */}
      <Dialog open={openJSONDialog} onClose={() => setOpenJSONDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Processar JSON Desorganizado</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Cole aqui o JSON desorganizado para normalização:
          </Typography>
          <TextField
            multiline
            rows={15}
            fullWidth
            variant="outlined"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Cole o JSON aqui..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenJSONDialog(false)}>Cancelar</Button>
          <Button onClick={handleProcessJSON} variant="contained">
            Processar
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Clientes;







