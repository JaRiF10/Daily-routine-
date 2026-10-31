import React, { useState } from 'react';
import { Task, Project, Priority } from '../types';
import { TaskCard } from './TaskCard';
import { QuickAddInput } from './QuickAddInput';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

interface ScheduleViewProps {
  tasks: Task[];
  projects: Project[];
  onToggleComplete: (taskId: string) => void;
  onOpenDetails: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onStartFlow: (task: Task) => void;
  onUpdateTaskDate: (taskId: string, newDate: string) => void;
  onAddTask: (taskData: {
    title: string;
    projectId: string;
    priority: Priority;
    dueDate: string;
    isToday: boolean;
  }) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  tasks,
  projects,
  onToggleComplete,
  onOpenDetails,
  onDeleteTask,
  onStartFlow,
  onUpdateTaskDate,
  onAddTask,
}) => {
  const [weekOffset, setWeekOffset] = useState<number>(0);

  // Generate 7 days for the selected week
  const getDaysOfWeek = (offset: number) => {
    const today = new Date();
    // Monday of current week
    const currentDay = today.getDay(); // 0 is Sunday
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + distanceToMonday + offset * 7);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const isCurrentDay = iso === today.toISOString().split('T')[0];
      days.push({
        date: iso,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        formatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        isToday: isCurrentDay,
      });
    }
    return days;
  };

  const days = getDaysOfWeek(weekOffset);
  const getProject = (id: string) => projects.find((p) => p.id === id);

  // Calculate day capacity
  const MAX_HOURS_PER_DAY = 6.0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header & Week Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#18181b]">
            Weekly Capacity & Schedule
          </h1>
          <p className="text-[13px] text-[#71717a] mt-0.5">
            Balanced time-blocking across 7 days to maintain calm momentum without overload.
          </p>
        </div>

        {/* Week navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setWeekOffset((o) => o - 1)}
            className="p-1.5 rounded border border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] text-[#71717a] hover:text-[#18181b] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setWeekOffset(0)}
            className="px-3 py-1.5 text-[12px] font-medium rounded border border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] text-[#18181b] transition-colors"
          >
            {weekOffset === 0 ? 'This Week' : 'Reset to Today'}
          </button>
          <button
            type="button"
            onClick={() => setWeekOffset((o) => o + 1)}
            className="p-1.5 rounded border border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] text-[#71717a] hover:text-[#18181b] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {days.map((day) => {
          const dayTasks = tasks.filter((t) => t.dueDate === day.date);
          const totalEstimatedHours =
            (dayTasks.reduce((acc, t) => acc + (t.estimatedPoms || 1), 0) * 25) / 60;
          const capacityPercent = Math.min(
            100,
            Math.round((totalEstimatedHours / MAX_HOURS_PER_DAY) * 100)
          );
          const isOverloaded = totalEstimatedHours > MAX_HOURS_PER_DAY;

          return (
            <div
              key={day.date}
              className={`flex flex-col bg-white border rounded-lg p-3 min-h-[480px] shadow-sm transition-all ${
                day.isToday ? 'border-[#4f46e5] ring-1 ring-[#4f46e5]/20' : 'border-[#e4e4e7]'
              }`}
            >
              {/* Day Header */}
              <div className="pb-2.5 mb-2 border-b border-[#e4e4e7]">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[12px] font-semibold uppercase tracking-wider ${
                      day.isToday ? 'text-[#4f46e5]' : 'text-[#18181b]'
                    }`}
                  >
                    {day.dayName}
                  </span>
                  <span className="text-[12px] font-mono tabular-nums text-[#71717a]">
                    {day.formatted}
                  </span>
                </div>

                {/* Capacity Meter */}
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono tabular-nums">
                    <span className={isOverloaded ? 'text-[#e11d48] font-semibold' : 'text-[#71717a]'}>
                      {totalEstimatedHours.toFixed(1)}h / {MAX_HOURS_PER_DAY}h
                    </span>
                    <span className="text-[#a1a1aa]">{capacityPercent}%</span>
                  </div>
                  <div className="w-full h-1 bg-[#f4f4f5] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOverloaded ? 'bg-[#e11d48]' : 'bg-[#059669]'
                      }`}
                      style={{ width: `${capacityPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Tasks in this day */}
              <div className="flex-1 overflow-y-auto space-y-2.5">
                {dayTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    project={getProject(task.projectId)}
                    onToggleComplete={onToggleComplete}
                    onOpenDetails={onOpenDetails}
                    onDeleteTask={onDeleteTask}
                    onStartFlow={onStartFlow}
                  />
                ))}

                {dayTasks.length === 0 && (
                  <div className="py-8 text-center text-[11px] text-[#a1a1aa] border border-dashed border-[#e4e4e7] rounded">
                    Open bandwidth
                  </div>
                )}
              </div>

              {/* Quick Add for day */}
              <div className="pt-2 mt-auto">
                <QuickAddInput
                  placeholder="+ Add for day..."
                  projects={projects}
                  onAddTask={(tData) =>
                    onAddTask({
                      ...tData,
                      dueDate: day.date,
                      isToday: day.isToday,
                    })
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
