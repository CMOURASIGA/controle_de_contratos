import { Card, CardContent, CardFooter, CardFooterItem, CardHeader } from "@cnc-ti/layout-basic";
import Link from "next/link";
import SearchIcon from "@/components/layouts/ui/icons/search";
import { PencilIcon } from "@/components/layouts/ui/icons/pincel";
import { AreaTematica } from "@/services/area-tematica.service";

interface ItemAreaTematicaProps {
  key: string;
  dados: AreaTematica;
}

export default function ItemAreaTematica({ dados }: ItemAreaTematicaProps) {
  return (
    <>
      <Card className="pt-4" key={dados.idCategoriaRepresentacao}>
        <CardHeader className="flex flex-row items-center justify-between">
          <span className="text-sm text-black">Nº {dados.idCategoriaRepresentacao}</span>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 justify-between pt-4">
          <div className="space-y-4 text-sm text-slate-600">
            <div>
              <span className="block font-semibold text-slate-800">
                Nome da Área Temática
              </span>
              <span>{dados.nome || "Não informado"}</span>
            </div>

            <div>
              <span className="block font-semibold text-slate-800">
                Descrição Web
              </span>
              <span>
                { dados.descricaoWeb 
                  ? (dados.descricaoWeb.substring(0, 100) + (dados.descricaoWeb.length > 100 ? "..." : "")) 
                  : "Não informado"}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="text-slate-600">
          <CardFooterItem>
            <Link
              href={`/area-tematica/${dados.idCategoriaRepresentacao}`}
              className="hover:text-blue-800 transition-all"
              title="Visualizar Área Temática"
            >
              <SearchIcon />
            </Link>
          </CardFooterItem>
          <CardFooterItem>
            <Link
              href={`/area-tematica/editar/${dados.idCategoriaRepresentacao}`}
              className="hover:text-blue-800 transition-all"
              title="Editar Área Temática"
            >
              <PencilIcon />
            </Link>
          </CardFooterItem>
        </CardFooter>
      </Card>
    </>
  )
}