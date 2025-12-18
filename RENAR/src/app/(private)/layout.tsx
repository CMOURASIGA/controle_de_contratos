import { ReactQueryProvider } from "@/infra/tanStack/ReactQueryWrapper";
import { DrawerProvider } from "@/providers/drawer-context";
import { ModalProvider } from "@/providers/modal-context";
import { Main } from "@/components/layouts/main";
import { AppProvider } from "@/providers/app";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export default async function PrivateLayout({ children }: PrivateLayoutProps) {
  return (
    <AppProvider>
      <ReactQueryProvider>
        <DrawerProvider>
          <ModalProvider>
            <Suspense>
              <ToastContainer
                hideProgressBar={true}
                pauseOnFocusLoss
                autoClose={3000}
                theme="dark"
              />
              <Main>{children}</Main>
            </Suspense>
          </ModalProvider>
        </DrawerProvider>
      </ReactQueryProvider>
    </AppProvider>
  );
}
