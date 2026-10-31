import React, { useState } from 'react';
import { Task, Project, Priority, Status } from '../types';
import { TaskCard } from './TaskCard';
import { QuickAddInput } from './QuickAddInput';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface MatrixViewProps {
  tasks: Task[];
  projects: Project[];
  selectedProjectId: string | null;
  onToggleComplete: (taskId: string) => void;
  onOpenDetails: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onStartFlow: (task: Task) => void;
  onAddTask: (taskData: {
    title: string;
    projectId: string;
    priority: Priority;
    isToday: boolean;
  }) => void;
}

export const MatrixView: React.FC<MatrixViewProps> = ({
  tasks,
  projects,
  selectedProjectId,
  onToggleComplete,
  onOpenDetails,
  onDeleteTask,
  onStartFlow,
  onAddTask,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState<'project' | 'status' | 'priority'>('project');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const getProject = (id: string) => projects.find((p) => p.id === id);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (selectedProjectId && task.projectId !== selectedProjectId) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q) ?? false;
      const matchTags = task.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }
    return true;
  });

  const activeProject = selectedProjectId ? getProject(selectedProjectId) : null;

  // Group definitions
  const renderGroupedContent = () => {
    if (groupBy === 'project') {
      const displayProjects = selectedProjectId
        ? projects.filter((p) => p.id === selectedProjectId)
        : projects;

      return (
        <div className="space-y-8">
          {displayProjects.map((proj) => {
            const projTasks = filteredTasks.filter((t) => t.projectId === proj.id);
            return (
              <section key={proj.id} className="space-y-3">
                {/* Sticky Section Header */}
                <div className="sticky top-14 z-10 bg-[#fafafa]/95 backdrop-blur-sm py-1.5 flex items-center justify-between border-b border-[#e4e4e7]">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: proj.color }}
                    />
                    <h2 className="text-[11px] font-semibold tracking-wider uppercase text-[#18181b]">
                      {proj.name}
                    </h2>
                    {proj.description && (
                      <span className="hidden sm:inline text-[12px] text-[#71717a] font-normal">
                        — {proj.description}
                      </span>
                    )}
                  </div>
                  <span className="px-2 py-0.5 text-[11px] font-mono tabular-nums text-[#71717a] bg-[#f4f4f5] rounded border border-[#e4e4e7]">
                    {projTasks.filter((t) => t.status === 'done').length}/{projTasks.length} done
                  </span>
                </div>

                <div className="space-y-2.5">
                  {projTasks.length > 0 ? (
                    projTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        project={proj}
                        onToggleComplete={onToggleComplete}
                        onOpenDetails={onOpenDetails}
                        onDeleteTask={onDeleteTask}
                        onStartFlow={onStartFlow}
                      />
                    ))
                  ) : (
                    <div className="py-4 px-4 border border-dashed border-[#e4e4e7] rounded-lg text-center text-[13px] text-[#a1a1aa]">
                      No tasks in this project
                    </div>
                  )}
                  <QuickAddInput
                    placeholder={`Add task to ${proj.name}... (Press Enter)`}
                    defaultProjectId={proj.id}
                    projects={projects}
                    onAddTask={onAddTask}
                  />
                </div>
              </section>
            );
          })}
        </div>
      );
    }

    if (groupBy === 'status') {
      const statuses: { key: Status; label: string }[] = [
        { key: 'backlog', label: 'Backlog' },
        { key: 'in_progress', label: 'In Progress' },
        { key: 'in_review', label: 'In Review' },
        { key: 'done', label: 'Completed' },
      ];

      return (
        <div className="space-y-8">
          {statuses.map(({ key, label }) => {
            const statusTasks = filteredTasks.filter((t) => t.status === key);
            return (
              <section key={key} className="space-y-3">
                <div className="sticky top-14 z-10 bg-[#fafafa]/95 backdrop-blur-sm py-1.5 flex items-center justify-between border-b border-[#e4e4e7]">
                  <h2 className="text-[11px] font-semibold tracking-wider uppercase text-[#18181b]">
                    {label}
                  </h2>
                  <span className="px-2 py-0.5 text-[11px] font-mono tabular-nums text-[#71717a] bg-[#f4f4f5] rounded border border-[#e4e4e7]">
                    {statusTasks.length} tasks
                  </span>
                </div>

                <div className="space-y-2.5">
                  {statusTasks.length > 0 ? (
                    statusTasks.map((task) => (
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
                    <div className="py-4 px-4 border border-dashed border-[#e4e4e7] rounded-lg text-center text-[13px] text-[#a1a1aa]">
                      No tasks in {label}
                    </div>
                  )}
                  <QuickAddInput
                    placeholder={`Add task to ${label}... (Press Enter)`}
                    projects={projects}
                    onAddTask={onAddTask}
                  />
                </div>
              </section>
            );
          })}
        </div>
      );
    }

    // groupBy === 'priority'
    const priorities: { key: Priority; label: string }[] = [
      { key: 'urgent', label: 'Urgent Priority' },
      { key: 'high', label: 'High Priority' },
      { key: 'medium', label: 'Medium Priority' },
      { key: 'low', label: 'Low Priority' },
    ];

    return (
      <div className="space-y-8">
        {priorities.map(({ key, label }) => {
          const prioTasks = filteredTasks.filter((t) => t.priority === key);
          return (
            <section key={key} className="space-y-3">
              <div className="sticky top-14 z-10 bg-[#fafafa]/95 backdrop-blur-sm py-1.5 flex items-center justify-between border-b border-[#e4e4e7]">
                <h2 className="text-[11px] font-semibold tracking-wider uppercase text-[#18181b]">
                  {label}
                </h2>
                <span className="px-2 py-0.5 text-[11px] font-mono tabular-nums text-[#71717a] bg-[#f4f4f5] rounded border border-[#e4e4e7]">
                  {prioTasks.length} tasks
                </span>
              </div>

              <div className="space-y-2.5">
                {prioTasks.length > 0 ? (
                  prioTasks.map((task) => (
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
                  <div className="py-4 px-4 border border-dashed border-[#e4e4e7] rounded-lg text-center text-[13px] text-[#a1a1aa]">
                    No {label.toLowerCase()} tasks
                  </div>
                )}
                <QuickAddInput
                  placeholder={`Add ${key} task... (Press Enter)`}
                  defaultPriority={key}
                  projects={projects}
                  onAddTask={onAddTask}
                />
              </div>
            </section>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Title & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#18181b]">
            {activeProject ? activeProject.name : 'All Tasks Matrix'}
          </h1>
          <p className="text-[14px] text-[#71717a] mt-0.5">
            {activeProject
              ? activeProject.description || 'Project task backlog and progress.'
              : 'Structured multi-view catalog across all active workflows.'}
          </p>
        </div>

        {/* Group By Selector */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-[12px] text-[#71717a]">Group by:</span>
          <div className="flex items-center gap-1 p-0.5 bg-[#f4f4f5] rounded border border-[#e4e4e7]">
            {(['project', 'status', 'priority'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setGroupBy(mode)}
                className={`px-2.5 py-1 text-[11px] font-medium capitalize rounded transition-all ${
                  groupBy === mode
                    ? 'bg-white text-[#18181b] shadow-sm'
                    : 'text-[#71717a] hover:text-[#18181b]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#a1a1aa]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter tasks by name, notes, or tags..."
            className="w-full h-9 pl-9 pr-3 text-[13px] bg-white border border-[#e4e4e7] rounded-lg outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15 transition-all"
          />
        </div>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          aria-label="Filter by priority"
          className="h-9 px-3 text-[12px] bg-white border border-[#e4e4e7] rounded-lg outline-none text-[#71717a] hover:border-[#d4d4d8] cursor-pointer"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Render Grouped Content */}
      {renderGroupedContent()}
    </div>
  );
};
