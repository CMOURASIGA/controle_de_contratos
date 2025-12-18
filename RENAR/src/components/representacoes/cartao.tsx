import IconeBandeira from "@/icons/IconeBandeira";
import IconeDocumento from "@/icons/IconeDocumento";
import IconeEditar from "@/icons/IconeEditar";
import IconeMedalha from "@/icons/IconeMedalha";
import IconePasta from "@/icons/IconePasta";
import IconeUsuarios from "@/icons/IconeUsuarios";
import { Representacao } from "@/types/representacao.type";
import {
  Card,
  CardContent,
  CardFooter,
  CardFooterItem,
  CardHeader,
} from "@cnc-ti/layout-basic";
import Link from "next/link";
import { Tooltip } from "../layouts/ui/tooltip/tooltip";

interface CartaoProps {
  data: Representacao;
}

export default function Cartao({ data }: CartaoProps) {
  return (
    <>
      <Card className="">
        <CardHeader>
          <div>
            <h3>
              {/* <Badge variant="primary">{data.nmeRprstc}</Badge> */}
              {data.nome || "Nome da Representação"}
            </h3>
            {/* <p className="text-md mt-2 font-semibold text-[#004A8D]">
              {data.sglRprstc || 'Sigla da Representação'}
            </p> */}
          </div>
        </CardHeader>
        <CardContent className="h-full">
          <p
            className="text-sm text-gray-600 overflow-hidden text-ellipsis break-words h-full"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 5,
              WebkitBoxOrient: "vertical",
            }}
          >
            <p className="text-sm font-bold">
              {(data.perfil?.length || 0) > 100 ? (
                <Tooltip text={data.perfil || ""}>
                  {(data.perfil || "").substring(0, 100) + "..."}
                </Tooltip>
              ) : (
                data.perfilRepresentacao || ""
              )}
            </p>
          </p>
        </CardContent>
        <CardFooter>
          <CardFooterItem>
            <button className="cnc-text-brand-blue-500">
              <Link href={`clausulas/${1}`}>
                {/* <IconSearch /> */}
                <IconeEditar />
              </Link>
            </button>
          </CardFooterItem>
          <CardFooterItem>
            <button
              className="cnc-text-brand-blue-500"
              onClick={() => {
                // addQueryString("clausulaId", clausula.id.toString());
                // openNegotiation();
              }}
            >
              <IconeUsuarios />
            </button>
          </CardFooterItem>
          <CardFooterItem>
            <button
              className="cnc-text-brand-blue-500"
              onClick={() => {
                // addQueryString("clausulaId", clausula.id.toString());
                // openNegotiation();
              }}
            >
              <IconeMedalha />
            </button>
          </CardFooterItem>
          <CardFooterItem>
            <button
              className="cnc-text-brand-blue-500"
              onClick={() => {
                // addQueryString("clausulaId", clausula.id.toString());
                // openNegotiation();
              }}
            >
              <IconeDocumento />
            </button>
          </CardFooterItem>
          <CardFooterItem>
            <button
              className="cnc-text-brand-blue-500"
              onClick={() => {
                // addQueryString("clausulaId", clausula.id.toString());
                // openNegotiation();
              }}
            >
              <IconePasta />
            </button>
          </CardFooterItem>
          <CardFooterItem>
            <button
              className="cnc-text-brand-blue-500"
              onClick={() => {
                // addQueryString("clausulaId", clausula.id.toString());
                // openNegotiation();
              }}
            >
              <IconeBandeira />
            </button>
          </CardFooterItem>
        </CardFooter>
      </Card>
    </>
  );
}
