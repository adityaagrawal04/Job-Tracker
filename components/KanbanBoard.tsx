import React, { useMemo } from 'react';
import { JobApplication, JobStatus, STATUS_LABELS, STATUS_COLORS } from '../types';
import { MoreHorizontal, Sparkles, Calendar, Building2, ArrowRight, ArrowLeft } from 'lucide-react';

interface KanbanBoardProps {
  jobs: JobApplication[];
  onUpdateStatus: (id: string, newStatus: JobStatus) => void;
  onGetAdvice: (job: JobApplication) => void;
  onDelete: (id: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ jobs, onUpdateStatus, onGetAdvice, onDelete }) => {
  const columns = Object.values(JobStatus);

  const getJobsByStatus = (status: JobStatus) => {
    return jobs.filter((job) => job.status === status);
  };

  return (
    <div className="flex overflow-x-auto pb-8 h-full gap-6">
      {columns.map((status) => (
        <div key={status} className="min-w-[320px] w-[320px] flex flex-col">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              {STATUS_LABELS[status]}
              <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold">
                {getJobsByStatus(status).length}
              </span>
            </h3>
          </div>

          <div className="bg-slate-100/50 rounded-xl p-3 h-full overflow-y-auto border border-slate-200/60">
            <div className="space-y-3">
              {getJobsByStatus(status).map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onUpdateStatus={onUpdateStatus}
                  onGetAdvice={onGetAdvice}
                  onDelete={onDelete}
                />
              ))}
              {getJobsByStatus(status).length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-lg">
                  <p className="text-slate-400 text-sm">No jobs here yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface JobCardProps {
  job: JobApplication;
  onUpdateStatus: (id: string, newStatus: JobStatus) => void;
  onGetAdvice: (job: JobApplication) => void;
  onDelete: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onUpdateStatus, onGetAdvice, onDelete }) => {
  const nextStatus = useMemo(() => {
    const statuses = Object.values(JobStatus);
    const idx = statuses.indexOf(job.status);
    return idx < statuses.length - 1 ? statuses[idx + 1] : null;
  }, [job.status]);

  const prevStatus = useMemo(() => {
    const statuses = Object.values(JobStatus);
    const idx = statuses.indexOf(job.status);
    return idx > 0 ? statuses[idx - 1] : null;
  }, [job.status]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow group relative">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-slate-800 leading-tight">{job.title}</h4>
          <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
            <Building2 size={14} />
            <span>{job.company}</span>
          </div>
        </div>
        <button 
          onClick={() => onDelete(job.id)}
          className="text-slate-300 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
        >
          &times;
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${STATUS_COLORS[job.status]}`}>
          {STATUS_LABELS[job.status]}
        </span>
        {job.source === 'GMAIL_AUTO' && (
             <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                Gmail
             </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>{new Date(job.dateApplied).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
        <button 
            onClick={() => onGetAdvice(job)}
            className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 px-2 py-1 rounded-md"
        >
            <Sparkles size={12} />
            Gemini Tips
        </button>
        
        <div className="flex gap-1">
             {prevStatus && (
                <button 
                    onClick={() => onUpdateStatus(job.id, prevStatus)}
                    title="Move back"
                    className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-md transition-colors"
                >
                    <ArrowLeft size={14} />
                </button>
            )}
            {nextStatus && (
                <button 
                    onClick={() => onUpdateStatus(job.id, nextStatus)}
                    title="Move forward"
                    className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-md transition-colors"
                >
                    <ArrowRight size={14} />
                </button>
            )}
        </div>
      </div>
    </div>
  );
};
