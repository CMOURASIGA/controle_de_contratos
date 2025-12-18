import { RepresentantesContent } from "@/components/representantes/RepresentantesContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editar Representante | RENAR",
  description: "Edite os dados do representante cadastrado no RENAR",
};

export default function EditarRepresentante() {
  return <RepresentantesContent />;
}
