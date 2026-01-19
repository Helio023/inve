import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const FormInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    // Geramos IDs únicos para acessibilidade se não forem passados
    const inputId = id || props.name;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full px-4 py-2 border rounded-lg outline-none transition-all",
              "disabled:bg-slate-100 disabled:cursor-not-allowed",
              error
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              // Combina IDs de erro e helper para leitores de tela
              [error ? errorId : "", helperText ? helperId : ""]
                .filter(Boolean)
                .join(" ") || undefined
            }
            {...props}
          />
          {error && (
            <AlertCircle className="absolute right-3 top-2.5 h-5 w-5 text-red-500 pointer-events-none" />
          )}
        </div>

        {error && (
          <p
            id={errorId}
            className="text-sm text-red-600 flex items-center gap-1"
            role="alert"
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={helperId} className="text-xs text-slate-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
FormInput.displayName = "FormInput";
