export function DadosPessoaisFormSkeleton() {
    return (
        <div className="bg-white rounded-lg py-6 animate-pulse">
            {/* Header com Avatar */}
            <div className="flex flex-col lg:flex-row items-center gap-6 justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-3">
                        <div className="h-8 bg-gray-200 rounded w-64" />
                        <div className="h-4 bg-gray-200 rounded w-48" />
                    </div>
                </div>
            </div>

            {/* Grid de Labels */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-24" />
                        <div className="h-5 bg-gray-200 rounded w-full" />
                    </div>
                ))}
            </div>

            {/* Título Endereços */}
            <div className="my-4">
                <div className="h-8 bg-gray-200 rounded w-32" />
            </div>

            {/* Seção de Endereços */}
            <div className="space-y-6 mb-8">
                {/* Radio buttons */}
                <div className="border border-gray-200 rounded-lg p-4">
                    <div className="h-6 bg-gray-200 rounded w-56 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-full max-w-2xl mb-4" />
                    <div className="flex gap-4">
                        <div className="h-5 bg-gray-200 rounded w-32" />
                        <div className="h-5 bg-gray-200 rounded w-32" />
                    </div>
                </div>

                {/* Endereço Residencial */}
                <div className="space-y-4">
                    <div className="border-b border-gray-200 pb-2">
                        <div className="h-6 bg-gray-200 rounded w-56" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={`res-${i}`} className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-20" />
                                <div className="h-10 bg-gray-200 rounded w-full" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Endereço Comercial */}
                <div className="space-y-4 mb-4">
                    <div className="border-b border-gray-200 pb-2">
                        <div className="h-6 bg-gray-200 rounded w-56" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={`com-${i}`} className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-20" />
                                <div className="h-10 bg-gray-200 rounded w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="border-b border-gray-200 my-4" />

            {/* Título Contatos */}
            <div className="my-4">
                <div className="h-8 bg-gray-200 rounded w-32" />
            </div>

            {/* Seção de Contatos */}
            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32" />
                        <div className="h-10 bg-gray-200 rounded w-full" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-24" />
                        <div className="h-10 bg-gray-200 rounded w-full" />
                    </div>
                    <div className="h-10 bg-gray-200 rounded w-32 self-end" />
                </div>
                {/* Tabela de contatos */}
                <div className="space-y-2">
                    {[1, 2].map((i) => (
                        <div key={`contact-${i}`} className="h-12 bg-gray-200 rounded w-full" />
                    ))}
                </div>
            </div>

            {/* Botão de ação */}
            <div className="flex items-center justify-end border-t border-gray-200 pt-4 mt-8">
                <div className="h-10 bg-gray-200 rounded w-40" />
            </div>
        </div>
    );
}