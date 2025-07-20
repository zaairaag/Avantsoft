import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,

  Avatar,
  Chip,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  Help,
  ExpandMore,
  QuestionAnswer,
  ContactSupport,
  BugReport,

  Send,
  Phone,
  Email,
  WhatsApp,
  Close,

  Info,
  Warning,
} from '@mui/icons-material';

interface SupportCenterProps {
  open: boolean;
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`support-tabpanel-${index}`}
      aria-labelledby={`support-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const SupportCenter: React.FC<SupportCenterProps> = ({ open, onClose }) => {
  const [tabValue, setTabValue] = useState(0);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    description: '',
    priority: 'medium',
    category: 'general',
  });
  const theme = useTheme();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSubmitTicket = () => {
    console.log('Enviando ticket:', ticketForm);
    // Aqui você implementaria a lógica para enviar o ticket
    alert('Ticket enviado com sucesso! Nossa equipe entrará em contato em breve.');
    setTicketForm({
      subject: '',
      description: '',
      priority: 'medium',
      category: 'general',
    });
  };

  const faqItems = [
    {
      question: 'Como cadastrar um novo cliente?',
      answer: 'Vá para a página "Clientes" e clique no botão "Adicionar Cliente". Preencha os dados necessários e clique em "Salvar".',
      category: 'Clientes',
    },
    {
      question: 'Como registrar uma nova venda?',
      answer: 'Na página "Vendas", clique em "Nova Venda", selecione o cliente, adicione os produtos e confirme a transação.',
      category: 'Vendas',
    },
    {
      question: 'Como visualizar relatórios de vendas?',
      answer: 'Acesse o Dashboard para ver métricas gerais ou vá para a página de Vendas para relatórios detalhados.',
      category: 'Relatórios',
    },
    {
      question: 'Como alterar minha senha?',
      answer: 'Clique no seu avatar no canto superior direito, vá em "Configurações" e depois em "Segurança" para alterar sua senha.',
      category: 'Conta',
    },
    {
      question: 'Como funciona a busca global?',
      answer: 'Use Ctrl+K ou clique no ícone de busca para abrir a busca global. Você pode procurar por clientes, vendas ou páginas do sistema.',
      category: 'Sistema',
    },
  ];

  const contactOptions = [
    {
      icon: <Email />,
      title: 'Email',
      description: 'suporte@reinobrinquedos.com',
      action: () => window.open('mailto:suporte@reinobrinquedos.com'),
      color: theme.palette.primary.main,
    },
    {
      icon: <Phone />,
      title: 'Telefone',
      description: '(11) 3000-0000',
      action: () => window.open('tel:+551130000000'),
      color: theme.palette.success.main,
    },
    {
      icon: <WhatsApp />,
      title: 'WhatsApp',
      description: '(11) 99999-9999',
      action: () => window.open('https://wa.me/5511999999999'),
      color: '#25D366',
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
            <Help />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Central de Ajuda & Suporte
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reino dos Brinquedos - Estamos aqui para ajudar!
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} sx={{ color: theme.palette.text.secondary }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab
              icon={<QuestionAnswer />}
              label="FAQ"
              iconPosition="start"
              sx={{ textTransform: 'none', fontWeight: 500 }}
            />
            <Tab
              icon={<ContactSupport />}
              label="Contato"
              iconPosition="start"
              sx={{ textTransform: 'none', fontWeight: 500 }}
            />
            <Tab
              icon={<BugReport />}
              label="Reportar Problema"
              iconPosition="start"
              sx={{ textTransform: 'none', fontWeight: 500 }}
            />
          </Tabs>
        </Box>

        {/* FAQ Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ px: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Perguntas Frequentes
            </Typography>
            <Stack spacing={1}>
              {faqItems.map((item, index) => (
                <Accordion
                  key={index}
                  sx={{
                    '&:before': { display: 'none' },
                    boxShadow: 'none',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '8px !important',
                    '&.Mui-expanded': {
                      margin: 0,
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      '&.Mui-expanded': {
                        minHeight: 48,
                      },
                      '& .MuiAccordionSummary-content': {
                        '&.Mui-expanded': {
                          margin: '12px 0',
                        },
                      },
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                      <Typography variant="body1" sx={{ fontWeight: 500, flex: 1 }}>
                        {item.question}
                      </Typography>
                      <Chip
                        label={item.category}
                        size="small"
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          fontSize: '0.7rem',
                        }}
                      />
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {item.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </Box>
        </TabPanel>

        {/* Contato Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ px: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Entre em Contato Conosco
            </Typography>
            <Stack spacing={2}>
              {contactOptions.map((option, index) => (
                <Card
                  key={index}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 24px ${alpha(option.color, 0.15)}`,
                    },
                  }}
                  onClick={option.action}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={3}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(option.color, 0.1),
                          color: option.color,
                          width: 48,
                          height: 48,
                        }}
                      >
                        {option.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {option.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {option.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            <Box sx={{ mt: 4, p: 3, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Info sx={{ color: theme.palette.info.main }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Horário de Atendimento
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </TabPanel>

        {/* Reportar Problema Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ px: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Reportar Problema ou Sugestão
            </Typography>
            <Stack spacing={3}>
              <TextField
                label="Assunto"
                fullWidth
                value={ticketForm.subject}
                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                placeholder="Descreva brevemente o problema..."
              />

              <TextField
                label="Categoria"
                select
                fullWidth
                value={ticketForm.category}
                onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                SelectProps={{ native: true }}
              >
                <option value="general">Geral</option>
                <option value="bug">Bug/Erro</option>
                <option value="feature">Sugestão de Melhoria</option>
                <option value="performance">Performance</option>
                <option value="ui">Interface</option>
              </TextField>

              <TextField
                label="Prioridade"
                select
                fullWidth
                value={ticketForm.priority}
                onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                SelectProps={{ native: true }}
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </TextField>

              <TextField
                label="Descrição Detalhada"
                multiline
                rows={4}
                fullWidth
                value={ticketForm.description}
                onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                placeholder="Descreva o problema em detalhes, incluindo passos para reproduzir se aplicável..."
              />

              <Box sx={{ p: 2, bgcolor: alpha(theme.palette.warning.main, 0.05), borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Warning sx={{ color: theme.palette.warning.main }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Dica:</strong> Seja o mais específico possível para que possamos ajudar você rapidamente.
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </TabPanel>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>
          Fechar
        </Button>
        {tabValue === 2 && (
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={handleSubmitTicket}
            disabled={!ticketForm.subject || !ticketForm.description}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              textTransform: 'none',
            }}
          >
            Enviar Ticket
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SupportCenter;
