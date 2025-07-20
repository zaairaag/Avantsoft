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
  IconButton,
  InputAdornment,
  Avatar,
  Stack,
  Card,
  CardContent,
  useTheme,
  alpha,
  Fade,
  Zoom,
  keyframes,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,

  GetApp,
  Groups,
  ChildCare,
  Star,
  Celebration,
  TrendingUp,
  Toys,
  EmojiEvents,
  AutoAwesome,
} from '@mui/icons-material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import type { Cliente } from '../types';
import { normalizeClienteJSON } from '../utils/normalizeJSON';
import Layout from '../components/Layout';
import ClienteForm from '../components/ClienteForm';
import { useClientes } from '../hooks/useClientes';
import { useDebounce } from '../hooks/useDebounce';
import { runAllTests } from '../utils/testConnection';

// Definindo animações personalizadas
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-5px) rotate(1deg); }
  50% { transform: translateY(-3px) rotate(-1deg); }
  75% { transform: translateY(-7px) rotate(0.5deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 15px rgba(0, 0, 0, 0.1); }
  50% { box-shadow: 0 0 25px rgba(76, 175, 80, 0.3); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const Clientes: React.FC = () => {
  // Hooks customizados para gerenciar clientes
  const {
    clientes,
    loading,
    error,
    rowCount,
    loadClientes,
    addCliente,
    updateCliente,
    deleteCliente,
    clearError,
    topPerformers,
  } = useClientes();

  // Estados locais
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [openJSONDialog, setOpenJSONDialog] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const theme = useTheme();

  // Debounce da busca para evitar muitas requisições
  const debouncedSearchValue = useDebounce(searchValue, 500);

  // Carregar clientes com parâmetros otimizados
  const loadClientesWithParams = useCallback(() => {
    loadClientes({
      search: debouncedSearchValue || undefined,
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }, [loadClientes, debouncedSearchValue, paginationModel]);

  // Carregar dados iniciais e quando parâmetros mudarem
  useEffect(() => {
    loadClientesWithParams();
  }, [loadClientesWithParams]);

  // Handlers otimizados
  const handleClearSearch = useCallback(() => {
    setSearchValue('');
    setPaginationModel(prev => ({ ...prev, page: 0 }));
  }, []);

  const handleSave = useCallback(async (clienteData: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>) => {
    setFormLoading(true);
    try {
      if (editingCliente) {
        await updateCliente(editingCliente.id, clienteData);
        setSuccessMessage('Cliente atualizado com sucesso!');
      } else {
        await addCliente(clienteData);
        setSuccessMessage('Cliente criado com sucesso!');
      }
      setOpenDialog(false);
      setEditingCliente(null);
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setFormLoading(false);
    }
  }, [editingCliente, updateCliente, addCliente]);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este cliente?')) {
      try {
        await deleteCliente(id);
        setSuccessMessage('Cliente removido com sucesso!');
      } catch (error) {
        // Error is handled by the hook
      }
    }
  }, [deleteCliente]);

  const handleEdit = useCallback((cliente: Cliente) => {
    setEditingCliente(cliente);
    setOpenDialog(true);
  }, []);

  const handleNewCliente = useCallback(() => {
    setEditingCliente(null);
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingCliente(null);
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSuccessMessage('');
    clearError();
  }, [clearError]);

  const handleTestConnection = useCallback(async () => {
    setSuccessMessage('Testando conectividade...');
    try {
      const results = await runAllTests();
      if (results.connection.success && results.create.success) {
        setSuccessMessage('✅ Todos os testes passaram! Sistema funcionando corretamente.');
      } else {
        setSuccessMessage(`❌ Falhas detectadas: ${results.connection.message} | ${results.create.message}`);
      }
    } catch (error) {
      setSuccessMessage('❌ Erro nos testes de conectividade');
    }
  }, []);

  const handleProcessJSON = useCallback(() => {
    try {
      const rawData = JSON.parse(jsonInput);
      const normalizedClientes = normalizeClienteJSON(rawData);

      console.log('Dados normalizados:', normalizedClientes);
      setSuccessMessage(`${normalizedClientes.length} clientes processados com sucesso!`);
      setOpenJSONDialog(false);
      setJsonInput('');
    } catch (err) {
      setSuccessMessage('');
      // Error will be shown via the error state from the hook
    }
  }, [jsonInput]);

  const columns: GridColDef[] = [
    {
      field: 'nome',
      headerName: 'Nome',
      width: 250,
      renderCell: (params) => {
        const isTopVolume = topPerformers.maiorVolume?.id === params.row.id;
        const isTopMedia = topPerformers.maiorMedia?.id === params.row.id;
        const isTopFrequencia = topPerformers.maiorFrequencia?.id === params.row.id;

        return (
          <Box sx={{ py: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                fontSize: '0.875rem',
                mb: 0.5,
              }}
            >
              {params.row.nome}
            </Typography>
            {(isTopVolume || isTopMedia || isTopFrequencia) && (
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {isTopVolume && (
                  <Chip
                    label="🏆 Maior Volume"
                    size="small"
                    sx={{
                      background: `linear-gradient(135deg, #FFD700 0%, #FFA500 100%)`,
                      color: '#8B4513',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 18,
                      '& .MuiChip-label': { px: 0.8 },
                    }}
                  />
                )}
                {isTopMedia && (
                  <Chip
                    label="💎 Maior Média"
                    size="small"
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 18,
                      '& .MuiChip-label': { px: 0.8 },
                    }}
                  />
                )}
                {isTopFrequencia && (
                  <Chip
                    label="🔥 Mais Frequente"
                    size="small"
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 18,
                      '& .MuiChip-label': { px: 0.8 },
                    }}
                  />
                )}
              </Box>
            )}
          </Box>
        );
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: '0.875rem',
          }}
        >
          {params.row.email}
        </Typography>
      ),
    },
    {
      field: 'telefone',
      headerName: 'Telefone',
      width: 150,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'monospace',
            color: theme.palette.text.primary,
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'nascimento',
      headerName: 'Nascimento',
      width: 130,
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: '0.875rem',
            fontWeight: 500,
            color: theme.palette.text.primary,
          }}
        >
          {new Date(params.value).toLocaleDateString('pt-BR')}
        </Typography>
      ),
    },
    {
      field: 'vendas',
      headerName: 'Vendas',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          label={params.row.vendas?.length || 0}
          size="small"
          sx={{
            minWidth: 40,
            fontWeight: 600,
            fontSize: '0.75rem',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            border: 'none',
          }}
        />
      ),
    },
    {
      field: 'letraFaltante',
      headerName: 'Letra Ausente',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const findMissingLetter = (nome: string): string => {
          if (!nome) return '-';
          const nomeUpper = nome.toUpperCase().replace(/\s/g, '');
          const letrasPresentes = new Set(nomeUpper.split(''));
          
          for (let i = 65; i <= 90; i++) { // A-Z
            const letra = String.fromCharCode(i);
            if (!letrasPresentes.has(letra)) {
              return letra;
            }
          }
          return '-'; // Todas as letras estão presentes
        };

        const letraFaltante = findMissingLetter(params.row.nome);
        
        return (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: letraFaltante === '-' 
                ? alpha(theme.palette.success.main, 0.1)
                : alpha(theme.palette.warning.main, 0.1),
              border: `2px solid ${letraFaltante === '-' 
                ? theme.palette.success.main
                : theme.palette.warning.main}`,
              fontWeight: 700,
              fontSize: '0.875rem',
              color: letraFaltante === '-' 
                ? theme.palette.success.main
                : theme.palette.warning.main,
            }}
          >
            {letraFaltante}
          </Box>
        );
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Ações',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      getActions: (params) => [
        <GridActionsCellItem
          icon={
            <EditIcon
              sx={{
                color: theme.palette.warning.main,
                fontSize: '1rem',
              }}
            />
          }
          label="Editar"
          onClick={() => handleEdit(params.row)}
        />,
        <GridActionsCellItem
          icon={
            <DeleteIcon
              sx={{
                color: theme.palette.error.main,
                fontSize: '1rem',
              }}
            />
          }
          label="Deletar"
          onClick={() => handleDelete(params.row.id)}
        />,
      ],
    },
  ];

  const handleImportClick = (): void => {
    console.log('Importar CSV - funcionalidade a ser implementada');
  };

  return (
    <Layout>
      {/* Modern Header Section */}
      <Box sx={{ mb: 5 }}>
        <Fade in={true} timeout={800}>
          <Box sx={{ 
            mb: 4,
            p: 4,
            background: `linear-gradient(135deg, 
              ${alpha('#FF6B9D', 0.1)} 0%, 
              ${alpha(theme.palette.primary.main, 0.08)} 30%, 
              ${alpha('#4FACFE', 0.1)} 60%, 
              ${alpha('#9C27B0', 0.08)} 100%)`,
            borderRadius: 4,
            border: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: `linear-gradient(90deg, transparent, ${alpha('#ffffff', 0.4)}, transparent)`,
              animation: `${shimmer} 3s infinite`,
            },
          }}>
            <Stack direction="row" alignItems="center" spacing={3}>
              <Zoom in={true} timeout={1000}>
                <Avatar
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #FF6B9D 100%)`,
                    width: 72,
                    height: 72,
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                    animation: `${float} 6s ease-in-out infinite`,
                    border: `3px solid #ffffff`,
                  }}
                >
                  <Toys sx={{ fontSize: '2.5rem', color: '#ffffff' }} />
                </Avatar>
              </Zoom>
              
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #FF6B9D 50%, #4FACFE 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    lineHeight: 1.1,
                    mb: 1,
                    letterSpacing: '-1px',
                    textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  }}
                >
                  ✨ Gestão de Clientes ✨
                </Typography>
                
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  🛍️ Gerencie seus clientes de forma eficiente e moderna
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip
                    icon={<AutoAwesome />}
                    label="Sistema Avançado"
                    variant="outlined"
                    sx={{
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        animation: `${pulse} 1s infinite`,
                      },
                    }}
                  />
                  <Chip
                    icon={<EmojiEvents />}
                    label="Gestão Premium"
                    variant="outlined"
                    sx={{
                      borderColor: '#FF6B9D',
                      color: '#FF6B9D',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: alpha('#FF6B9D', 0.1),
                        animation: `${pulse} 1s infinite`,
                      },
                    }}
                  />
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Fade>

        {/* Enhanced Stats Cards */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 4, flexWrap: 'wrap' }}>
          {/* Total de Clientes */}
          <Zoom in={true} timeout={800} style={{ transitionDelay: '200ms' }}>
            <Card
              sx={{
                flex: { xs: '1 1 100%', sm: '1 1 48%', md: '1 1 23%' },
                background: `linear-gradient(135deg, 
                  ${alpha(theme.palette.primary.main, 0.15)} 0%, 
                  ${alpha('#4FACFE', 0.1)} 50%, 
                  ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: 4,
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, #4FACFE, ${theme.palette.primary.main})`,
                  backgroundSize: '200% 100%',
                  animation: `${shimmer} 2s infinite`,
                },
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: `0 20px 60px ${alpha(theme.palette.primary.main, 0.25)}`,
                  borderColor: theme.palette.primary.main,
                  '& .stat-icon': {
                    animation: `${float} 2s ease-in-out infinite`,
                  },
                  '& .stat-number': {
                    animation: `${pulse} 1s ease-in-out infinite`,
                  },
                },
              }}
            >
              <CardContent sx={{ p: 3, position: 'relative' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Avatar
                    className="stat-icon"
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #4FACFE 100%)`,
                      width: 64,
                      height: 64,
                      boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                      border: `3px solid #ffffff`,
                    }}
                  >
                    <Groups sx={{ fontSize: '2rem', color: '#ffffff' }} />
                  </Avatar>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip
                      icon={<TrendingUp sx={{ fontSize: '1rem' }} />}
                      label={`+${Math.floor((rowCount / 50) * 100)}%`}
                      size="small"
                      sx={{
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha('#4FACFE', 0.15)} 100%)`,
                        color: theme.palette.primary.main,
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                        mb: 1,
                      }}
                    />
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                      vs mês anterior
                    </Typography>
                  </Box>
                </Stack>
                
                <Typography 
                  className="stat-number"
                  variant="h2" 
                  sx={{ 
                    fontWeight: 900, 
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #4FACFE 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '2.75rem',
                    lineHeight: 1,
                    mb: 1,
                    letterSpacing: '-1px',
                  }}
                >
                  {rowCount}
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: theme.palette.text.primary,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    mb: 0.5,
                  }}
                >
                  👥 Clientes Cadastrados
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    fontSize: '0.875rem',
                    lineHeight: 1.4,
                  }}
                >
                  Total de clientes ativos na loja
                </Typography>
              </CardContent>
            </Card>
          </Zoom>

          {/* Clientes Ativos */}
          <Zoom in={true} timeout={800} style={{ transitionDelay: '400ms' }}>
            <Card
              sx={{
                flex: { xs: '1 1 100%', sm: '1 1 48%', md: '1 1 23%' },
                background: `linear-gradient(135deg, 
                  ${alpha(theme.palette.success.main, 0.15)} 0%, 
                  ${alpha('#00E676', 0.1)} 50%, 
                  ${alpha(theme.palette.success.main, 0.08)} 100%)`,
                border: `2px solid ${alpha(theme.palette.success.main, 0.2)}`,
                borderRadius: 4,
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${theme.palette.success.main}, #00E676, ${theme.palette.success.main})`,
                  backgroundSize: '200% 100%',
                  animation: `${shimmer} 2s infinite`,
                },
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: `0 20px 60px ${alpha(theme.palette.success.main, 0.25)}`,
                  borderColor: theme.palette.success.main,
                  animation: `${glow} 2s ease-in-out infinite`,
                  '& .stat-icon': {
                    animation: `${float} 2s ease-in-out infinite`,
                  },
                  '& .stat-number': {
                    animation: `${pulse} 1s ease-in-out infinite`,
                  },
                },
              }}
            >
              <CardContent sx={{ p: 3, position: 'relative' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Avatar
                    className="stat-icon"
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, #00E676 100%)`,
                      width: 64,
                      height: 64,
                      boxShadow: `0 8px 24px ${alpha(theme.palette.success.main, 0.3)}`,
                      border: `3px solid #ffffff`,
                    }}
                  >
                    <ChildCare sx={{ fontSize: '2rem', color: '#ffffff' }} />
                  </Avatar>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip
                      label="🟢 Ativo"
                      size="small"
                      sx={{
                        background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.15)} 0%, ${alpha('#00E676', 0.15)} 100%)`,
                        color: theme.palette.success.main,
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                        mb: 1,
                      }}
                    />
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                      última semana
                    </Typography>
                  </Box>
                </Stack>
                
                <Typography 
                  className="stat-number"
                  variant="h2" 
                  sx={{ 
                    fontWeight: 900, 
                    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, #00E676 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '2.75rem',
                    lineHeight: 1,
                    mb: 1,
                    letterSpacing: '-1px',
                  }}
                >
                  {clientes.filter(c => c.vendas && c.vendas.length > 0).length}
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: theme.palette.text.primary,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    mb: 0.5,
                  }}
                >
                  🎯 Clientes Ativos
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    fontSize: '0.875rem',
                    lineHeight: 1.4,
                  }}
                >
                  Com compras recentes na loja
                </Typography>
              </CardContent>
            </Card>
          </Zoom>

          {/* Cliente VIP */}
          <Zoom in={true} timeout={800} style={{ transitionDelay: '600ms' }}>
            <Card
              sx={{
                flex: { xs: '1 1 100%', sm: '1 1 48%', md: '1 1 23%' },
                background: `linear-gradient(135deg, 
                  ${alpha('#f59e0b', 0.15)} 0%, 
                  ${alpha('#FFD700', 0.1)} 50%, 
                  ${alpha('#f59e0b', 0.08)} 100%)`,
                border: `2px solid ${alpha('#f59e0b', 0.2)}`,
                borderRadius: 4,
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, #f59e0b, #FFD700, #f59e0b)`,
                  backgroundSize: '200% 100%',
                  animation: `${shimmer} 2s infinite`,
                },
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: `0 20px 60px ${alpha('#f59e0b', 0.25)}`,
                  borderColor: '#f59e0b',
                  '& .stat-icon': {
                    animation: `${float} 2s ease-in-out infinite`,
                  },
                  '& .vip-name': {
                    animation: `${pulse} 1s ease-in-out infinite`,
                  },
                },
              }}
            >
              <CardContent sx={{ p: 3, position: 'relative' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Avatar
                    className="stat-icon"
                    sx={{
                      background: `linear-gradient(135deg, #f59e0b 0%, #FFD700 100%)`,
                      width: 64,
                      height: 64,
                      boxShadow: `0 8px 24px ${alpha('#f59e0b', 0.3)}`,
                      border: `3px solid #ffffff`,
                    }}
                  >
                    <Star sx={{ fontSize: '2rem', color: '#ffffff' }} />
                  </Avatar>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip
                      label="👑 VIP"
                      size="small"
                      sx={{
                        background: `linear-gradient(135deg, ${alpha('#f59e0b', 0.15)} 0%, ${alpha('#FFD700', 0.15)} 100%)`,
                        color: '#f59e0b',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        border: `1px solid ${alpha('#f59e0b', 0.3)}`,
                        mb: 1,
                      }}
                    />
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                      cliente premium
                    </Typography>
                  </Box>
                </Stack>
                
                <Typography 
                  className="vip-name"
                  variant="h5" 
                  sx={{ 
                    fontWeight: 800, 
                    background: `linear-gradient(135deg, #f59e0b 0%, #FFD700 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '1.4rem',
                    lineHeight: 1.2,
                    mb: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    letterSpacing: '-0.5px',
                  }}
                >
                  {topPerformers.maiorVolume?.nome || '⏳ Aguardando dados...'}
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: theme.palette.text.primary,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    mb: 0.5,
                  }}
                >
                  🏆 Melhor Cliente
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    fontSize: '0.875rem',
                    lineHeight: 1.4,
                  }}
                >
                  Cliente com maior volume de compras
                </Typography>
              </CardContent>
            </Card>
          </Zoom>

          {/* Engajamento */}
          <Zoom in={true} timeout={800} style={{ transitionDelay: '800ms' }}>
            <Card
              sx={{
                flex: { xs: '1 1 100%', sm: '1 1 48%', md: '1 1 23%' },
                background: `linear-gradient(135deg, 
                  ${alpha('#8b5cf6', 0.15)} 0%, 
                  ${alpha('#C084FC', 0.1)} 50%, 
                  ${alpha('#8b5cf6', 0.08)} 100%)`,
                border: `2px solid ${alpha('#8b5cf6', 0.2)}`,
                borderRadius: 4,
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, #8b5cf6, #C084FC, #8b5cf6)`,
                  backgroundSize: '200% 100%',
                  animation: `${shimmer} 2s infinite`,
                },
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: `0 20px 60px ${alpha('#8b5cf6', 0.25)}`,
                  borderColor: '#8b5cf6',
                  '& .stat-icon': {
                    animation: `${float} 2s ease-in-out infinite`,
                  },
                  '& .stat-number': {
                    animation: `${pulse} 1s ease-in-out infinite`,
                  },
                },
              }}
            >
              <CardContent sx={{ p: 3, position: 'relative' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Avatar
                    className="stat-icon"
                    sx={{
                      background: `linear-gradient(135deg, #8b5cf6 0%, #C084FC 100%)`,
                      width: 64,
                      height: 64,
                      boxShadow: `0 8px 24px ${alpha('#8b5cf6', 0.3)}`,
                      border: `3px solid #ffffff`,
                    }}
                  >
                    <Celebration sx={{ fontSize: '2rem', color: '#ffffff' }} />
                  </Avatar>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip
                      icon={<TrendingUp sx={{ fontSize: '1rem' }} />}
                      label={`${Math.round((clientes.filter(c => c.vendas && c.vendas.length > 0).length / rowCount) * 100)}%`}
                      size="small"
                      sx={{
                        background: `linear-gradient(135deg, ${alpha('#8b5cf6', 0.15)} 0%, ${alpha('#C084FC', 0.15)} 100%)`,
                        color: '#8b5cf6',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        border: `1px solid ${alpha('#8b5cf6', 0.3)}`,
                        mb: 1,
                      }}
                    />
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                      engajamento
                    </Typography>
                  </Box>
                </Stack>
                
                <Typography 
                  className="stat-number"
                  variant="h2" 
                  sx={{ 
                    fontWeight: 900, 
                    background: `linear-gradient(135deg, #8b5cf6 0%, #C084FC 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '2.75rem',
                    lineHeight: 1,
                    mb: 1,
                    letterSpacing: '-1px',
                  }}
                >
                  {Math.round((clientes.filter(c => c.vendas && c.vendas.length > 0).length / rowCount) * 100) || 0}%
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: theme.palette.text.primary,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    mb: 0.5,
                  }}
                >
                  📊 Taxa de Conversão
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    fontSize: '0.875rem',
                    lineHeight: 1.4,
                  }}
                >
                  Clientes que realizam compras
                </Typography>
              </CardContent>
            </Card>
          </Zoom>
        </Stack>

        {/* Enhanced Action Bar */}
        <Fade in={true} timeout={1200}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 4,
              background: `linear-gradient(135deg, 
                rgba(255, 255, 255, 0.95) 0%, 
                rgba(255, 255, 255, 0.9) 100%)`,
              backdropFilter: 'blur(20px)',
              border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.08)}`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, 
                  ${theme.palette.primary.main}, 
                  #FF6B9D, 
                  #4FACFE, 
                  ${theme.palette.primary.main})`,
                backgroundSize: '400% 100%',
                animation: `${shimmer} 3s infinite`,
              },
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={3}
              alignItems={{ xs: 'stretch', md: 'center' }}
            >
              <Box sx={{ flex: 1, maxWidth: { xs: '100%', md: '500px' } }}>
                <TextField
                  fullWidth
                  placeholder="🔍 Busque por clientes, nomes ou emails..."
                  value={searchValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon 
                          sx={{ 
                            color: theme.palette.primary.main, 
                            fontSize: '1.5rem',
                            animation: searchValue ? `${pulse} 2s infinite` : 'none',
                          }} 
                        />
                      </InputAdornment>
                    ),
                    endAdornment: searchValue && (
                      <InputAdornment position="end">
                        <IconButton 
                          onClick={handleClearSearch} 
                          size="small"
                          sx={{
                            color: theme.palette.text.secondary,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.error.main, 0.1),
                              color: theme.palette.error.main,
                              transform: 'scale(1.1)',
                            },
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#ffffff',
                      borderRadius: 4,
                      fontSize: '1rem',
                      fontWeight: 500,
                      border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                        transform: 'translateY(-1px)',
                      },
                      '&.Mui-focused': {
                        borderColor: theme.palette.primary.main,
                        boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
                        transform: 'translateY(-2px)',
                      },
                    },
                  }}
                />
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>

                
                <Button
                  variant="outlined"
                  startIcon={<GetApp />}
                  onClick={handleImportClick}
                  sx={{
                    borderRadius: 3,
                    borderWidth: 2,
                    borderColor: alpha(theme.palette.success.main, 0.3),
                    color: theme.palette.success.main,
                    fontWeight: 600,
                    px: 3,
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    '&:hover': {
                      borderColor: theme.palette.success.main,
                      backgroundColor: alpha(theme.palette.success.main, 0.1),
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 16px ${alpha(theme.palette.success.main, 0.2)}`,
                    },
                  }}
                >
                  📥 Importar
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={handleTestConnection}
                  sx={{
                    borderRadius: 3,
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    borderColor: theme.palette.info.main,
                    color: theme.palette.info.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.info.main, 0.1),
                      borderColor: theme.palette.info.dark,
                    },
                  }}
                >
                  🔧 Testar Sistema
                </Button>

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleNewCliente}
                  sx={{
                    borderRadius: 3,
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #FF6B9D 100%)`,
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    '&:hover': {
                      background: `linear-gradient(135deg, #FF6B9D 0%, ${theme.palette.primary.main} 100%)`,
                      boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
                      transform: 'translateY(-3px) scale(1.02)',
                    },
                  }}
                >
                  ✨ Novo Cliente
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Fade>

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
          rowHeight={80}
          sx={{
            border: 'none',
            backgroundColor: '#ffffff',
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
                backgroundColor: alpha(theme.palette.primary.main, 0.02),
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

      {/* Formulário otimizado de cliente */}
      <ClienteForm
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSave}
        editingCliente={editingCliente}
        loading={formLoading}
        error={error}
      />

      {/* Dialog para processar JSON */}
      <Dialog
        open={openJSONDialog}
        onClose={() => setOpenJSONDialog(false)}
        maxWidth="md"
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
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
            borderBottom: `1px solid ${theme.palette.divider}`,
            fontWeight: 600,
          }}
        >
          Processar JSON Desorganizado
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary }}>
            Cole aqui o JSON desorganizado para normalização:
          </Typography>
          <TextField
            multiline
            rows={15}
            fullWidth
            variant="outlined"
            value={jsonInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJsonInput(e.target.value)}
            placeholder="Cole o JSON aqui..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button
            onClick={() => setOpenJSONDialog(false)}
            sx={{ color: theme.palette.text.secondary }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleProcessJSON}
            variant="contained"
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            }}
          >
            Processar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback de sucesso e erro */}
      <Snackbar
        open={!!successMessage || !!error}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={successMessage ? 'success' : 'error'}
          sx={{
            width: '100%',
            borderRadius: 2,
            fontWeight: 500,
          }}
        >
          {successMessage || error}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default Clientes;







