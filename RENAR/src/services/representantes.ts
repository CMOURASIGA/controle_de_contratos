export const fetchAllrepresentantes = async () => {
  return [
    {
      id: 1,
      nome: "Lucas Andrade Pereira",
      cpf: "123.456.789-00",
      identidade: "MG-12.345.678",
      data_emissao: "2025-07-19",
      nis: "12345678901",
      orgao_emissor: "SSP-MG",
      data_nascimento: "1990-07-19",
      naturalidade: "Belo Horizonte - MG",
      pais: "BR",
      uf: "RJ",
      cidade: "",
      bairro: "",
      logradouro: "",
      complemento: "",
      numero: "",
      cep: "",
      tipo_endereco: "",
    },
    {
      id: 2,
      nome: "Mariana Costa Ribeiro",
      cpf: "987.654.321-99",
      identidade: "SP-98.765.432",
      data_emissao: "2025-07-19",
      nis: "98765432100",
      orgao_emissor: "SSP-SP",
      data_nascimento: "1990-07-19",
      naturalidade: "São Paulo - SP",
    },
    {
      id: 3,
      nome: "Felipe Oliveira Santos",
      cpf: "321.654.987-11",
      identidade: "RJ-45.678.901",
      data_emissao: "2025-07-19",
      nis: "32165498712",
      orgao_emissor: "DETRAN-RJ",
      data_nascimento: "1990-07-19",
      naturalidade: "Rio de Janeiro - RJ",
    },
    {
      id: 4,
      nome: "Beatriz Mendes Carvalho",
      cpf: "456.789.123-22",
      identidade: "PR-56.789.012",
      data_emissao: "2025-07-19",
      nis: "45678912345",
      orgao_emissor: "SSP-PR",
      data_nascimento: "1990-07-19",
      naturalidade: "Curitiba - PR",
    },
    {
      id: 5,
      nome: "Rafael Martins Gonçalves",
      cpf: "654.321.987-33",
      identidade: "BA-67.890.123",
      data_emissao: "2025-07-19",
      nis: "65432198766",
      orgao_emissor: "SSP-BA",
      data_nascimento: "1990-07-19",
      naturalidade: "Salvador - BA",
    },
    {
      id: 6,
      nome: "Camila Ferreira Nogueira",
      cpf: "741.852.963-44",
      identidade: "RS-78.901.234",
      data_emissao: "2025-07-19",
      nis: "74185296377",
      orgao_emissor: "SSP-RS",
      data_nascimento: "1990-07-19",
      naturalidade: "Porto Alegre - RS",
    },
    {
      id: 7,
      nome: "João Henrique Barros Lima",
      cpf: "852.963.741-55",
      identidade: "DF-89.012.345",
      data_emissao: "2025-07-19",
      nis: "85296374188",
      orgao_emissor: "SSP-DF",
      data_nascimento: "1990-07-19",
      naturalidade: "Brasília - DF",
    },
    {
      id: 8,
      nome: "Ana Paula Rocha Almeida",
      cpf: "963.741.852-66",
      identidade: "CE-90.123.456",
      data_emissao: "2025-07-19",
      nis: "96374185299",
      orgao_emissor: "SSP-CE",
      data_nascimento: "1990-07-19",
      naturalidade: "Fortaleza - CE",
    },
    {
      id: 9,
      nome: "Gabriel Souza Monteiro",
      cpf: "159.357.486-77",
      identidade: "PE-12.234.567",
      data_emissao: "2025-07-19",
      nis: "15935748600",
      orgao_emissor: "SSP-PE",
      data_nascimento: "1990-07-19",
      naturalidade: "Recife - PE",
    },
    {
      id: 10,
      nome: "Larissa Teixeira Campos",
      cpf: "258.456.789-88",
      identidade: "AM-23.345.678",
      data_emissao: "2025-07-19",
      nis: "25845678911",
      orgao_emissor: "SSP-AM",
      data_nascimento: "1990-07-19",
      naturalidade: "Manaus - AM",
    },
  ];
};
export const fetchDadosBancariosrepresentantes = async () => {
  return {
    banco: "bb",
    conta: "1234",
    agencia: "0001",
    tipoConta: "conta corrente",
  };
};
export const fetchDadosProfissionaisRepresentantes = async () => {
  return {
    miniCurriculo: "engenheiro de respeito",
    profissao: "engenheiro",
  };
};


const dadosSimulados = [
  { id: 1, numero: "960711", nome: "Joana Maria de Oliveira Guimarães", profissao: "Advogada", categoria: "CARF", dataInclusao: "2023-01-15", dataAlteracao: "2023-05-20", inativo: false },
  { id: 2, numero: "6", nome: "Abel Gomes da Rocha Filho", profissao: "Comerciante", categoria: "Membro da Diretoria e Conselho", dataInclusao: "2022-03-10", dataAlteracao: "2023-02-05", inativo: true },
  { id: 3, numero: "924473", nome: "Abel Leitão", profissao: "Engenheiro", categoria: "Sistema Comércio", dataInclusao: "2022-07-22", dataAlteracao: "2022-07-22", inativo: false },
  { id: 4, numero: "8", nome: "Abelardo Campoy Diaz", profissao: "Advogado", categoria: "Sistema Comércio", dataInclusao: "2021-11-30", dataAlteracao: "2023-04-12", inativo: false },
  { id: 5, numero: "20", nome: "Abram Szajman", profissao: "Administrador de Empresas", categoria: "Membro da Diretoria e Conselho", dataInclusao: "2022-05-18", dataAlteracao: "2023-01-07", inativo: false },
  { id: 6, numero: "7749", nome: "Acelino Antônio Carús Guedes", profissao: "Professor", categoria: "Especialista Externo", dataInclusao: "2021-09-14", dataAlteracao: "2022-10-25", inativo: true },
  { id: 7, numero: "77249", nome: "Adelmir Araújo Santana", profissao: "Administrador de Empresas", categoria: "Membro da Diretoria e Conselho", dataInclusao: "2022-02-28", dataAlteracao: "2022-02-28", inativo: false },
  { id: 8, numero: "5871", nome: "Ademir dos Santos", profissao: "Empresário", categoria: "Membro da Diretoria e Conselho", dataInclusao: "2023-03-05", dataAlteracao: "2023-06-18", inativo: false },
  { id: 9, numero: "48", nome: "Aderson Santos da Frota", profissao: "Não informado", categoria: "Membro da Diretoria e Conselho", dataInclusao: "2021-08-17", dataAlteracao: "2022-11-09", inativo: true },
  { id: 10, numero: "6448", nome: "Adib Miguel Eid", profissao: "Não informado", categoria: "Especialista Externo", dataInclusao: "2022-04-30", dataAlteracao: "2023-03-22", inativo: false },
];

export const buscarRepresentantePeloId = async (representanteId: number) => {
  await new Promise(resolve => setTimeout(resolve, 2000))

  return dadosSimulados.find(representante => representante.id === representanteId)
}