import { Card, CardContent, CardFooter, CardFooterItem, CardHeader } from "@cnc-ti/layout-basic";
import Link from "next/link";
import SearchIcon from "@/components/layouts/ui/icons/search";
import { PencilIcon } from "@/components/layouts/ui/icons/pincel";
import { Funcao } from "@/services/funcoes.service";

interface ItemFuncaoProps {
  key: string;
  dados: Funcao;
}

export default function ItemFuncao({ dados }: ItemFuncaoProps) {
  return (
    <>
      <Card className="pt-4" key={dados.id}>
        <CardHeader className="flex flex-row items-center justify-between">
          <span className="text-sm text-black">Nº {dados.id}</span>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 justify-between pt-4">
          <div className="space-y-4 text-sm text-slate-600">
            <div>
              <span className="block font-semibold text-slate-800">
                Nome
              </span>
              <span>{dados.nomeFuncao || "Não informado"}</span>
            </div>


            <div>
              <span className="block font-semibold text-slate-800">
                Nome da Função Pai
              </span>
              <span>{dados.nomePai || "Não informado"}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="text-slate-600">
          <CardFooterItem>
            <Link
              href={`/funcoes/${dados.id}`}
              className="hover:text-blue-800 transition-all"
              title="Visualizar Função"
            >
              <SearchIcon />
            </Link>
          </CardFooterItem>
          <CardFooterItem>
            <Link
              href={`/funcoes/editar/${dados.id}`}
              className="hover:text-blue-800 transition-all"
              title="Editar Função"
            >
              <PencilIcon />
            </Link>
          </CardFooterItem>
        </CardFooter>
      </Card>
    </>
  )
}