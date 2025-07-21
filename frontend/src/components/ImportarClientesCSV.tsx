import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  IconButton
} from '@mui/material';
import {
  CloudUpload,
  Download,
  CheckCircle,
  Error,
  Info,
  Close
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import api from '../services/api';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface ImportResult {
  totalLinhas: number;
  sucessos: number;
  erros: number;
  detalhes: {
    clientesImportados: Array<{
      linha: number;
      cliente: any;
    }>;
    errosEncontrados: string[];
  };
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ImportarClientesCSV: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setResult(null);
      } else {
        alert('Por favor, selecione apenas arquivos CSV');
      }
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/clientes/import/csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
      if (response.data.sucessos > 0) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Erro ao importar:', error);
      alert(error.response?.data?.error || 'Erro ao importar arquivo');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    onClose();
  };

  const downloadTemplate = () => {
    const csvContent = 'nome,email,nascimento,telefone,cpf\n' +
                      'Maria Silva Santos,maria.silva@email.com,1990-05-15,11999999999,12345678901\n' +
                      'João Pedro Oliveira,joao.pedro@email.com,1985-03-20,11888888888,98765432100';
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_clientes.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Importar Clientes via CSV
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box mb={3}>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Formato do arquivo CSV:</strong><br />
              • Colunas: nome, email, nascimento, telefone, cpf<br />
              • Data de nascimento no formato: AAAA-MM-DD<br />
              • Telefone: apenas números (11999999999)<br />
              • CPF: apenas números (12345678901)
            </Typography>
          </Alert>

          <Box display="flex" gap={2} mb={3}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={downloadTemplate}
              size="small"
            >
              Baixar Template
            </Button>
          </Box>

          <Paper
            variant="outlined"
            sx={{
              p: 3,
              textAlign: 'center',
              border: '2px dashed',
              borderColor: file ? 'success.main' : 'grey.300',
              bgcolor: file ? 'success.50' : 'grey.50',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'primary.50'
              }
            }}
          >
            <Button
              component="label"
              variant={file ? "contained" : "outlined"}
              startIcon={<CloudUpload />}
              size="large"
              color={file ? "success" : "primary"}
            >
              {file ? `Arquivo: ${file.name}` : 'Selecionar Arquivo CSV'}
              <VisuallyHiddenInput
                type="file"
                accept=".csv"
                onChange={handleFileChange}
              />
            </Button>
            
            {file && (
              <Box mt={2}>
                <Chip
                  label={`${(file.size / 1024).toFixed(1)} KB`}
                  color="success"
                  size="small"
                />
              </Box>
            )}
          </Paper>
        </Box>

        {loading && (
          <Box mb={3}>
            <Typography variant="body2" gutterBottom>
              Processando arquivo...
            </Typography>
            <LinearProgress />
          </Box>
        )}

        {result && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Resultado da Importação
            </Typography>
            
            <Box display="flex" gap={2} mb={2}>
              <Chip
                icon={<Info />}
                label={`${result.totalLinhas} linhas processadas`}
                color="info"
              />
              <Chip
                icon={<CheckCircle />}
                label={`${result.sucessos} sucessos`}
                color="success"
              />
              <Chip
                icon={<Error />}
                label={`${result.erros} erros`}
                color="error"
              />
            </Box>

            {result.detalhes.errosEncontrados.length > 0 && (
              <Box mb={2}>
                <Typography variant="subtitle2" color="error" gutterBottom>
                  Erros Encontrados:
                </Typography>
                <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
                  <List dense>
                    {result.detalhes.errosEncontrados.map((erro, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={erro}
                          primaryTypographyProps={{ variant: 'body2', color: 'error' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Box>
            )}

            {result.detalhes.clientesImportados.length > 0 && (
              <Box>
                <Typography variant="subtitle2" color="success.main" gutterBottom>
                  Clientes Importados com Sucesso:
                </Typography>
                <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
                  <List dense>
                    {result.detalhes.clientesImportados.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`Linha ${item.linha}: ${item.cliente.nome}`}
                          secondary={item.cliente.email}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          {result ? 'Fechar' : 'Cancelar'}
        </Button>
        {!result && (
          <Button
            onClick={handleImport}
            variant="contained"
            disabled={!file || loading}
            startIcon={<CloudUpload />}
          >
            {loading ? 'Importando...' : 'Importar'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ImportarClientesCSV;
