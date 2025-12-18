export function FormularioMandatosSkeleton() {
    const placeholders = Array.from({ length: 9 });

    return (
        <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {placeholders.map((_, index) => (
                    <div key={index} className="space-y-2">
                        <div className="h-3 w-24 bg-gray-200 rounded" />
                        <div className="h-10 w-full bg-gray-200 rounded" />
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-end border-t border-gray-200 pt-4 mt-4">
                <div className="h-10 w-32 bg-gray-200 rounded" />
            </div>
        </div>
    );
}
