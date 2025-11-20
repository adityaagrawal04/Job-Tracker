import React from 'react';
import { Sparkles, X } from 'lucide-react';

interface AdviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  isLoading: boolean;
  jobTitle: string;
  company: string;
}

export const AdviceModal: React.FC<AdviceModalProps> = ({ isOpen, onClose, content, isLoading, jobTitle, company }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
              <Sparkles size={20} className="text-yellow-300" />
            </div>
            <h2 className="text-lg font-bold">Gemini Insights</h2>
          </div>
          <p className="text-indigo-100 text-sm">
            For {jobTitle} at {company}
          </p>
        </div>
        
        <div className="p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
               <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
               <p className="text-slate-500 text-sm animate-pulse">Analyzing job details...</p>
            </div>
          ) : (
            <div className="prose prose-slate prose-sm max-w-none">
                <div className="whitespace-pre-line text-slate-700 leading-relaxed">
                    {content}
                </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
            <button 
                onClick={onClose}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-slate-800 transition-colors"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};
