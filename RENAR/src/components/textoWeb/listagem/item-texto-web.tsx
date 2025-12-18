import { TextoWeb } from "@/services/texto-web.service";
import { Card, CardContent, CardFooter, CardFooterItem, CardHeader } from "@cnc-ti/layout-basic";
import Link from "next/link";
import SearchIcon from "@/components/layouts/ui/icons/search";
import { PencilIcon } from "@/components/layouts/ui/icons/pincel";

interface ItemTextoWebProps {
  key: string;
  dados: TextoWeb;
}

export default function ItemTextoWeb({ dados }: ItemTextoWebProps) {
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
                Título
              </span>
              <span>{dados.tituloTexto || "Não informado"}</span>
            </div>


            <div>
              <span className="block font-semibold text-slate-800">
                Resumo
              </span>
              <span>{dados.resumoTexto}</span>
            </div>
            
            <div>
              <span className="block font-semibold text-slate-800">
                Descrição
              </span>
              <span>
                { dados.descricaoTexto 
                  ? (dados.descricaoTexto.substring(0, 100) + (dados.descricaoTexto.length > 100 ? "..." : "")) 
                  : "Não informado"}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="text-slate-600">
          <CardFooterItem>
            <Link
              href={`/texto-web/${dados.id}`}
              className="hover:text-blue-800 transition-all"
              title="Visualizar Texto Web"
            >
              <SearchIcon />
            </Link>
          </CardFooterItem>
          <CardFooterItem>
            <Link
              href={`/texto-web/editar/${dados.id}`}
              className="hover:text-blue-800 transition-all"
              title="Editar Texto Web"
            >
              <PencilIcon />
            </Link>
          </CardFooterItem>
        </CardFooter>
      </Card>
    </>
  )
}