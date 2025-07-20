export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface ClienteRequest {
  nome: string;
  email: string;
  nascimento: string;
  telefone?: string;
  cpf?: string;
}

export interface VendaRequest {
  valor: number;
  data: string;
  clienteId: string;
}

export interface EstatisticasResponse {
  totalDia: number;
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

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ClientesResponse {
  data: any[];
  pagination: PaginationInfo;
}
