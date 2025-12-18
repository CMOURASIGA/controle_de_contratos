import { Card, CardContent, CardFooter, CardFooterItem, CardHeader } from "@cnc-ti/layout-basic";
import { ResultContainer } from "../../layouts/resultContainer";

function ItemAtividadeSkeleton() {
    return (
        <Card className="pt-4">
            <CardHeader className="flex flex-col items-start gap-2">
                <div className="w-28 h-3 bg-gray-200 rounded animate-pulse" />
                <div className="w-20 h-5 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pt-4">
                <div>
                    <div className="w-32 h-3 mb-2 bg-gray-200 rounded animate-pulse" />
                    <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <div className="w-24 h-3 mb-2 bg-gray-200 rounded animate-pulse" />
                        <div className="w-28 h-4 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div>
                        <div className="w-24 h-3 mb-2 bg-gray-200 rounded animate-pulse" />
                        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <div className="w-20 h-3 mb-2 bg-gray-200 rounded animate-pulse" />
                        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div>
                        <div className="w-20 h-3 mb-2 bg-gray-200 rounded animate-pulse" />
                        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <CardFooterItem>
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                </CardFooterItem>
            </CardFooter>
        </Card>
    );
}

export function GradeAtividadesCarregando() {
    return (
        <ResultContainer aria-label="Carregando atividades">
            {Array.from({ length: 8 }).map((_, idx) => (
                <ItemAtividadeSkeleton key={idx} />
            ))}
        </ResultContainer>
    );
}
