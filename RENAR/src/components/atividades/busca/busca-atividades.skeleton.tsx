"use client";

import { GradeAtividadesCarregando } from "../grade/grade-atividades-skeleton";

export default function BuscaAtividadesSkeleton() {
    return (
        <div className="space-y-6 pb-8">
            <header className="px-6">
                <div className="flex flex-col gap-y-6 lg:flex-row items-center">
                    <div className="flex flex-col lg:flex-row gap-6 items-center w-full">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-6 w-56 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 w-72 max-w-full bg-gray-100 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                    <div className="h-10 w-36 bg-gray-200 rounded animate-pulse" />
                </div>
            </header>

            <section className="px-6">
                <div className="px-8 py-10 border-b mb-8 bg-gray-50 rounded-md space-y-6 animate-pulse">
                    <div className="grid grid-cols-1 xl:grid-cols-[repeat(5,minmax(0,1fr))] gap-4 items-end">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="space-y-2">
                                <div className="h-4 w-40 bg-gray-200 rounded" />
                                <div className="h-10 w-full bg-gray-100 rounded" />
                            </div>
                        ))}

                        <div className="flex items-end justify-end gap-3">
                            <div className="h-10 w-10 bg-gray-200 rounded-md" />
                            <div className="h-10 w-28 bg-gray-200 rounded-md" />
                        </div>
                    </div>

                    <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="h-10 w-full bg-gray-100 rounded" />
                        <div className="h-10 w-full bg-gray-100 rounded" />
                    </div>
                </div>
            </section>

            <section className="px-6">
                <GradeAtividadesCarregando />
            </section>
        </div>
    );
}


