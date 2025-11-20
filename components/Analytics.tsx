import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { JobApplication, JobStatus, STATUS_LABELS, STATUS_COLORS } from '../types';

interface AnalyticsProps {
  jobs: JobApplication[];
}

const COLORS = ['#60a5fa', '#c084fc', '#fbbf24', '#34d399', '#94a3b8'];

export const Analytics: React.FC<AnalyticsProps> = ({ jobs }) => {
  
  const statusData = Object.values(JobStatus).map((status, index) => ({
    name: STATUS_LABELS[status],
    count: jobs.filter(j => j.status === status).length,
    color: COLORS[index % COLORS.length]
  }));

  const sourceData = [
    { name: 'Gmail Auto-Import', value: jobs.filter(j => j.source === 'GMAIL_AUTO').length },
    { name: 'Manual Entry', value: jobs.filter(j => j.source === 'MANUAL').length },
  ];

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-sm font-medium mb-1">Total Applications</h3>
          <p className="text-4xl font-bold text-slate-800">{jobs.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-sm font-medium mb-1">Interviews</h3>
          <p className="text-4xl font-bold text-amber-600">
            {jobs.filter(j => j.status === JobStatus.INTERVIEW).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-sm font-medium mb-1">Offers</h3>
          <p className="text-4xl font-bold text-emerald-600">
            {jobs.filter(j => j.status === JobStatus.OFFER).length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Pipeline Status</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} interval={0} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip 
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        cursor={{fill: '#f8fafc'}}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Source Distribution</h3>
            <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={sourceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                        {sourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#f97316' : '#94a3b8'} />
                        ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
            </div>
             <div className="flex justify-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                    Gmail Auto
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                    Manual
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};
