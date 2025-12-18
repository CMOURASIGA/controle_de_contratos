"use client";

/**
 * Componente skeleton para campos de formulário
 */
function SkeletonCampo() {
  return (
    <div className="space-y-2">
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
      <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
    </div>
  );
}

/**
 * Componente skeleton para seção com título
 */
function SkeletonSecao({ titulo, children }: { titulo?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      {titulo && <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />}
      {children}
    </div>
  );
}

/**
 * Componente skeleton para tabela
 */
function SkeletonTabela({ linhas = 3 }: { linhas?: number }) {
  return (
    <div className="space-y-3">
      {/* Cabeçalho da tabela */}
      <div className="flex space-x-4">
        <div className="h-8 w-1/2 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-1/2 bg-gray-200 rounded animate-pulse" />
      </div>
      
      {/* Linhas da tabela */}
      {Array.from({ length: linhas }).map((_, index) => (
        <div key={index} className="flex space-x-4">
          <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton para aba de Dados Pessoais
 */
export function SkeletonDadosPessoais() {
  return (
    <div className="space-y-8">
      {/* Cabeçalho Profissional */}
      <div className="bg-white rounded-lg py-6">
        <div className="flex flex-col lg:flex-row items-center gap-6 justify-between">
          {/* Avatar e Informações Principais */}
          <div className="flex items-center gap-4">
            {/* Avatar Skeleton */}
            <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse" />
            
            <div className="flex-1 space-y-2">
              {/* Nome */}
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
              {/* Profissão */}
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              {/* CPF */}
              <div className="flex items-center gap-2">
                <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Informações Adicionais */}
          <div className="lg:min-w-[250px] flex flex-col">
            <div className="space-y-2">
              {/* Data de Cadastro */}
              <div className="flex justify-between">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
              {/* Data de Atualização */}
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Contatos */}
      <SkeletonSecao titulo>
        <SkeletonTabela linhas={2} />
      </SkeletonSecao>

      {/* Separador */}
      <div className="h-px w-full bg-slate-100" />

      {/* Dados Pessoais Detalhados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonCampo />
        <SkeletonCampo />
        <SkeletonCampo />
        <SkeletonCampo />
        <SkeletonCampo />
        <SkeletonCampo />
      </div>

      {/* Seção de Endereço */}
      <SkeletonSecao titulo>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCampo />
          <SkeletonCampo />
          <SkeletonCampo />
          <SkeletonCampo />
          <SkeletonCampo />
          <SkeletonCampo />
        </div>
      </SkeletonSecao>
    </div>
  );
}

/**
 * Skeleton para aba de Dados Bancários
 */
export function SkeletonDadosBancarios() {
  return (
    <div className="space-y-8">
      {/* Título da seção */}
      <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
      
      {/* Campos bancários */}
      <SkeletonSecao titulo>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCampo />
          <SkeletonCampo />
          <SkeletonCampo />
          <SkeletonCampo />
        </div>
      </SkeletonSecao>
    </div>
  );
}

/**
 * Skeleton para aba de Dados Profissionais
 */
export function SkeletonDadosProfissionais() {
  return (
    <div className="space-y-8">
      {/* Título da seção */}
      <div className="h-8 w-44 bg-gray-200 rounded animate-pulse" />
      
      {/* Campos profissionais */}
      <SkeletonSecao titulo>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCampo />
          <SkeletonCampo />
        </div>
      </SkeletonSecao>
    </div>
  );
}

/**
 * Skeleton para aba de Mandatos/Organizações
 */
export function SkeletonMandatosOrganizacoes() {
  return (
    <div className="space-y-8">
      {/* Título da seção */}
      <div className="h-8 w-52 bg-gray-200 rounded animate-pulse" />
      
      {/* Seção de Mandatos */}
      <SkeletonSecao titulo>
        <SkeletonTabela linhas={4} />
      </SkeletonSecao>

      {/* Seção de Organizações */}
      <SkeletonSecao titulo>
        <SkeletonTabela linhas={3} />
      </SkeletonSecao>
    </div>
  );
}

/**
 * Skeleton para aba de Outras Informações
 */
export function SkeletonOutrasInformacoes() {
  return (
    <div className="space-y-8">
      {/* Título da seção */}
      <div className="h-8 w-44 bg-gray-200 rounded animate-pulse" />
      
      {/* Campos adicionais */}
      <SkeletonSecao titulo>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCampo />
          <SkeletonCampo />
          <SkeletonCampo />
        </div>
      </SkeletonSecao>
    </div>
  );
}

export const SkeletonVisualizacaoRepresentante = {
  DadosPessoais: SkeletonDadosPessoais,
  DadosBancarios: SkeletonDadosBancarios,
  DadosProfissionais: SkeletonDadosProfissionais,
  MandatosOrganizacoes: SkeletonMandatosOrganizacoes,
  OutrasInformacoes: SkeletonOutrasInformacoes,
};