"use client";
import {
  PageHeaderActionsContainer,
  PageHeader as PageHeaderClient,
  PageHeaderTitle,
  PageHeaderTitleContent,
} from "@cnc-ti/layout-basic";
import { ButtonBack } from "../buttons/button-back/button-back";
import { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  goBack?: boolean;
  urlBack?: string;
  children?: ReactNode;
}

export function PageHeader({
  title,
  description,
  goBack = false,
  urlBack,
  children,
}: Props) {
  return (
    <PageHeaderClient>
      <PageHeaderTitleContent>
        {goBack && (
          <div className="mr-4">
            <ButtonBack url={urlBack} />
          </div>
        )}
        <PageHeaderTitle titleAs="h1" title={title} description={description} />
      </PageHeaderTitleContent>
      <PageHeaderActionsContainer>{children}</PageHeaderActionsContainer>
    </PageHeaderClient>
  );
}
