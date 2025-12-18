import { Button } from "@cnc-ti/layout-basic";
import { cn } from "@/utils";

type ButtonSaveProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  saving?: boolean;
};

export function ButtonSaveAndLoading({ loading, saving, ...props }: ButtonSaveProps) {
  return (
    <Button
      {...props}
      className={cn("gap-2 flex items-center justify-center", props.className)}
      disabled={loading || saving || props.disabled}
    >
      {loading || saving ? (
        <>
          {/* Spinner simples com Tailwind */}
          <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <p>{saving ? "Salvando..." : "Carregando..."}</p>
        </>
      ) : (
        <p>Salvar alterações</p>
      )}
    </Button>
  );
}
