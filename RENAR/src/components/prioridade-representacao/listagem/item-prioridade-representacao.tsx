import { Card, CardContent, CardFooter, CardFooterItem, CardHeader } from "@cnc-ti/layout-basic";
import Link from "next/link";
import SearchIcon from "@/components/layouts/ui/icons/search";
import { PencilIcon } from "@/components/layouts/ui/icons/pincel";
import { PrioridadeRepresentacao } from "@/services/prioridade-representacao.service";
import { formatDateToDDMMYYYY } from "@/utils/generate-format-date";

interface ItemPrioridadeRepresentacaoProps {
  key: string;
  dados: PrioridadeRepresentacao;
}

export default function ItemPrioridadeRepresentacao({ dados }: ItemPrioridadeRepresentacaoProps) {
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
                Descrição
              </span>
              <span>{dados.descricao || "Não informado"}</span>
            </div>
            <div>
              <span className="block font-semibold text-slate-800">
                Data de Cadastro
              </span>
              <span>{dados.dataCadastro ? formatDateToDDMMYYYY(dados.dataCadastro) : "Não informado"}</span>
            </div>
            <div>
              <span className="block font-semibold text-slate-800">
                Data de Alteração
              </span>
              <span>{dados.dataAlteracao ? formatDateToDDMMYYYY(dados.dataAlteracao) : "Não informado"}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="text-slate-600">
          <CardFooterItem>
            <Link
              href={`/prioridade-representacao/${dados.id}`}
              className="hover:text-blue-800 transition-all"
              title="Visualizar Prioridade de Representação"
            >
              <SearchIcon />
            </Link>
          </CardFooterItem>
          <CardFooterItem>
            <Link
              href={`/prioridade-representacao/editar/${dados.id}`}
              className="hover:text-blue-800 transition-all"
              title="Editar Prioridade de Representação"
            >
              <PencilIcon />
            </Link>
          </CardFooterItem>
        </CardFooter>
      </Card>
    </>
  )
}