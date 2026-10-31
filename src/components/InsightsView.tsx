import React from 'react';
import { Task, Project } from '../types';
import { CheckCircle2, Flame, Clock, BarChart, Layers } from 'lucide-react';

interface InsightsViewProps {
  tasks: Task[];
  projects: Project[];
}

export const InsightsView: React.FC<InsightsViewProps> = ({ tasks, projects }) => {
  const completedTasks = tasks.filter((t) => t.status === 'done');
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  const totalCompletedPoms = tasks.reduce((sum, t) => sum + (t.completedPoms || 0), 0);
  const totalFocusHours = (totalCompletedPoms * 25) / 60;

  // Project distribution
  const projectStats = projects.map((p) => {
    const pTasks = tasks.filter((t) => t.projectId === p.id);
    const pDone = pTasks.filter((t) => t.status === 'done');
    return {
      project: p,
      total: pTasks.length,
      done: pDone.length,
      percent: pTasks.length > 0 ? Math.round((pDone.length / pTasks.length) * 100) : 0,
    };
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#18181b]">
          Calm Velocity Insights
        </h1>
        <p className="text-[13px] text-[#71717a] mt-0.5">
          Grounded, measurable feedback on consistency, focus stamina, and project throughput.
        </p>
      </div>

      {/* Primary KPI Grid (Level 1 resting elevation) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-[#e4e4e7] rounded-lg shadow-lvl-1">
          <div className="flex items-center gap-2 text-[12px] font-medium text-[#71717a]">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            <span>Completion Rate</span>
          </div>
          <div className="text-2xl font-mono font-semibold tracking-tight text-[#18181b] mt-2 tabular-nums">
            {completionRate}%
          </div>
          <div className="text-[11px] text-[#71717a] mt-1 font-mono tabular-nums">
            {completedTasks.length} of {totalTasks} finished
          </div>
        </div>

        <div className="p-4 bg-white border border-[#e4e4e7] rounded-lg shadow-lvl-1">
          <div className="flex items-center gap-2 text-[12px] font-medium text-[#71717a]">
            <Clock className="w-4 h-4 text-[#4f46e5]" />
            <span>Focus Logged</span>
          </div>
          <div className="text-2xl font-mono font-semibold tracking-tight text-[#18181b] mt-2 tabular-nums">
            {totalFocusHours.toFixed(1)}h
          </div>
          <div className="text-[11px] text-[#71717a] mt-1 font-mono tabular-nums">
            {totalCompletedPoms} flow sessions
          </div>
        </div>

        <div className="p-4 bg-white border border-[#e4e4e7] rounded-lg shadow-lvl-1">
          <div className="flex items-center gap-2 text-[12px] font-medium text-[#71717a]">
            <Flame className="w-4 h-4 text-[#f59e0b]" />
            <span>Calm Streak</span>
          </div>
          <div className="text-2xl font-mono font-semibold tracking-tight text-[#18181b] mt-2 tabular-nums">
            5 Days
          </div>
          <div className="text-[11px] text-[#71717a] mt-1">
            Consistent flow ritual
          </div>
        </div>

        <div className="p-4 bg-white border border-[#e4e4e7] rounded-lg shadow-lvl-1">
          <div className="flex items-center gap-2 text-[12px] font-medium text-[#71717a]">
            <Layers className="w-4 h-4 text-[#3b82f6]" />
            <span>Active Streams</span>
          </div>
          <div className="text-2xl font-mono font-semibold tracking-tight text-[#18181b] mt-2 tabular-nums">
            {projects.length}
          </div>
          <div className="text-[11px] text-[#71717a] mt-1">
            Balanced project split
          </div>
        </div>
      </div>

      {/* Project Breakdown */}
      <div className="bg-white border border-[#e4e4e7] rounded-lg p-5 shadow-lvl-1 space-y-4">
        <h2 className="text-[12px] font-semibold uppercase tracking-wider text-[#71717a]">
          Project Momentum Breakdown
        </h2>

        <div className="space-y-3.5">
          {projectStats.map(({ project, total, done, percent }) => (
            <div key={project.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2 font-medium text-[#18181b]">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <span>{project.name}</span>
                </div>
                <div className="font-mono text-[12px] tabular-nums text-[#71717a]">
                  {done}/{total} done <span className="text-[#c7c4d8]">·</span> {percent}%
                </div>
              </div>

              <div className="w-full h-2 bg-[#f4f4f5] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: project.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Milestones Log */}
      <div className="bg-white border border-[#e4e4e7] rounded-lg p-5 shadow-lvl-1 space-y-3">
        <h2 className="text-[12px] font-semibold uppercase tracking-wider text-[#71717a]">
          Recent Completed Milestones
        </h2>

        <div className="divide-y divide-[#e4e4e7]">
          {completedTasks.length > 0 ? (
            completedTasks.map((t) => (
              <div key={t.id} className="py-2.5 flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#059669]" />
                  <span className="font-medium text-[#18181b]">{t.title}</span>
                </div>
                <div className="text-[12px] font-mono tabular-nums text-[#71717a]">
                  {t.completedPoms} pomodoro blocks
                </div>
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-[12px] text-[#a1a1aa]">
              No tasks completed yet today
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
