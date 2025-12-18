import { Card, CardContent, CardFooter, CardFooterItem, CardHeader } from "@cnc-ti/layout-basic";
import Link from "next/link";
import SearchIcon from "@/components/layouts/ui/icons/search";
import { PencilIcon } from "@/components/layouts/ui/icons/pincel";
import { Categoria } from "@/services/categorias.service";

interface ItemCategoriaProps {
  key: string;
  dados: Categoria;
}

export default function ItemCategoria({ dados }: ItemCategoriaProps) {
  return (
    <>
      <Card className="pt-4" key={dados.idCategoria}>
        <CardHeader className="flex flex-row items-center justify-between">
          <span className="text-sm text-black">Nº {dados.idCategoria}</span>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 justify-between pt-4">
          <div className="space-y-4 text-sm text-slate-600">
            <div>
              <span className="block font-semibold text-slate-800">
                Nome da Categoria
              </span>
              <span>{dados.nomeCategoria || "Não informado"}</span>
            </div>


            <div>
              <span className="block font-semibold text-slate-800">
                Data de Criação
              </span>
              <span>
                {
                  dados?.dataCadastro 
                  ? new Date(dados.dataCadastro).toLocaleString() 
                  : "Não informado"
                }
              </span>
            </div>
            
            <div>
              <span className="block font-semibold text-slate-800">
                Data de Alteração
              </span>
              <span>
                {
                  dados?.dataAlteracao 
                  ? new Date(dados.dataAlteracao).toLocaleString() 
                  : "Não informado"
                }
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="text-slate-600">
          <CardFooterItem>
            <Link
              href={`/categorias/${dados.idCategoria}`}
              className="hover:text-blue-800 transition-all"
              title="Visualizar Categoria"
            >
              <SearchIcon />
            </Link>
          </CardFooterItem>
          <CardFooterItem>
            <Link
              href={`/categorias/editar/${dados.idCategoria}`}
              className="hover:text-blue-800 transition-all"
              title="Editar Categoria"
            >
              <PencilIcon />
            </Link>
          </CardFooterItem>
        </CardFooter>
      </Card>
    </>
  )
}