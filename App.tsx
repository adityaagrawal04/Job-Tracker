import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { KanbanBoard } from './components/KanbanBoard';
import { Analytics } from './components/Analytics';
import { AdviceModal } from './components/AdviceModal';
import { GmailScanModal } from './components/GmailScanModal';
import { JobApplication, JobStatus, EmailSimulation } from './types';
import { parseJobFromEmail, getCareerAdvice } from './services/geminiService';
import { Plus } from 'lucide-react';

// Initial Mock Data
const INITIAL_JOBS: JobApplication[] = [
  {
    id: '1',
    company: 'Google',
    title: 'Senior React Engineer',
    status: JobStatus.SCREENING,
    dateApplied: new Date().toISOString(),
    source: 'MANUAL'
  },
  {
    id: '2',
    company: 'Netflix',
    title: 'Frontend Developer',
    status: JobStatus.APPLIED,
    dateApplied: new Date(Date.now() - 86400000 * 2).toISOString(),
    source: 'MANUAL'
  },
  {
    id: '3',
    company: 'Spotify',
    title: 'Web Engineer II',
    status: JobStatus.INTERVIEW,
    dateApplied: new Date(Date.now() - 86400000 * 5).toISOString(),
    source: 'MANUAL'
  }
];

function App() {
  const [jobs, setJobs] = useState<JobApplication[]>(INITIAL_JOBS);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Advice Modal State
  const [isAdviceModalOpen, setIsAdviceModalOpen] = useState(false);
  const [adviceContent, setAdviceContent] = useState('');
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [selectedJobForAdvice, setSelectedJobForAdvice] = useState<{title: string, company: string} | null>(null);

  // Gmail Scan State
  const [isGmailScanOpen, setIsGmailScanOpen] = useState(false);
  const [isProcessingEmails, setIsProcessingEmails] = useState(false);

  // --- Job Actions ---

  const handleUpdateStatus = useCallback((id: string, newStatus: JobStatus) => {
    setJobs(prev => prev.map(job => job.id === id ? { ...job, status: newStatus } : job));
  }, []);

  const handleDeleteJob = useCallback((id: string) => {
    setJobs(prev => prev.filter(job => job.id !== id));
  }, []);

  const handleManualAdd = () => {
    // Simple manual add for demo purposes
    const newJob: JobApplication = {
        id: Date.now().toString(),
        company: 'New Company',
        title: 'New Position',
        status: JobStatus.APPLIED,
        dateApplied: new Date().toISOString(),
        source: 'MANUAL'
    };
    setJobs(prev => [newJob, ...prev]);
  };

  // --- AI Features ---

  const handleGetAdvice = useCallback(async (job: JobApplication) => {
    setSelectedJobForAdvice({ title: job.title, company: job.company });
    setIsAdviceModalOpen(true);
    setAdviceLoading(true);
    setAdviceContent('');

    const advice = await getCareerAdvice(job);
    setAdviceContent(advice);
    setAdviceLoading(false);
  }, []);

  const handleImportEmails = async (emails: EmailSimulation[]) => {
      setIsProcessingEmails(true);
      
      // Process emails sequentially to avoid rate limits and show progression if we had a UI for it
      const newJobs: JobApplication[] = [];
      
      for (const email of emails) {
          const parsedData = await parseJobFromEmail(email.body);
          
          if (parsedData.company && parsedData.title) {
              newJobs.push({
                  id: `gmail-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  company: parsedData.company,
                  title: parsedData.title,
                  status: parsedData.status || JobStatus.APPLIED,
                  dateApplied: email.date,
                  description: parsedData.summary,
                  source: 'GMAIL_AUTO'
              });
          }
      }

      setJobs(prev => [...newJobs, ...prev]);
      setIsProcessingEmails(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onScanGmail={() => setIsGmailScanOpen(true)}
        isScanning={isProcessingEmails}
      />

      <main className="flex-1 ml-64 h-screen overflow-hidden flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
            <h2 className="text-xl font-bold text-slate-800">
                {activeTab === 'dashboard' ? 'Application Board' : 'Insights & Analytics'}
            </h2>
            <div className="flex items-center gap-4">
                <div className="text-xs text-slate-400 hidden md:block">
                   API Key: <span className={process.env.API_KEY ? "text-green-500" : "text-red-500"}>
                       {process.env.API_KEY ? 'Active' : 'Missing'}
                   </span>
                </div>
                {activeTab === 'dashboard' && (
                    <button 
                        onClick={handleManualAdd}
                        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                    >
                        <Plus size={16} />
                        New Application
                    </button>
                )}
            </div>
        </header>

        <div className="flex-1 overflow-hidden p-6">
          {activeTab === 'dashboard' ? (
            <KanbanBoard 
                jobs={jobs} 
                onUpdateStatus={handleUpdateStatus}
                onGetAdvice={handleGetAdvice}
                onDelete={handleDeleteJob}
            />
          ) : (
            <div className="h-full overflow-y-auto">
                <Analytics jobs={jobs} />
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AdviceModal 
        isOpen={isAdviceModalOpen} 
        onClose={() => setIsAdviceModalOpen(false)}
        content={adviceContent}
        isLoading={adviceLoading}
        jobTitle={selectedJobForAdvice?.title || ''}
        company={selectedJobForAdvice?.company || ''}
      />

      <GmailScanModal 
        isOpen={isGmailScanOpen}
        onClose={() => setIsGmailScanOpen(false)}
        onImport={handleImportEmails}
      />

    </div>
  );
}

export default App;
