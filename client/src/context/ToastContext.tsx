import React, { createContext, useContext, useState, useCallback } from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error';
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (t: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              'pointer-events-auto bg-[#fafbf5] border rounded-none px-5 py-4 max-w-sm',
              t.variant === 'error' ? 'border-red-400 text-red-900' : t.variant === 'success' ? 'border-forest-700 text-forest-900' : 'border-sage-400 text-earth-900',
            ].join(' ')}
            style={{ animation: 'slideUp 0.3s ease-out' }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-sm text-forest-900">{t.title}</p>
                {t.description && <p className="text-xs text-sage-500 mt-0.5">{t.description}</p>}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="text-sage-400 hover:text-sage-600 text-lg leading-none mt-0.5"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
