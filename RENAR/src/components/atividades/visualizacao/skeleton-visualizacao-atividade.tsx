"use client";

const SkeletonCampo = () => (
    <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
    </div>
);

const SkeletonSecao = ({ titulo, children }: { titulo?: string; children: React.ReactNode }) => (
    <div className="space-y-4">
        {titulo && (
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        )}
        {children}
    </div>
);

export function SkeletonDadosPrincipais() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SkeletonCampo />
                <SkeletonCampo />
                <SkeletonCampo />
                <SkeletonCampo />
                <SkeletonCampo />
                <SkeletonCampo />
            </div>
            <div className="mt-6">
                <SkeletonCampo />
            </div>
            <div className="mt-6">
                <SkeletonCampo />
            </div>
        </div>
    );
}

export function SkeletonCustosLogistica() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SkeletonCampo />
                <SkeletonCampo />
                <SkeletonCampo />
            </div>
            <div className="mt-6">
                <SkeletonCampo />
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <SkeletonCampo />
                <SkeletonCampo />
            </div>
        </div>
    );
}

export function SkeletonDetalhesPassagem() {
    return (
        <div className="space-y-6">
            <SkeletonSecao>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SkeletonCampo />
                    <SkeletonCampo />
                    <SkeletonCampo />
                    <SkeletonCampo />
                    <SkeletonCampo />
                </div>
            </SkeletonSecao>
            <SkeletonSecao>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

export const SkeletonVisualizacaoAtividade = {
    DadosPrincipais: SkeletonDadosPrincipais,
    CustosLogistica: SkeletonCustosLogistica,
    DetalhesPassagem: SkeletonDetalhesPassagem,
};

