import React from 'react';
import { useRouter } from 'next/router';
import { CheckCircle, XCircle, ArrowRight, Home } from 'lucide-react';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
}

const StatusModal: React.FC<StatusModalProps> = ({ isOpen, onClose, type, title, message }) => {
  const router = useRouter();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center transform animate-in zoom-in-95 duration-300">
        <div className="flex justify-center mb-6">
          {type === 'success' ? (
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle size={48} className="text-green-600" />
            </div>
          ) : (
            <div className="bg-red-100 p-4 rounded-full">
              <XCircle size={48} className="text-red-600" />
            </div>
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            <Home size={18} /> Go to Dashboard
          </button>
          
          <button
            onClick={onClose}
            className="w-full text-gray-500 text-sm font-bold hover:text-gray-800 transition-colors py-2"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;