import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, Loader2, X, AlertCircle } from 'lucide-react';
import { EmailSimulation } from '../types';

interface GmailScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (emails: EmailSimulation[]) => void;
}

// Simulated Emails
const MOCK_EMAILS: EmailSimulation[] = [
    {
        id: 'e1',
        subject: 'Application Received - Frontend Engineer',
        sender: 'careers@techcorp.com',
        body: "Dear Candidate, Thank you for applying to the Frontend Engineer position at TechCorp. We have received your application and our team is currently reviewing it.",
        date: new Date().toISOString()
    },
    {
        id: 'e2',
        subject: 'Next Steps: Product Designer Interview',
        sender: 'recruiting@designstudio.io',
        body: "Hi there, We were impressed by your portfolio! We'd like to invite you to a screening call for the Product Designer role at DesignStudio.",
        date: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: 'e3',
        subject: 'Update on your application',
        sender: 'no-reply@oldbank.com',
        body: "Thank you for your interest in OldBank. Unfortunately, we have decided to move forward with other candidates for the Data Analyst role.",
        date: new Date(Date.now() - 172800000).toISOString()
    }
];

export const GmailScanModal: React.FC<GmailScanModalProps> = ({ isOpen, onClose, onImport }) => {
  const [step, setStep] = useState<'idle' | 'scanning' | 'found' | 'processing' | 'done'>('idle');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
        setStep('scanning');
        setProgress(0);
        
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setStep('found');
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
        
        return () => clearInterval(interval);
    } else {
        setStep('idle');
    }
  }, [isOpen]);

  const handleImport = () => {
      setStep('processing');
      // Simulate processing delay
      setTimeout(() => {
          onImport(MOCK_EMAILS);
          setStep('done');
          setTimeout(onClose, 1500);
      }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Mail className="text-red-500" />
                    Gmail Scanner
                </h2>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                </button>
            </div>

            {step === 'scanning' && (
                <div className="text-center py-8">
                    <div className="mb-4 relative w-20 h-20 mx-auto">
                         <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                         <div className="absolute inset-0 border-4 border-red-500 rounded-full border-t-transparent animate-spin"></div>
                         <Mail className="absolute inset-0 m-auto text-slate-400" size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-700 mb-1">Scanning Inbox...</h3>
                    <p className="text-slate-500 text-sm">Looking for keywords: "Application", "Interview", "Offer"</p>
                    <div className="mt-6 w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            )}

            {step === 'found' && (
                <div className="py-4">
                    <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <div className="bg-white p-2 rounded-full shadow-sm">
                             <AlertCircle className="text-red-500" size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-red-900">3 Potential Job Updates Found</h4>
                            <p className="text-red-700 text-sm mt-1">
                                We found 3 emails that match job application patterns.
                            </p>
                        </div>
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                        {MOCK_EMAILS.map(email => (
                            <li key={email.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <Mail size={16} className="text-slate-400 mt-1" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-700 truncate">{email.subject}</p>
                                    <p className="text-xs text-slate-500">{email.sender}</p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <button 
                        onClick={handleImport}
                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-red-500/30 flex justify-center items-center gap-2"
                    >
                        Process with Gemini
                    </button>
                </div>
            )}

            {step === 'processing' && (
                 <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-700">Analyzing Content</h3>
                    <p className="text-slate-500 text-sm mt-2">Gemini is extracting job details from email bodies...</p>
                 </div>
            )}

            {step === 'done' && (
                 <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-700">Import Complete!</h3>
                    <p className="text-slate-500 text-sm mt-2">Your board has been updated.</p>
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};
