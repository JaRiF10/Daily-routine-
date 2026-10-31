import React, { useState } from 'react';
import { Plus, CornerDownLeft, Sparkles } from 'lucide-react';
import { Priority, Project } from '../types';

interface QuickAddInputProps {
  placeholder?: string;
  defaultProjectId?: string;
  defaultPriority?: Priority;
  defaultSlot?: 'morning' | 'afternoon' | 'evening';
  isTodayDefault?: boolean;
  projects: Project[];
  onAddTask: (taskData: {
    title: string;
    projectId: string;
    priority: Priority;
    isToday: boolean;
    timeSlot?: 'morning' | 'afternoon' | 'evening';
  }) => void;
}

export const QuickAddInput: React.FC<QuickAddInputProps> = ({
  placeholder = 'Add a task... (Press Enter)',
  defaultProjectId,
  defaultPriority = 'medium',
  defaultSlot,
  isTodayDefault = true,
  projects,
  onAddTask,
}) => {
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState<string>(
    defaultProjectId || (projects[0]?.id ?? 'proj-1')
  );
  const [priority, setPriority] = useState<Priority>(defaultPriority);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    onAddTask({
      title: cleanTitle,
      projectId,
      priority,
      isToday: isTodayDefault,
      timeSlot: defaultSlot,
    });

    setTitle('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center gap-2 bg-white rounded-lg transition-all duration-150 border px-3 h-10 ${
        isFocused
          ? 'border-[#4f46e5] ring-2 ring-[#4f46e5]/15 shadow-sm'
          : 'border-[#e4e4e7] hover:border-[#d4d4d8] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]'
      }`}
    >
      <Plus className={`w-4 h-4 transition-colors shrink-0 ${isFocused ? 'text-[#4f46e5]' : 'text-[#a1a1aa]'}`} />

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-1 text-[13px] text-[#18181b] placeholder:text-[#a1a1aa] bg-transparent outline-none border-none py-1"
      />

      {/* Project selector shortcut */}
      {isFocused && projects.length > 0 && (
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          aria-label="Select project"
          className="text-[11px] font-medium text-[#464555] bg-[#f4f4f5] hover:bg-[#e4e4e7] rounded px-2 py-1 border border-[#e4e4e7] outline-none cursor-pointer"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      )}

      {/* Priority badge selector shortcut */}
      {isFocused && (
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          aria-label="Select priority"
          className="text-[11px] font-medium text-[#464555] bg-[#f4f4f5] hover:bg-[#e4e4e7] rounded px-2 py-1 border border-[#e4e4e7] outline-none cursor-pointer"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      )}

      <button
        type="submit"
        disabled={!title.trim()}
        aria-label="Submit task"
        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded transition-all shrink-0 ${
          title.trim()
            ? 'bg-[#4f46e5] text-white hover:bg-[#4338ca] shadow-sm'
            : 'text-[#a1a1aa] bg-[#f4f4f5] cursor-not-allowed'
        }`}
      >
        <span>Add</span>
        <CornerDownLeft className="w-3 h-3" />
      </button>
    </form>
  );
};
