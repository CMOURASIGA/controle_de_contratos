"use client";
import {
  HandleChangeEntityDto,
  useSessionEntity,
} from "@/hooks/useSessionEntity";
import {
  Button,
  Header,
  HeaderContainer,
  HeaderProfileHeader,
  HeaderProfileItem,
  ModalEntidade,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sidebar,
  SidebarContainer,
  SidebarImageBrand,
  SidebarNavCollapse,
  SidebarNavLink,
} from "@cnc-ti/layout-basic";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useMain } from "./_hooks/use-main";
import { SkeletonSelectEntities } from "./skeleton-entities";

interface MainProps {
  children: React.ReactNode;
}

interface NavItem {
  title: string;
  icon?: string;
  url: string;
  enable: boolean;
  children?: Omit<NavItem, "children">[];
  role?: string[];
}

const sidebarMenuItems: NavItem[] = [
  {
    title: "Home",
    icon: "fa-solid fa-house",
    url: "/",
    enable: true,
    role: ["admin", "basic"],
  },
  {
    title: "Representações",
    icon: "fa-solid fa-file-contract",
    url: "/representacoes",
    enable: true,
    role: ["admin", "basic"],
  },
  {
    title: "Representantes",
    icon: "fa-solid fa-file-contract",
    url: "/representantes",
    enable: true,
    role: ["admin", "basic"],
  },
  {
    title: "Órgãos",
    icon: "fa-solid fa-file-contract",
    url: "/orgaos",
    enable: true,
    role: ["admin", "basic"],
  },
  {
    title: "Atividades",
    icon: "fa-solid fa-calendar-days",
    url: "/atividades",
    enable: true,
    role: ["admin", "basic"],
  },
  {
    title: "Operacional",
    url: "#",
    enable: true,
    role: ["admin", "basic"],
    icon: "fa-solid fa-gear",
    children: [
      {
        title: "Mandatos/Eventos",
        icon: "fa-solid fa-file-contract",
        url: "/mandatos",
        enable: true,
        role: ["admin", "basic"],
      },
    ],
  },
  {
    title: "Parametros",
    url: "#",
    enable: true,
    role: ["admin", "basic"],
    icon: "fa-solid fa-cog",
    children: [
      {
        title: "Motivos de Cancelamento",
        icon: "fa-solid fa-ban",
        url: "/motivos-cancelamento",
        enable: true,
        role: ["admin", "basic"],
      },
      {
        title: "Tipos de Mandato",
        icon: "fa-solid fa-file-contract",
        url: "/tipos-mandato",
        enable: true,
        role: ["admin", "basic"],
      },
      {
        title: "Texto Web",
        icon: "fa-solid fa-file-lines",
        url: "/texto-web",
        enable: true,
        role: ["admin", "basic"],
      },
      {
        title: "Tipo Perfil",
        icon: "fa-solid fa-file-lines",
        url: "/tipo-perfil",
        enable: true,
        role: ["admin", "basic"],
      },
      {
        title: "Categoria",
        icon: "fa-solid fa-tags",
        url: "/categorias",
        enable: true,
        role: ["admin", "basic"],
      },
      {
        title: "Cargos",
        icon: "fa-solid fa-file-contract",
        url: "/cargos",
        enable: true,
        role: ["admin", "basic"],
      },
      {
        title: "Tipo Órgão",
        icon: "fa-solid fa-file-contract",
        url: "/tipos-orgaos",
        enable: true,
        role: ["admin", "basic"],
      },
      {
        title: "Área Temática",
        icon: "fa-solid fa-file-contract",
        url: "/area-tematica",
        enable: true,
        role: ["admin", "basic"],
      },
      {
        title: "Prioridade de Representação",
        icon: "fa-solid fa-file-contract",
        url: "/prioridade-representacao",
        enable: true,
        role: ["admin", "basic"],
      },
      {
        title: "Funções",
        icon: "fa-solid fa-file-contract",
        url: "/funcoes",
        enable: true,
        role: ["admin", "basic"],
      },
      {
        title: "Tipos de Reunião",
        icon: "fa-solid fa-file-contract",
        url: "/tipo-reuniao",
        enable: true,
        role: ["admin", "basic"],
      },
    ],
  },
];

export function Main({ children }: MainProps) {
  const methods = useForm<HandleChangeEntityDto>({});
  const {
    collapsed,
    toggleSidebar,
    user,
    isOpenChangeEntity,
    toggleOpenChangeEntity,
    entitiesOptions,
    handleChangeEntity,
    setIsOpenChangeEntity,
  } = useMain();

  const { userRole } = useSessionEntity();

  return (
    <div className="flex w-full">
      {/* Sidebar */}
      <div
        data-open-sidebar={collapsed}
        className={`
          fixed left-0 top-0 z-40 cnc-bg-primary-800 transition-all duration-300
          ${collapsed ? "w-screen md:w-[280px]" : "w-0 relative"}
        `}
      >
        <SidebarContainer isOpen={collapsed} onChange={toggleSidebar}>
          <SidebarImageBrand
            // img={{
            //   src: "/logotipo.svg",
            //   alt: "Sistema de Negociação coletiva do Comércio",
            // }}
            onChangeToggle={toggleSidebar}
            asChild
          >
            <Link href="/">
              <Image
                src="/logotipo.svg"
                alt="Sistema de Negociação coletiva do Comércio"
                width={100}
                height={100}
              />
            </Link>
          </SidebarImageBrand>

          <Sidebar type="multiple">
            {sidebarMenuItems.map((menu, index) =>
              menu.role && menu.role.includes(String(userRole)) ? (
                !!menu.children ? (
                  <SidebarNavCollapse
                    key={`${index}-${menu.url}`}
                    title={menu.title}
                    value={`value-${index}-${menu.url}`}
                    icon={<i className={menu.icon + " icon__nav"}></i>}
                  >
                    {menu.children.map((submenu, index) => (
                      <SidebarNavLink
                        href={submenu.url}
                        key={`${index}-${submenu.url}`}
                        aria-disabled={!submenu.enable}
                        style={{
                          opacity: !submenu.enable ? 0.6 : 1,
                          pointerEvents: !submenu.enable ? "none" : undefined,
                        }}
                      >
                        {submenu.icon && (
                          <i className={submenu.icon + " icon__nav"}></i>
                        )}
                        {submenu.title}
                      </SidebarNavLink>
                    ))}
                  </SidebarNavCollapse>
                ) : (
                  <SidebarNavLink
                    href={menu.url}
                    key={`${index}-${menu.url}`}
                    aria-disabled={!menu.enable}
                    style={{
                      opacity: !menu.enable ? 0.6 : 1,
                      pointerEvents: !menu.enable ? "none" : undefined,
                    }}
                  >
                    {menu.icon && <i className={menu.icon + " icon__nav"}></i>}
                    {menu.title}
                  </SidebarNavLink>
                )
              ) : null
            )}
          </Sidebar>
        </SidebarContainer>
      </div>

      {/* (Header + Content) */}
      <div
        className={`
          flex flex-col flex-1 transition-all duration-300
           ${collapsed ? "pl-[280px]" : "pl-0"}
        `}
      >
        <Header className="z-10">
          <HeaderContainer onOpenMenu={toggleSidebar} isOpen={collapsed}>
            <HeaderProfileHeader user={user}>
              <HeaderProfileItem
                onClick={() => setIsOpenChangeEntity(true)}
                icon={
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1"
                  >
                    <path
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="32"
                      d="M320 120l48 48-48 48"
                    ></path>
                    <path
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="32"
                      d="M352 168H144a80.24 80.24 0 00-80 80v16m128 128l-48-48 48-48"
                    ></path>
                    <path
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="32"
                      d="M160 344h208a80.24 80.24 0 0080-80v-16"
                    ></path>
                  </svg>
                }
              >
                Trocar entidades
              </HeaderProfileItem>

              <HeaderProfileItem
                onClick={() => signOut()}
                icon={
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1"
                  >
                    <path
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="32"
                      d="M304 336v40a40 40 0 01-40 40H104a40 40 0 01-40-40V136a40 40 0 0140-40h152c22.09 0 48 17.91 48 40v40m64 160l80-80-80-80m-192 80h256"
                    ></path>
                  </svg>
                }
              >
                Sair
              </HeaderProfileItem>
            </HeaderProfileHeader>
          </HeaderContainer>
        </Header>

        <ModalEntidade
          title="Trocar entidade"
          onOpenChange={toggleOpenChangeEntity}
          isOpen={isOpenChangeEntity}
        >
          <>
            {entitiesOptions?.length ? (
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleChangeEntity)}>
                  <div className="flex gap-4 w-full flex-col md:flex-row">
                    <div className="w-full md:w-80">
                      <Controller
                        name="entityId"
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={entitiesOptions[0].value}
                            disabled
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a entidade" />
                            </SelectTrigger>
                            <SelectContent className="max-w-[442px] md:w-80">
                              {entitiesOptions?.map((entity) => (
                                <SelectItem
                                  key={entity.value}
                                  value={entity.value!}
                                >
                                  {entity.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={
                        true
                        // !methods.watch('entityId') || !entitiesOptions?.length
                      }
                    >
                      Trocar entidade
                    </Button>
                  </div>
                </form>
              </FormProvider>
            ) : (
              <SkeletonSelectEntities />
            )}
          </>
        </ModalEntidade>

        {/* Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
