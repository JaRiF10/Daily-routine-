import React, { useState } from 'react';
import { Task, Project, Priority } from '../types';
import { TaskCard } from './TaskCard';
import { QuickAddInput } from './QuickAddInput';
import { Sparkles, CheckCircle2, Clock, Filter, ArrowRight } from 'lucide-react';

interface TodayViewProps {
  tasks: Task[];
  projects: Project[];
  onToggleComplete: (taskId: string) => void;
  onOpenDetails: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onStartFlow: (task: Task) => void;
  onAddTask: (taskData: {
    title: string;
    projectId: string;
    priority: Priority;
    isToday: boolean;
    timeSlot?: 'morning' | 'afternoon' | 'evening';
  }) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  tasks,
  projects,
  onToggleComplete,
  onOpenDetails,
  onDeleteTask,
  onStartFlow,
  onAddTask,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');

  const todayTasks = tasks.filter((t) => t.isToday);
  const completedCount = todayTasks.filter((t) => t.status === 'done').length;
  const totalCount = todayTasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filter tasks based on segmented controls
  const filteredTasks = todayTasks.filter((t) => {
    if (filterStatus === 'pending') return t.status !== 'done';
    if (filterStatus === 'completed') return t.status === 'done';
    return true;
  });

  const morningTasks = filteredTasks.filter((t) => t.timeSlot === 'morning' || (!t.timeSlot && t.priority === 'urgent'));
  const afternoonTasks = filteredTasks.filter(
    (t) => t.timeSlot === 'afternoon' || (!t.timeSlot && t.priority === 'high')
  );
  const eveningTasks = filteredTasks.filter(
    (t) => t.timeSlot === 'evening' || (!t.timeSlot && (t.priority === 'medium' || t.priority === 'low'))
  );

  const getProject = (id: string) => projects.find((p) => p.id === id);

  const totalEstimatedHours = (todayTasks.reduce((acc, t) => acc + (t.estimatedPoms || 1), 0) * 25) / 60;
  const totalFocusedHours = (todayTasks.reduce((acc, t) => acc + (t.completedPoms || 0), 0) * 25) / 60;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* View Header with Date & Calm Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-wider text-[#71717a]">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#18181b] mt-1">
            Today's Focus
          </h1>
          <p className="text-[14px] text-[#71717a] mt-1">
            Organized clarity for your morning, afternoon, and evening priorities.
          </p>
        </div>

        {/* Milestone Progress Metric Bar */}
        <div className="sm:text-right shrink-0">
          <div className="text-[13px] font-medium text-[#18181b] font-mono tabular-nums">
            {completedCount} of {totalCount} completed <span className="text-[#a1a1aa]">·</span> {progressPercent}%
          </div>
          <div className="w-48 h-2 bg-[#e4e4e7] rounded-full overflow-hidden mt-2 ml-auto">
            <div
              className="h-full bg-[#059669] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[11px] text-[#71717a] mt-1 font-mono tabular-nums">
            {totalFocusedHours.toFixed(1)}h logged <span className="text-[#a1a1aa]">/</span> ~{totalEstimatedHours.toFixed(1)}h planned
          </div>
        </div>
      </div>

      {/* Interactive Filter Segmented Control (§1.A allowed for interactive triggers) */}
      <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-3">
        <div className="flex items-center gap-1 p-0.5 bg-[#f4f4f5] rounded-lg border border-[#e4e4e7]">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 text-[12px] font-medium rounded transition-all whitespace-nowrap ${
              filterStatus === 'all'
                ? 'bg-white text-[#18181b] shadow-sm'
                : 'text-[#71717a] hover:text-[#18181b]'
            }`}
          >
            All Today ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1 text-[12px] font-medium rounded transition-all whitespace-nowrap ${
              filterStatus === 'pending'
                ? 'bg-white text-[#18181b] shadow-sm'
                : 'text-[#71717a] hover:text-[#18181b]'
            }`}
          >
            Remaining ({totalCount - completedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1 text-[12px] font-medium rounded transition-all whitespace-nowrap ${
              filterStatus === 'completed'
                ? 'bg-white text-[#18181b] shadow-sm'
                : 'text-[#71717a] hover:text-[#18181b]'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* First task flow trigger */}
        {todayTasks.find((t) => t.status !== 'done') && (
          <button
            type="button"
            onClick={() => {
              const next = todayTasks.find((t) => t.status !== 'done');
              if (next) onStartFlow(next);
            }}
            className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-medium text-[#4f46e5] hover:text-[#4338ca] transition-colors"
          >
            <span>Start Next Flow Task</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Time Segments */}
      <div className="space-y-8">
        {/* Morning Flow */}
        <section className="space-y-3">
          <div className="sticky top-14 z-10 bg-[#fafafa]/95 backdrop-blur-sm py-1 flex items-center justify-between border-b border-[#e4e4e7]/60">
            <h2 className="text-[11px] font-semibold tracking-wider uppercase text-[#71717a] flex items-center gap-2">
              <span>Morning Flow</span>
              <span className="font-mono text-[10px] lowercase text-[#a1a1aa]">(9:00 – 12:00)</span>
            </h2>
            <span className="font-mono text-[11px] tabular-nums text-[#a1a1aa]">
              {morningTasks.filter((t) => t.status === 'done').length}/{morningTasks.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {morningTasks.length > 0 ? (
              morningTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  project={getProject(task.projectId)}
                  onToggleComplete={onToggleComplete}
                  onOpenDetails={onOpenDetails}
                  onDeleteTask={onDeleteTask}
                  onStartFlow={onStartFlow}
                />
              ))
            ) : (
              <div className="py-3 px-4 border border-dashed border-[#e4e4e7] rounded-lg text-center text-[12px] text-[#a1a1aa]">
                No morning tasks scheduled yet
              </div>
            )}
            <QuickAddInput
              placeholder="Add morning task... (Press Enter)"
              defaultSlot="morning"
              defaultPriority="high"
              projects={projects}
              onAddTask={onAddTask}
            />
          </div>
        </section>

        {/* Afternoon Deep Work */}
        <section className="space-y-3">
          <div className="sticky top-14 z-10 bg-[#fafafa]/95 backdrop-blur-sm py-1 flex items-center justify-between border-b border-[#e4e4e7]/60">
            <h2 className="text-[11px] font-semibold tracking-wider uppercase text-[#71717a] flex items-center gap-2">
              <span>Afternoon Deep Work</span>
              <span className="font-mono text-[10px] lowercase text-[#a1a1aa]">(13:00 – 17:00)</span>
            </h2>
            <span className="font-mono text-[11px] tabular-nums text-[#a1a1aa]">
              {afternoonTasks.filter((t) => t.status === 'done').length}/{afternoonTasks.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {afternoonTasks.length > 0 ? (
              afternoonTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  project={getProject(task.projectId)}
                  onToggleComplete={onToggleComplete}
                  onOpenDetails={onOpenDetails}
                  onDeleteTask={onDeleteTask}
                  onStartFlow={onStartFlow}
                />
              ))
            ) : (
              <div className="py-3 px-4 border border-dashed border-[#e4e4e7] rounded-lg text-center text-[12px] text-[#a1a1aa]">
                No afternoon tasks scheduled yet
              </div>
            )}
            <QuickAddInput
              placeholder="Add afternoon task... (Press Enter)"
              defaultSlot="afternoon"
              defaultPriority="medium"
              projects={projects}
              onAddTask={onAddTask}
            />
          </div>
        </section>

        {/* Evening Wrap & Reflection */}
        <section className="space-y-3">
          <div className="sticky top-14 z-10 bg-[#fafafa]/95 backdrop-blur-sm py-1 flex items-center justify-between border-b border-[#e4e4e7]/60">
            <h2 className="text-[11px] font-semibold tracking-wider uppercase text-[#71717a] flex items-center gap-2">
              <span>Evening Wrap & Wellbeing</span>
              <span className="font-mono text-[10px] lowercase text-[#a1a1aa]">(18:00+)</span>
            </h2>
            <span className="font-mono text-[11px] tabular-nums text-[#a1a1aa]">
              {eveningTasks.filter((t) => t.status === 'done').length}/{eveningTasks.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {eveningTasks.length > 0 ? (
              eveningTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  project={getProject(task.projectId)}
                  onToggleComplete={onToggleComplete}
                  onOpenDetails={onOpenDetails}
                  onDeleteTask={onDeleteTask}
                  onStartFlow={onStartFlow}
                />
              ))
            ) : (
              <div className="py-3 px-4 border border-dashed border-[#e4e4e7] rounded-lg text-center text-[12px] text-[#a1a1aa]">
                No evening tasks scheduled yet
              </div>
            )}
            <QuickAddInput
              placeholder="Add evening wind-down task... (Press Enter)"
              defaultSlot="evening"
              defaultPriority="low"
              projects={projects}
              onAddTask={onAddTask}
            />
          </div>
        </section>
      </div>
    </div>
  );
};
