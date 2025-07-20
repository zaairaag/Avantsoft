import React, { useState, useEffect, useCallback } from 'react';
import {
  IconButton,
  Dialog,
  DialogContent,
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  InputAdornment,
  Stack,
  useTheme,
  alpha,
  Divider,
} from '@mui/material';
import {
  Search,
  Person,
  ShoppingCart,
  Dashboard,
  Close,
  Groups,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { clienteService, vendaService } from '../services/api';

interface SearchResult {
  id: string;
  type: 'cliente' | 'venda' | 'page';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  path?: string;
  action?: () => void;
}

interface GlobalSearchProps {
  onResultClick?: (result: SearchResult) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onResultClick }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  // Páginas do sistema para busca
  const systemPages: SearchResult[] = [
    {
      id: 'dashboard',
      type: 'page',
      title: 'Painel Executivo',
      subtitle: 'Visão geral da loja de brinquedos',
      icon: <Dashboard />,
      color: theme.palette.primary.main,
      path: '/',
    },
    {
      id: 'clientes',
      type: 'page',
      title: 'Gestão de Clientes',
      subtitle: 'Gerencie seus clientes de forma eficiente',
      icon: <Groups />,
      color: '#22c55e',
      path: '/clientes',
    },
    {
      id: 'vendas',
      type: 'page',
      title: 'Vendas de Brinquedos',
      subtitle: 'Controle de vendas e transações',
      icon: <ShoppingCart />,
      color: '#f59e0b',
      path: '/vendas',
    },
  ];

  const handleOpen = () => {
    setOpen(true);
    setSearchTerm('');
    setResults([]);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchTerm('');
    setResults([]);
  };

  const performSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults(systemPages);
      return;
    }

    setLoading(true);
    try {
      const searchResults: SearchResult[] = [];

      // Buscar páginas do sistema
      const matchingPages = systemPages.filter(page =>
        page.title.toLowerCase().includes(term.toLowerCase()) ||
        page.subtitle.toLowerCase().includes(term.toLowerCase())
      );
      searchResults.push(...matchingPages);

      // Buscar clientes
      try {
        const clientesResponse = await clienteService.listar({
          search: term,
          limit: 5,
        });
        
        const clienteResults: SearchResult[] = clientesResponse.data.map(cliente => ({
          id: `cliente-${cliente.id}`,
          type: 'cliente' as const,
          title: cliente.nome,
          subtitle: cliente.email,
          icon: <Person />,
          color: '#22c55e',
          action: () => {
            navigate('/clientes');
            handleClose();
          },
        }));
        searchResults.push(...clienteResults);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }

      // Buscar vendas (por cliente)
      try {
        const vendasResponse = await vendaService.listar();
        const vendasFiltradas = vendasResponse
          .filter(venda => 
            venda.cliente?.nome.toLowerCase().includes(term.toLowerCase()) ||
            venda.valor.toString().includes(term)
          )
          .slice(0, 5);

        const vendaResults: SearchResult[] = vendasFiltradas.map(venda => ({
          id: `venda-${venda.id}`,
          type: 'venda' as const,
          title: `Venda - ${venda.cliente?.nome || 'Cliente não encontrado'}`,
          subtitle: `R$ ${venda.valor.toFixed(2).replace('.', ',')} - ${new Date(venda.data).toLocaleDateString('pt-BR')}`,
          icon: <ShoppingCart />,
          color: '#f59e0b',
          action: () => {
            navigate('/vendas');
            handleClose();
          },
        }));
        searchResults.push(...vendaResults);
      } catch (error) {
        console.error('Erro ao buscar vendas:', error);
      }

      setResults(searchResults);
    } catch (error) {
      console.error('Erro na busca:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, performSearch]);

  useEffect(() => {
    if (open && !searchTerm) {
      setResults(systemPages);
    }
  }, [open, searchTerm]);

  const handleResultClick = (result: SearchResult) => {
    if (result.path) {
      navigate(result.path);
    } else if (result.action) {
      result.action();
    }
    
    onResultClick?.(result);
    handleClose();
  };

  const getResultTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'cliente': return 'Cliente';
      case 'venda': return 'Venda';
      case 'page': return 'Página';
      default: return '';
    }
  };

  // Atalho de teclado Ctrl+K ou Cmd+K
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        handleOpen();
      }
      if (event.key === 'Escape' && open) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          color: theme.palette.text.secondary,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            color: theme.palette.primary.main,
          },
        }}
      >
        <Search />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
            maxHeight: '80vh',
            mt: 4,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {/* Header de busca */}
          <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <TextField
              fullWidth
              placeholder="Busque por clientes, vendas, páginas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label="Ctrl+K"
                        size="small"
                        sx={{
                          fontSize: '0.7rem',
                          height: 20,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                        }}
                      />
                      <IconButton size="small" onClick={handleClose}>
                        <Close fontSize="small" />
                      </IconButton>
                    </Stack>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: '1rem',
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                    },
                  },
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2,
                    },
                  },
                },
              }}
            />
          </Box>

          {/* Resultados */}
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {loading ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Buscando...
                </Typography>
              </Box>
            ) : results.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm ? 'Nenhum resultado encontrado' : 'Digite para buscar...'}
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {results.map((result, index) => (
                  <React.Fragment key={result.id}>
                    <ListItem
                      component="div"
                      onClick={() => handleResultClick(result)}
                      sx={{
                        py: 2,
                        px: 3,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: alpha(result.color, 0.05),
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: alpha(result.color, 0.1),
                            color: result.color,
                            width: 40,
                            height: 40,
                          }}
                        >
                          {result.icon}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                                fontSize: '0.875rem',
                              }}
                            >
                              {result.title}
                            </Typography>
                            <Chip
                              label={getResultTypeLabel(result.type)}
                              size="small"
                              sx={{
                                fontSize: '0.7rem',
                                height: 18,
                                bgcolor: alpha(result.color, 0.1),
                                color: result.color,
                              }}
                            />
                          </Stack>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: '0.8rem',
                              mt: 0.5,
                            }}
                          >
                            {result.subtitle}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < results.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>

          {/* Footer com dicas */}
          {!loading && (
            <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                <Typography variant="caption" color="text.secondary">
                  Use ↑↓ para navegar
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Enter para selecionar
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Esc para fechar
                </Typography>
              </Stack>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlobalSearch;
