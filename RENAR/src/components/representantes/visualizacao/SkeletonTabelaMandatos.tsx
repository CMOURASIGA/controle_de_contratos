/**
 * Skeletons específicos para tabelas de mandatos e organizações
 * Utilizados quando apenas os dados de mandatos estão carregando (isLoadingMandatos)
 */

/**
 * Skeleton para tabela específica de mandatos
 */
export function SkeletonTabelaMandatos() {
  return (
    <div className="space-y-4">
      {/* Cabeçalho da tabela */}
      <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
      </div>
      
      {/* Linhas da tabela */}
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="grid grid-cols-5 gap-4 p-4 border-b border-gray-200">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton para tabela específica de organizações
 */
export function SkeletonTabelaOrganizacoes() {
  return (
    <div className="space-y-4">
      {/* Cabeçalho da tabela */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
      </div>
      
      {/* Linhas da tabela */}
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton combinado para a seção de mandatos e organizações
 * Usado quando isLoadingMandatos = true
 */
export function SkeletonMandatosOrganizacoesEspecifico() {
  return (
    <div className="space-y-8">
      {/* Seção de Mandatos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-8 w-24 bg-gray-300 rounded animate-pulse"></div>
        </div>
        <SkeletonTabelaMandatos />
      </div>

      {/* Seção de Organizações */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-36 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-8 w-24 bg-gray-300 rounded animate-pulse"></div>
        </div>
        <SkeletonTabelaOrganizacoes />
      </div>
    </div>
  );
}

/**
 * Skeleton para estado vazio de mandatos
 */
export function SkeletonMandatosVazio() {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="h-12 w-12 bg-gray-300 rounded-full mx-auto animate-pulse"></div>
      <div className="h-4 w-48 bg-gray-300 rounded mx-auto animate-pulse"></div>
      <div className="h-3 w-64 bg-gray-200 rounded mx-auto animate-pulse"></div>
    </div>
  );
}

/**
 * Skeleton para estado de erro de mandatos
 */
export function SkeletonMandatosErro() {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="h-12 w-12 bg-red-200 rounded-full mx-auto animate-pulse"></div>
      <div className="h-4 w-40 bg-red-200 rounded mx-auto animate-pulse"></div>
      <div className="h-3 w-56 bg-red-100 rounded mx-auto animate-pulse"></div>
      <div className="h-8 w-32 bg-red-200 rounded mx-auto animate-pulse"></div>
    </div>
  );
}