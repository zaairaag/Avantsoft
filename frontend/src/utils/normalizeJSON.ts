interface ClienteRaw {
  info: {
    nomeCompleto: string;
    detalhes: {
      email: string;
      nascimento: string;
    };
  };
  duplicado?: {
    nomeCompleto: string;
  };
  estatisticas: {
    vendas: Array<{
      data: string;
      valor: number;
    }>;
  };
}

interface ClienteNormalizado {
  nome: string;
  email: string;
  nascimento: string;
  vendas: Array<{
    data: string;
    valor: number;
  }>;
  letraFaltante?: string;
}

export const normalizeClienteJSON = (rawData: any): ClienteNormalizado[] => {
  if (!rawData?.data?.clientes) {
    return [];
  }

  return rawData.data.clientes.map((cliente: ClienteRaw): ClienteNormalizado => {
    // Extrair dados principais
    const nome = cliente.info?.nomeCompleto || '';
    const email = cliente.info?.detalhes?.email || '';
    const nascimento = cliente.info?.detalhes?.nascimento || '';
    const vendas = cliente.estatisticas?.vendas || [];

    // Campo "letra faltante" - implementação de exemplo
    // Assume que é a primeira letra do alfabeto que não aparece no nome
    const letraFaltante = findMissingLetter(nome);

    return {
      nome,
      email,
      nascimento,
      vendas,
      letraFaltante,
    };
  });
};

// Função para encontrar a primeira letra faltante no nome
const findMissingLetter = (nome: string): string | undefined => {
  if (!nome) return undefined;

  const nomeUpper = nome.toUpperCase().replace(/\s/g, '');
  const letrasPresentes = new Set(nomeUpper.split(''));
  
  // Procurar a primeira letra do alfabeto que não está presente
  for (let i = 65; i <= 90; i++) { // A-Z
    const letra = String.fromCharCode(i);
    if (!letrasPresentes.has(letra)) {
      return letra;
    }
  }
  
  return undefined; // Todas as letras estão presentes
};

// Exemplo de como limpar dados duplicados/redundantes
export const cleanRedundantData = (rawData: any): any => {
  if (!rawData?.data) {
    return rawData;
  }

  return {
    clientes: rawData.data.clientes.map((cliente: any) => {
      // Remove campos duplicados/redundantes
      const { duplicado, ...cleanCliente } = cliente;
      return cleanCliente;
    }),
    meta: {
      total: rawData.meta?.registroTotal || 0,
      pagina: rawData.meta?.pagina || 1,
    }
  };
};