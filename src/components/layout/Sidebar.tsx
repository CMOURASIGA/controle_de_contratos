"use client";

import Link from "next/link";
import { SidebarNav } from "./SidebarNav";
import { cn } from "@/lib/utils";
import { Building } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const sidebarContent = (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-3 font-semibold group">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Building className="h-6 w-6 text-primary" />
          </div>
          <span className="text-lg font-bold text-primary">
            ContratosPRO
          </span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <SidebarNav />
      </div>
      <div className="p-4 border-t border-slate-200">
        <div className="text-xs text-muted-foreground text-center">
          <p>© 2025 ContratosPRO</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="flex flex-col p-0 w-72">
          {sidebarContent}
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block border-r bg-white">
        {sidebarContent}
      </aside>
    </>
  );
}

