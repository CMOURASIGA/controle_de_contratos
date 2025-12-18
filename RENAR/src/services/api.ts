import { authOptions } from "@/lib/nextAuth/config";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";

export async function httpAuthServer(path: string, init?: RequestInit) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}${path}`;
  const session = await getServerSession(authOptions);
  return fetch(API_URL, {
    ...init,
    headers: {
      ...init?.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.id_token}`,
    },
  });
}

export async function httpAuthClient(path: string, init?: RequestInit) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}${path}`;
  const session = await getSession();
  return fetch(API_URL, {
    ...init,
    headers: {
      // "Content-Type": "application/json",
      ...init?.headers,
      Authorization: `Bearer ${session?.id_token}`,
    },
  });
}
