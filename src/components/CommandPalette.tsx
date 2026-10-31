import React, { useState, useEffect, useRef } from 'react';
import { Task, Project, ViewMode } from '../types';
import {
  Search,
  Sun,
  LayoutGrid,
  Columns,
  Calendar,
  Hourglass,
  BarChart2,
  Plus,
  Volume2,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { ambientSound } from '../utils/audio';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  projects: Project[];
  onSelectView: (view: ViewMode) => void;
  onOpenDetails: (task: Task) => void;
  onOpenNewTask: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  tasks,
  projects,
  onSelectView,
  onOpenDetails,
  onOpenNewTask,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isOpen]);

  const navigationCommands = [
    { id: 'view-today', title: 'Go to Today Focus', type: 'view' as const, view: 'today' as ViewMode, icon: Sun },
    { id: 'view-matrix', title: 'Go to All Tasks Matrix', type: 'view' as const, view: 'matrix' as ViewMode, icon: LayoutGrid },
    { id: 'view-kanban', title: 'Go to Kanban Board', type: 'view' as const, view: 'kanban' as ViewMode, icon: Columns },
    { id: 'view-schedule', title: 'Go to Weekly Schedule', type: 'view' as const, view: 'schedule' as ViewMode, icon: Calendar },
    { id: 'view-flow', title: 'Start Flow Session', type: 'view' as const, view: 'flow' as ViewMode, icon: Hourglass },
    { id: 'view-insights', title: 'View Calm Insights', type: 'view' as const, view: 'insights' as ViewMode, icon: BarChart2 },
  ];

  // Filter tasks based on query
  const matchingTasks = query.trim()
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.description?.toLowerCase().includes(query.toLowerCase()) ||
          t.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5)
    : [];

  const matchingNav = navigationCommands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  const allItems = [
    ...matchingNav,
    ...matchingTasks.map((t) => ({
      id: `task-${t.id}`,
      title: t.title,
      type: 'task' as const,
      task: t,
      icon: CheckCircle2,
    })),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, allItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % Math.max(1, allItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = allItems[selectedIndex];
      if (current) {
        if (current.type === 'view') {
          onSelectView(current.view);
          onClose();
        } else if (current.type === 'task') {
          onOpenDetails(current.task);
          onClose();
        }
      } else if (query.trim()) {
        onOpenNewTask();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white border border-[#e4e4e7] rounded-xl shadow-lvl-3 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#e4e4e7]">
          <Search className="w-4 h-4 text-[#a1a1aa] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search tasks..."
            className="flex-1 text-[14px] bg-transparent outline-none border-none text-[#18181b] placeholder:text-[#a1a1aa]"
          />
          <kbd className="text-[11px] font-mono text-[#a1a1aa] bg-[#f4f4f5] px-1.5 py-0.5 rounded border border-[#e4e4e7]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {matchingNav.length > 0 && (
            <div className="px-2 py-1 text-[11px] font-semibold tracking-wider uppercase text-[#a1a1aa]">
              Navigation
            </div>
          )}

          {matchingNav.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectView(item.view);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-[13px] rounded transition-colors ${
                  isSelected ? 'bg-[#eeedf7] text-[#3525cd] font-medium' : 'text-[#18181b] hover:bg-[#f4f4f5]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[#71717a]" />
                  <span>{item.title}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#a1a1aa]" />
              </button>
            );
          })}

          {matchingTasks.length > 0 && (
            <div className="px-2 pt-2 pb-1 text-[11px] font-semibold tracking-wider uppercase text-[#a1a1aa]">
              Tasks Found
            </div>
          )}

          {matchingTasks.map((t, idx) => {
            const itemIdx = matchingNav.length + idx;
            const isSelected = selectedIndex === itemIdx;
            const project = projects.find((p) => p.id === t.projectId);

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  onOpenDetails(t);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-[13px] rounded transition-colors ${
                  isSelected ? 'bg-[#eeedf7] text-[#3525cd] font-medium' : 'text-[#18181b] hover:bg-[#f4f4f5]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${
                      t.status === 'done' ? 'text-[#059669]' : 'text-[#a1a1aa]'
                    }`}
                  />
                  <span className="truncate">{t.title}</span>
                </div>
                {project && (
                  <span className="text-[11px] text-[#71717a] ml-2 shrink-0">
                    {project.name}
                  </span>
                )}
              </button>
            );
          })}

          {allItems.length === 0 && (
            <div className="py-6 text-center text-[13px] text-[#71717a]">
              No direct matches found. Press <span className="font-semibold text-[#18181b]">Enter</span> to create a new task.
            </div>
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#e4e4e7] bg-[#fafafa] text-[11px] text-[#71717a]">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <button
            type="button"
            onClick={() => {
              onOpenNewTask();
              onClose();
            }}
            className="flex items-center gap-1 text-[#4f46e5] font-medium hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
        </div>
      </div>
    </div>
  );
};
