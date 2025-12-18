import { HtmlHTMLAttributes } from "react";

type ContainerProps = HtmlHTMLAttributes<HTMLDivElement>;

export function Container({ className, ...rest }: ContainerProps) {
  return <div className={`mx-6 ${className}`} {...rest} />;
}
