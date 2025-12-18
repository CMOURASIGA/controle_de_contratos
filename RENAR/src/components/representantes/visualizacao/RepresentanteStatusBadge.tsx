import { cn } from "@/utils";
import { useMemo } from "react";

interface RepresentanteStatusBadgeProps {
    representanteId?: number;
    isLoading: boolean;
    isNovo?: boolean;
}

export function RepresentanteStatusBadge({
    representanteId,
    isLoading,
    isNovo,
}: RepresentanteStatusBadgeProps) {
    const badgeContent = useMemo(() => {
        if (!representanteId || isLoading) return null;

        return (
            <div>
                <div
                    className={cn(
                        "inline-flex items-center justify-center border rounded-md text-sm font-medium ring-offset-background transition-colors text-white h-10 px-4 py-2",
                        isNovo
                            ? "cnc-bg-brand-blue-400 cnc-border-brand-blue-500"
                            : "bg-orange-400 border-orange-500"
                    )}
                >
                    {isNovo ? "NOVO" : "ALTERAÇÃO"}
                </div>
            </div>
        );
    }, [representanteId, isLoading, isNovo]);

    return badgeContent;
}

