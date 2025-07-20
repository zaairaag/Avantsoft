export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  nascimento: string;
  telefone?: string;
  cpf?: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
  vendas?: Venda[];
}

export interface Venda {
  id: string;
  valor: number;
  data: string;
  clienteId: string;
  createdAt: string;
  updatedAt: string;
  cliente?: Cliente;
}

export interface Estatisticas {
  totalDia: number;
  totalOntem: number;
  crescimentoPercentual: number;
  totalClientes: number;
  totalVendas: number;
  vendasHoje: number;
  vendasOntem: number;
  maiorVolume: {
    cliente: string;
    valor: number;
  };
  maiorMedia: {
    cliente: string;
    media: number;
  };
  maiorFrequencia: {
    cliente: string;
    diasUnicos: number;
  };
}

export interface VendaPorDia {
  data: string;
  valor: number;
}