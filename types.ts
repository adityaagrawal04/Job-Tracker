export enum JobStatus {
  APPLIED = 'APPLIED',
  SCREENING = 'SCREENING',
  INTERVIEW = 'INTERVIEW',
  OFFER = 'OFFER',
  REJECTED = 'REJECTED'
}

export interface JobApplication {
  id: string;
  company: string;
  title: string;
  status: JobStatus;
  dateApplied: string;
  description?: string;
  salaryRange?: string;
  notes?: string;
  aiInsights?: string;
  source: 'GMAIL_AUTO' | 'MANUAL' | 'LINKEDIN_IMPORT';
}

export interface EmailSimulation {
  id: string;
  subject: string;
  sender: string;
  body: string;
  date: string;
}

export const STATUS_COLORS: Record<JobStatus, string> = {
  [JobStatus.APPLIED]: 'bg-blue-100 text-blue-800 border-blue-200',
  [JobStatus.SCREENING]: 'bg-purple-100 text-purple-800 border-purple-200',
  [JobStatus.INTERVIEW]: 'bg-amber-100 text-amber-800 border-amber-200',
  [JobStatus.OFFER]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  [JobStatus.REJECTED]: 'bg-slate-100 text-slate-600 border-slate-200',
};

export const STATUS_LABELS: Record<JobStatus, string> = {
  [JobStatus.APPLIED]: 'Applied',
  [JobStatus.SCREENING]: 'Online Assessment',
  [JobStatus.INTERVIEW]: 'Interviewing',
  [JobStatus.OFFER]: 'Offer Received',
  [JobStatus.REJECTED]: 'Rejected',
};
