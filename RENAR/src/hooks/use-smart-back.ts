'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Hook customizado para navegação inteligente que ignora mudanças de query params
 * e volta para a página anterior real (origem da navegação)
 */
export function useSmartBack() {
    const router = useRouter();
    const entryUrlRef = useRef<string | null>(null);
    const isInitializedRef = useRef(false);

    useEffect(() => {
        if (!isInitializedRef.current) {
            isInitializedRef.current = true;

            if (typeof window !== 'undefined') {
                entryUrlRef.current = window.location.pathname;
            }
        }
    }, []);

    const goBackSafe = () => {
        if (typeof window === 'undefined') return;

        const currentPath = window.location.pathname;
        const intervalId = setInterval(() => {
            if (window.location.pathname !== currentPath) {
                clearInterval(intervalId);
            } else if (window.history.length > 1) {
                window.history.back();
            } else {
                clearInterval(intervalId);
                router.push('/');
            }
        }, 100);

        setTimeout(() => {
            clearInterval(intervalId);
        }, 3000);
    };

    return { goBackSafe };
}