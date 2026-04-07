import React, { useEffect, useId } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '../utils';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
  isInline?: boolean;
  isPopover?: boolean;
  position?: 'top' | 'bottom';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
  isInline = false,
  isPopover = false,
  position = 'top'
}) => {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const containerClasses = isInline 
    ? "absolute inset-0 z-50 p-5 flex items-center justify-center animate-in fade-in duration-300"
    : isPopover
    ? cn(
        "absolute right-0 z-[100] w-80 animate-in slide-in-from-bottom-2 duration-300",
        position === 'top' ? "bottom-full mb-4" : "top-full mt-4"
      )
    : "fixed inset-0 z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300";

  const panelClasses = isInline
    ? "glass-panel w-full h-full p-6 relative animate-in zoom-in-95 duration-300 border-white/10 flex flex-col items-center justify-center overflow-hidden"
    : isPopover
    ? "glass-panel w-full p-8 relative animate-in zoom-in-95 duration-300 border-red-500/30 bg-black/95 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
    : "glass-panel w-full max-w-md p-10 relative animate-in zoom-in-95 duration-300 border-white/10";

  return (
    <div
      className={containerClasses}
      role={isInline || isPopover ? undefined : "alertdialog"}
      aria-modal={isInline || isPopover ? undefined : "true"}
      aria-labelledby={isInline || isPopover ? undefined : titleId}
      aria-describedby={isInline || isPopover ? undefined : descriptionId}
    >
      {!isInline && !isPopover && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onCancel} />
      )}
      
      {isPopover && (
        <div className="fixed inset-0 z-[-1]" onClick={onCancel} />
      )}
      
      {isPopover && (
        <div className={cn(
          "absolute right-10 w-4 h-4 bg-black border-red-500/30 rotate-45 z-[-1]",
          position === 'top' ? "-bottom-2 border-r border-b" : "-top-2 border-l border-t"
        )} />
      )}

      <div className={panelClasses}>
        {!isInline && !isPopover && (
          <button 
            onClick={onCancel}
            className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex flex-col items-center text-center w-full">
          <div className={cn(
            isInline || isPopover ? "w-10 h-10 mb-4" : "w-16 h-16 mb-6",
            "rounded-full flex items-center justify-center border",
            variant === 'danger' ? "bg-red-500/20 border-red-500/30 text-red-400" :
            variant === 'warning' ? "bg-amber-500/20 border-amber-500/30 text-amber-400" :
            "bg-sky-500/20 border-sky-500/30 text-sky-400"
          )}>
            <AlertTriangle className={isInline || isPopover ? "w-5 h-5" : "w-8 h-8"} />
          </div>

          <h3
            id={titleId}
            className={cn(
              isInline || isPopover ? "text-lg mb-2" : "text-2xl mb-3",
              "font-black text-white uppercase tracking-tighter"
            )}
          >
            {title}
          </h3>
          <p
            id={descriptionId}
            className={cn(
              isInline || isPopover ? "text-[10px] mb-6" : "text-sm mb-10",
              "text-zinc-400 leading-relaxed"
            )}
          >
            {message}
          </p>

          <div className={cn("flex gap-3 w-full", isInline || isPopover ? "flex-col" : "flex-row")}>
            <button 
              onClick={onCancel}
              autoFocus
              className={cn(
                "glass-card font-bold text-zinc-400 hover:text-white transition-all uppercase tracking-widest text-[10px]",
                isInline || isPopover ? "py-2.5 order-2" : "flex-1 py-4"
              )}
            >
              {cancelLabel}
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onCancel();
              }}
              className={cn(
                "rounded-sm font-black uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02] active:scale-[0.98]",
                isInline || isPopover ? "py-3 order-1" : "flex-1 py-4",
                variant === 'danger' ? "bg-red-500 text-white hover:bg-red-600 shadow-[0_10px_20px_rgba(239,68,68,0.2)]" :
                variant === 'warning' ? "bg-amber-500 text-black hover:bg-amber-600" :
                "bg-white text-black hover:bg-zinc-200"
              )}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
