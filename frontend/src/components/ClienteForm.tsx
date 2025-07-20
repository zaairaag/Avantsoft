import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Avatar,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Person, Save } from '@mui/icons-material';
import { Cliente } from '../types';

interface ClienteFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (clienteData: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  editingCliente?: Cliente | null;
  loading?: boolean;
  error?: string;
}

interface FormData {
  nome: string;
  email: string;
  nascimento: string;
  telefone: string;
  cpf: string;
}

const ClienteForm: React.FC<ClienteFormProps> = ({
  open,
  onClose,
  onSave,
  editingCliente,
  error,
}) => {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    nascimento: '',
    telefone: '',
    cpf: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();

  // Reset form when dialog opens/closes or editing cliente changes
  useEffect(() => {
    if (open) {
      if (editingCliente) {
        setFormData({
          nome: editingCliente.nome,
          email: editingCliente.email,
          nascimento: editingCliente.nascimento.split('T')[0],
          telefone: editingCliente.telefone || '',
          cpf: editingCliente.cpf || '',
        });
      } else {
        setFormData({
          nome: '',
          email: '',
          nascimento: '',
          telefone: '',
          cpf: '',
        });
      }
      setFormErrors({});
    }
  }, [open, editingCliente]);

  const validateForm = useCallback((): boolean => {
    const errors: Partial<FormData> = {};

    if (!formData.nome.trim()) {
      errors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido';
    }

    if (!formData.nascimento) {
      errors.nascimento = 'Data de nascimento é obrigatória';
    }

    // Validação de CPF (básica)
    if (formData.cpf && formData.cpf.replace(/\D/g, '').length !== 11) {
      errors.cpf = 'CPF deve ter 11 dígitos';
    }

    // Validação de telefone (básica)
    if (formData.telefone && formData.telefone.replace(/\D/g, '').length < 10) {
      errors.telefone = 'Telefone inválido';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [formErrors]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const clienteData = {
        nome: formData.nome.trim(),
        email: formData.email.trim().toLowerCase(),
        nascimento: formData.nascimento,
        ...(formData.telefone && { telefone: formData.telefone }),
        ...(formData.cpf && { cpf: formData.cpf }),
      };

      await onSave(clienteData);
      onClose();
    } catch (error) {
      // Error is handled by parent component
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSave, onClose]);

  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      handleSubmit();
    }
  }, [handleSubmit]);

  const isFormValid = formData.nome.trim() && formData.email.trim() && formData.nascimento;

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
          borderBottom: `1px solid ${theme.palette.divider}`,
          fontWeight: 600,
          fontSize: '1.25rem',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              width: 40,
              height: 40,
            }}
          >
            <Person />
          </Avatar>
          {editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }} onKeyPress={handleKeyPress}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            autoFocus
            label="Nome Completo"
            fullWidth
            variant="outlined"
            value={formData.nome}
            onChange={handleInputChange('nome')}
            error={!!formErrors.nome}
            helperText={formErrors.nome}
            required
            disabled={isSubmitting}
          />

          <TextField
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleInputChange('email')}
            error={!!formErrors.email}
            helperText={formErrors.email}
            required
            disabled={isSubmitting}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              label="Telefone"
              fullWidth
              variant="outlined"
              value={formData.telefone}
              onChange={handleInputChange('telefone')}
              error={!!formErrors.telefone}
              helperText={formErrors.telefone}
              placeholder="(11) 99999-9999"
              disabled={isSubmitting}
            />
            <TextField
              label="CPF"
              fullWidth
              variant="outlined"
              value={formData.cpf}
              onChange={handleInputChange('cpf')}
              error={!!formErrors.cpf}
              helperText={formErrors.cpf}
              placeholder="000.000.000-00"
              disabled={isSubmitting}
            />
          </Stack>

          <TextField
            label="Data de Nascimento"
            type="date"
            fullWidth
            variant="outlined"
            value={formData.nascimento}
            onChange={handleInputChange('nascimento')}
            error={!!formErrors.nascimento}
            helperText={formErrors.nascimento}
            InputLabelProps={{
              shrink: true,
            }}
            required
            disabled={isSubmitting}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button 
          onClick={onClose} 
          disabled={isSubmitting}
          sx={{ color: theme.palette.text.secondary }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid || isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={16} /> : <Save />}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            minWidth: 120,
          }}
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(ClienteForm);
