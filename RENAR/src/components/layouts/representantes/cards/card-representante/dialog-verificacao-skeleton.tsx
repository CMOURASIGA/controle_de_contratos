import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
} from "@cnc-ti/layout-basic";

/**
 * Skeleton para o dialog de verificação de exclusão
 */
export function DialogVerificacaoSkeleton() {
    return (
        <Dialog open={true}>
            <DialogContent className="bg-white">
                <div className="flex flex-col items-center max-w-lg mx-auto mt-4 ">
                    <div className="size-12 rounded-full bg-gray-200 animate-pulse mb-4" />
                    <DialogTitle>
                        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                    </DialogTitle>
                </div>
                <div className="flex flex-col items-center space-y-3 mt-1">
                    <span className="block h-4 w-full bg-gray-200 rounded animate-pulse" />
                    <span className="block h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                    <span className="block h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                </div>
                <DialogFooter>
                    <div className="flex gap-3">
                        <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
                        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
