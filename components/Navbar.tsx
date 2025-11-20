import React from 'react';
import { Briefcase, Layout, PieChart, Settings, Cloud, Mail } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onScanGmail: () => void;
  isScanning: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onScanGmail, isScanning }) => {
  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl z-50">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Briefcase size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">CareerGuardian</h1>
            <p className="text-xs text-slate-400">Automated Tracker</p>
          </div>
        </div>
      </div>

      <div className="flex-1 py-6 px-4 space-y-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Layout size={20} />
          <span className="font-medium">Board</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <PieChart size={20} />
          <span className="font-medium">Analytics</span>
        </button>
        
        <div className="pt-4 pb-2">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Automation</p>
        </div>

        <button
          onClick={onScanGmail}
          disabled={isScanning}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all border border-slate-700 ${
            isScanning ? 'bg-slate-800 opacity-50 cursor-wait' : 'hover:bg-slate-800 hover:border-slate-600 text-emerald-400'
          }`}
        >
           <Mail size={20} className={isScanning ? "animate-pulse" : ""} />
           <span className="font-medium">{isScanning ? 'Scanning...' : 'Scan Gmail'}</span>
        </button>

      </div>

      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Cloud size={12} />
          <span>Running on Cloud Run</span>
        </div>
         <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span>Cloud SQL Connected</span>
        </div>
      </div>
    </div>
  );
};
