'use client';
import { X } from 'lucide-react';

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md', // sm | md | lg
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}) {
  if (!open) return null;
  const maxW = size === 'lg' ? 'max-w-4xl' : size === 'sm' ? 'max-w-md' : 'max-w-2xl';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className={`relative w-[94%] ${maxW} rounded-2xl bg-neutral-950 border border-white/10 shadow-xl`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="text-sm font-medium">{title}</div>
          <button onClick={onClose} className="p-2 rounded hover:bg-neutral-800">
            <X size={18} />
          </button>
        </div>
        <div className="p-4">{children}</div>
        {footer ? <div className="px-4 py-3 border-t border-white/10">{footer}</div> : null}
      </div>
    </div>
  );
}
