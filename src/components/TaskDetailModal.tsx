import React, { useState, useEffect } from 'react';
import { Task, Project, Priority, Status, Subtask } from '../types';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Layers,
  Flag,
  Play,
  CheckSquare,
  CheckCircle2,
} from 'lucide-react';

interface TaskDetailModalProps {
  task: Task | null;
  projects: Project[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (updated: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onStartFlow: (task: Task) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  projects,
  isOpen,
  onClose,
  onUpdateTask,
  onDeleteTask,
  onStartFlow,
}) => {
  if (!isOpen || !task) return null;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState<Status>(task.status);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [projectId, setProjectId] = useState<string>(task.projectId);
  const [dueDate, setDueDate] = useState<string>(task.dueDate || '');
  const [dueTime, setDueTime] = useState<string>(task.dueTime || '');
  const [estimatedPoms, setEstimatedPoms] = useState<number>(task.estimatedPoms || 1);
  const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Sync state if task changes
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || '');
    setStatus(task.status);
    setPriority(task.priority);
    setProjectId(task.projectId);
    setDueDate(task.dueDate || '');
    setDueTime(task.dueTime || '');
    setEstimatedPoms(task.estimatedPoms || 1);
    setSubtasks(task.subtasks || []);
  }, [task]);

  const handleSave = () => {
    onUpdateTask({
      ...task,
      title: title.trim() || task.title,
      description: description.trim(),
      status,
      priority,
      projectId,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      estimatedPoms,
      subtasks,
      completedAt: status === 'done' && !task.completedAt ? new Date().toISOString() : task.completedAt,
    });
    onClose();
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const newSub: Subtask = {
      id: `sub-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    setSubtasks([...subtasks, newSub]);
    setNewSubtaskTitle('');
  };

  const toggleSubtask = (subId: string) => {
    setSubtasks(
      subtasks.map((s) => (s.id === subId ? { ...s, completed: !s.completed } : s))
    );
  };

  const deleteSubtask = (subId: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== subId));
  };

  const completedSubtasksCount = subtasks.filter((s) => s.completed).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white border border-[#e4e4e7] rounded-xl shadow-lvl-3 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e4e4e7] bg-[#fafafa]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setStatus(status === 'done' ? 'in_progress' : 'done');
              }}
              className={`w-[18px] h-[18px] rounded flex items-center justify-center transition-all ${
                status === 'done'
                  ? 'bg-[#059669] text-white'
                  : 'border-[1.5px] border-[#d4d4d8] bg-white hover:border-[#4f46e5]'
              }`}
            >
              {status === 'done' && (
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2.5 6.2L4.8 8.5L9.5 3.5" />
                </svg>
              )}
            </button>
            <span className="text-[12px] font-medium text-[#71717a] uppercase tracking-wider">
              {status === 'done' ? 'Completed' : 'Task Details'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onStartFlow(task);
                onClose();
              }}
              title="Start Flow Timer on this task"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium text-[#4f46e5] bg-[#eeedf7] hover:bg-[#e0defa] rounded transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Flow</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Delete this task?')) {
                  onDeleteTask(task.id);
                  onClose();
                }
              }}
              title="Delete task"
              className="p-1.5 text-[#71717a] hover:text-[#e11d48] hover:bg-[#fff1f2] rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Title Input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title..."
              className="w-full text-lg sm:text-xl font-semibold tracking-tight text-[#18181b] border-none outline-none focus:ring-0 placeholder:text-[#a1a1aa]"
            />
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-[#f4f4f5]/60 border border-[#e4e4e7] rounded-lg text-[13px]">
            {/* Status */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#71717a]">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full h-8 px-2 bg-white border border-[#e4e4e7] rounded text-[#18181b] outline-none text-[12px]"
              >
                <option value="backlog">Backlog</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Completed</option>
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#71717a]">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full h-8 px-2 bg-white border border-[#e4e4e7] rounded text-[#18181b] outline-none text-[12px]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Project */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#71717a]">
                Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full h-8 px-2 bg-white border border-[#e4e4e7] rounded text-[#18181b] outline-none text-[12px]"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Estimated Flow Blocks */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#71717a]">
                Est. Pomodoros (25m)
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={estimatedPoms}
                onChange={(e) => setEstimatedPoms(parseInt(e.target.value) || 1)}
                className="w-full h-8 px-2 bg-white border border-[#e4e4e7] rounded text-[#18181b] outline-none text-[12px] font-mono tabular-nums"
              />
            </div>

            {/* Due Date */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#71717a]">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-8 px-2 bg-white border border-[#e4e4e7] rounded text-[#18181b] outline-none text-[12px] font-mono"
              />
            </div>

            {/* Due Time */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#71717a]">
                Time Target
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full h-8 px-2 bg-white border border-[#e4e4e7] rounded text-[#18181b] outline-none text-[12px] font-mono"
              />
            </div>
          </div>

          {/* Description / Notes */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#71717a]">
              Notes & Intentions
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add context, references, or definition of done..."
              className="w-full p-3 text-[13px] bg-white border border-[#e4e4e7] rounded-lg outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15 transition-all resize-y leading-relaxed"
            />
          </div>

          {/* Subtasks Checklist */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#71717a]">
                Subtasks Checklist
              </label>
              {subtasks.length > 0 && (
                <span className="text-[11px] font-mono tabular-nums text-[#71717a]">
                  {completedSubtasksCount} of {subtasks.length} done
                </span>
              )}
            </div>

            {/* Subtask list */}
            <div className="space-y-1.5">
              {subtasks.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center gap-2 p-2 bg-[#fafafa] hover:bg-white border border-[#e4e4e7] rounded transition-colors group"
                >
                  <button
                    type="button"
                    onClick={() => toggleSubtask(sub.id)}
                    className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                      sub.completed
                        ? 'bg-[#059669] text-white'
                        : 'border-[1.5px] border-[#d4d4d8] bg-white hover:border-[#4f46e5]'
                    }`}
                  >
                    {sub.completed && (
                      <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M2.5 6.2L4.8 8.5L9.5 3.5" />
                      </svg>
                    )}
                  </button>

                  <span
                    className={`flex-1 text-[13px] ${
                      sub.completed ? 'line-through text-[#a1a1aa]' : 'text-[#18181b]'
                    }`}
                  >
                    {sub.title}
                  </span>

                  <button
                    type="button"
                    onClick={() => deleteSubtask(sub.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#a1a1aa] hover:text-[#e11d48] rounded transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add subtask input */}
            <form onSubmit={handleAddSubtask} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="+ Add a subtask..."
                className="flex-1 h-8 px-2.5 text-[12px] bg-white border border-[#e4e4e7] rounded outline-none focus:border-[#4f46e5]"
              />
              <button
                type="submit"
                disabled={!newSubtaskTitle.trim()}
                className="h-8 px-3 text-[12px] font-medium bg-[#f4f4f5] hover:bg-[#e4e4e7] text-[#18181b] rounded transition-colors disabled:opacity-50"
              >
                Add
              </button>
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-3.5 border-t border-[#e4e4e7] bg-[#fafafa]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] rounded transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-[13px] font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca] rounded transition-colors shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
