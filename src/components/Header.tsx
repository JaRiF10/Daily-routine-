import React from 'react';
import { ViewMode } from '../types';
import { Plus, Search } from 'lucide-react';

interface HeaderProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  onOpenNewTask: () => void;
  onOpenCommandPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  onOpenNewTask,
  onOpenCommandPalette,
}) => {
  const navItems: { id: ViewMode; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'matrix', label: 'Matrix' },
    { id: 'kanban', label: 'Kanban' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'flow', label: 'Flow Session' },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-[#fafafa]/90 backdrop-blur-md border-b border-[#e4e4e7]">
      {/* Zone 1: Single text element wordmark in display face */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => onSelectView('today')}
          className="text-[17px] font-semibold tracking-[-0.02em] text-[#18181b] hover:text-[#3525cd] transition-colors whitespace-nowrap shrink-0"
        >
          Calm Flow
        </button>
      </div>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-[#71717a]">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`whitespace-nowrap shrink-0 py-1 transition-colors relative ${
                isActive
                  ? 'text-[#18181b] font-semibold'
                  : 'hover:text-[#18181b]'
              }`}
            >
              {item.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4f46e5] rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          title="Search or commands (⌘K / Ctrl+K)"
          className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1.5 text-[12px] font-medium text-[#71717a] hover:text-[#18181b] bg-white border border-[#e4e4e7] rounded hover:border-[#d4d4d8] shadow-sm transition-all"
        >
          <Search className="w-3.5 h-3.5 text-[#a1a1aa]" />
          <span>Search</span>
          <kbd className="font-mono text-[10px] text-[#a1a1aa] bg-[#f4f4f5] px-1 py-0.5 rounded border border-[#e4e4e7]">
            ⌘K
          </kbd>
        </button>

        <button
          type="button"
          onClick={onOpenNewTask}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca] active:scale-[0.98] rounded transition-all shadow-sm whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};
