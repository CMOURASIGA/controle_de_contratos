"use client";

import { useSmartBack } from "@/hooks/use-smart-back";
import ArrowLeftIcon from "../../icons/arrow-left";
import { useRouter } from "next/navigation";

type ButtonBackProps = {
  url?: string;
};

export function ButtonBack({ url }: ButtonBackProps) {
  const router = useRouter();
  const { goBackSafe } = useSmartBack();

  const handleClick = () => {
    if (url) {
      router.push(url);
    } else {
      goBackSafe();
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className="flex flex-col items-center justify-center text-center relative px-2 py-2 text-[#00247d]
             bg-white rounded-lg border border-gray-200 
              hover:text-gray-900 shadow-xs 
               hover:bg-gray-200"
    >
      <ArrowLeftIcon />
    </button>
  );
}
