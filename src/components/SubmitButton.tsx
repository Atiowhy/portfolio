"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import React from "react";

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loadingText?: string;
  defaultText: React.ReactNode;
}

export function SubmitButton({ loadingText = "Memproses...", defaultText, className, children, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      type="submit"
      disabled={pending || props.disabled}
      className={`${className} disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center transition-all`}
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          {loadingText}
        </>
      ) : (
        children || defaultText
      )}
    </button>
  );
}
