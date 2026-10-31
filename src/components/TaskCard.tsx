import React from 'react';
import { Task, Project, Priority } from '../types';
import { GripVertical, Clock, CheckSquare, Calendar, Trash2, Edit3, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TaskCardProps {
  task: Task;
  project?: Project;
  onToggleComplete: (taskId: string) => void;
  onOpenDetails: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onStartFlow?: (task: Task) => void;
  isKanban?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  project,
  onToggleComplete,
  onOpenDetails,
  onDeleteTask,
  onStartFlow,
  isKanban = false,
}) => {
  const isDone = task.status === 'done';

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDone) {
      // Fire subtle celebratory micro-confetti
      try {
        confetti({
          particleCount: 28,
          spread: 45,
          origin: { y: 0.75, x: 0.5 },
          colors: ['#059669', '#34d399', '#4f46e5'],
          ticks: 120,
          disableForReducedMotion: true,
        });
      } catch {
        // graceful ignore
      }
    }
    onToggleComplete(task.id);
  };

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

  const renderPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="inline-flex items-center h-[22px] px-2 text-[11px] font-semibold rounded bg-[#fff1f2] text-[#e11d48] tracking-wider uppercase">
            Urgent
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center h-[22px] px-2 text-[11px] font-semibold rounded bg-[#fff1f2] text-[#e11d48] tracking-wider uppercase">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center h-[22px] px-2 text-[11px] font-semibold rounded bg-[#f4f4f5] text-[#52525b] tracking-wider uppercase">
            Medium
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center h-[22px] px-2 text-[11px] font-semibold rounded bg-[#f4f4f5] text-[#71717a] tracking-wider uppercase">
            Low
          </span>
        );
    }
  };

  return (
    <div
      onClick={() => onOpenDetails(task)}
      className={`group relative bg-white border border-[#e4e4e7] rounded-lg transition-all duration-150 cursor-pointer shadow-lvl-1 hover:shadow-lvl-2 hover:border-[#d4d4d8] ${
        isKanban ? 'p-4' : 'py-3 px-4'
      } ${isDone ? 'opacity-75 bg-[#fafafa]' : ''}`}
    >
      <div className="flex items-start gap-2">
        {/* Six-dot drag handle icon visible on row hover */}
        <div
          className="mt-0.5 text-[#a1a1aa] opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing shrink-0"
          title="Drag to reorder"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Custom 18x18px Checkbox with 4px border-radius */}
        <button
          type="button"
          onClick={handleCheckboxClick}
          aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
          className={`shrink-0 w-[18px] h-[18px] rounded mt-0.5 flex items-center justify-center transition-all duration-150 ${
            isDone
              ? 'bg-[#059669] border-[#059669] text-white scale-100'
              : 'border-[1.5px] border-[#d4d4d8] bg-white hover:border-[#4f46e5] text-transparent'
          }`}
        >
          <svg
            className={`w-3 h-3 transition-transform duration-150 ${isDone ? 'scale-100' : 'scale-0'}`}
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.5 6.2L4.8 8.5L9.5 3.5" />
          </svg>
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={`text-[14px] font-medium leading-[1.375rem] transition-colors break-words ${
                isDone ? 'line-through text-[#a1a1aa]' : 'text-[#18181b] group-hover:text-[#3525cd]'
              }`}
            >
              {task.title}
            </h4>

            {/* Quick action buttons on hover */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              {onStartFlow && !isDone && (
                <button
                  type="button"
                  title="Focus on this task in Flow Session"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartFlow(task);
                  }}
                  className="p-1 rounded text-[#71717a] hover:text-[#4f46e5] hover:bg-[#eeedf7] transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                title="Edit task details"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetails(task);
                }}
                className="p-1 rounded text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              {onDeleteTask && (
                <button
                  type="button"
                  title="Delete task"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task.id);
                  }}
                  className="p-1 rounded text-[#71717a] hover:text-[#e11d48] hover:bg-[#fff1f2] transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Description snippet if exists */}
          {task.description && (
            <p className="mt-1 text-[13px] text-[#71717a] line-clamp-1 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Unboxed Metadata Line with '·' separator (Zero-Pill Discipline) */}
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[#71717a]">
            {project && (
              <span className="flex items-center gap-1.5 font-medium text-[#464555]">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: project.color }}
                  aria-hidden="true"
                />
                <span className="truncate max-w-[130px]">{project.name}</span>
              </span>
            )}

            {project && (task.dueDate || task.subtasks.length > 0 || task.estimatedPoms > 0) && (
              <span aria-hidden="true" className="text-[#c7c4d8]">·</span>
            )}

            {task.dueDate && (
              <span className="flex items-center gap-1 font-mono tabular-nums text-[#71717a]">
                <Calendar className="w-3 h-3 text-[#a1a1aa]" />
                <span>
                  {task.dueDate === new Date().toISOString().split('T')[0]
                    ? 'Today'
                    : task.dueDate}
                </span>
                {task.dueTime && <span>{task.dueTime}</span>}
              </span>
            )}

            {task.dueDate && (task.subtasks.length > 0 || task.estimatedPoms > 0) && (
              <span aria-hidden="true" className="text-[#c7c4d8]">·</span>
            )}

            {task.subtasks.length > 0 && (
              <span className="flex items-center gap-1 font-mono tabular-nums text-[#71717a]">
                <CheckSquare className="w-3 h-3 text-[#a1a1aa]" />
                <span>
                  {completedSubtasks}/{task.subtasks.length} subtasks
                </span>
              </span>
            )}

            {task.subtasks.length > 0 && task.estimatedPoms > 0 && (
              <span aria-hidden="true" className="text-[#c7c4d8]">·</span>
            )}

            {task.estimatedPoms > 0 && (
              <span className="flex items-center gap-1 font-mono tabular-nums text-[#71717a]">
                <Clock className="w-3 h-3 text-[#a1a1aa]" />
                <span>
                  {task.completedPoms}/{task.estimatedPoms} pom
                </span>
              </span>
            )}

            <div className="ml-auto shrink-0">
              {renderPriorityBadge(task.priority)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
