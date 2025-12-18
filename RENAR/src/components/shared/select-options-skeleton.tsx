export function SelectOptionsSkeleton({ count = 5 }: { count?: number }) {
    return (
        <div className="py-2 px-1">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="flex items-center gap-3 px-3 py-2 mb-1 animate-pulse"
                >
                    {/* Avatar/Ícone skeleton */}
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full" />

                    {/* Conteúdo texto skeleton */}
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function SelectOptionsSkeletonSimple({ count = 5 }: { count?: number }) {
    return (
        <div className="py-1">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 mb-0.5 animate-pulse"
                >
                    <div className="h-5 bg-gray-200 rounded w-full max-w-full" />
                </div>
            ))}
        </div>
    );
}

