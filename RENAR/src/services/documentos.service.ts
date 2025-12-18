import { httpAuthClient } from "./api";

export const createDocuments = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  const response = await httpAuthClient("/storage/upload", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error(`Erro ao criar o mandato. Status: ${response.status}`);
  }
};

export const getDocument = async (nomeDocument: string) => {
  try {
    const res = await httpAuthClient(`/storage/download/${nomeDocument}`, {
      method: "GET",
    });
    const data = await res.blob();
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", nomeDocument);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return data;
  } catch (error) {
    console.error("Erro ao fazer o download do arquivo:", error);
  }
};
