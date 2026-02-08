import { createContext, useContext, useState, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextProps {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: ToastType, message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000); // auto-dismiss after 5s
  };

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'error': return <AlertCircle className="w-5 h-5" />;
      case 'info': return <Info className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getToastColor = (type: ToastType) => {
    switch (type) {
      case 'success': return 'bg-green-500 border-green-600';
      case 'error': return 'bg-red-500 border-red-600';
      case 'info': return 'bg-blue-500 border-blue-600';
      default: return 'bg-blue-500 border-blue-600';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-5 right-5 flex flex-col gap-3 z-[9999]">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-[320px] max-w-md px-4 py-3 rounded-lg shadow-xl border-l-4 ${getToastColor(toast.type)} text-white animate-in slide-in-from-right-5 duration-300`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getToastIcon(toast.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold leading-tight">
                    {toast.message}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="text-white/80 hover:text-white transition-colors p-1 -m-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 h-1 w-full bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/50 rounded-full animate-toast-progress"
                style={{ animationDuration: '5s' }}
              />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};