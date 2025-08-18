"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Building, Book, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const mainNavItems = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/contracts", icon: FileText, label: "Contratos" },
];

const managementNavItems = [
  { href: "/cost-centers", icon: Building, label: "Centros de Custo" },
  { href: "/accounting-accounts", icon: Book, label: "Plano de Contas" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 px-4 py-4">
      {mainNavItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-primary",
            pathname === item.href && "bg-primary/10 text-primary"
          )}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </Link>
      ))}
      <Accordion type="single" collapsible defaultValue="management" className="w-full">
        <AccordionItem value="management" className="border-none">
          <AccordionTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-slate-700 hover:no-underline rounded-md hover:bg-slate-100">
            <span className="flex items-center gap-3">
              <Settings className="h-5 w-5" />
              Gestão
            </span>
          </AccordionTrigger>
          <AccordionContent className="pt-1">
            <div className="pl-4 flex flex-col gap-1">
              {managementNavItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-primary",
                    pathname.startsWith(item.href) && "bg-primary/10 text-primary"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </nav>
  );
}

