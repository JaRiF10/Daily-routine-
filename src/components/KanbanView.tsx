import React, { useState } from 'react';
import { Task, Project, Status, Priority } from '../types';
import { TaskCard } from './TaskCard';
import { QuickAddInput } from './QuickAddInput';
import { Plus, ArrowLeft, ArrowRight } from 'lucide-react';

interface KanbanViewProps {
  tasks: Task[];
  projects: Project[];
  selectedProjectId: string | null;
  onUpdateTaskStatus: (taskId: string, status: Status) => void;
  onToggleComplete: (taskId: string) => void;
  onOpenDetails: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onStartFlow: (task: Task) => void;
  onAddTask: (taskData: {
    title: string;
    projectId: string;
    priority: Priority;
    status: Status;
    isToday: boolean;
  }) => void;
}

export const KanbanView: React.FC<KanbanViewProps> = ({
  tasks,
  projects,
  selectedProjectId,
  onUpdateTaskStatus,
  onToggleComplete,
  onOpenDetails,
  onDeleteTask,
  onStartFlow,
  onAddTask,
}) => {
  const [activeLaneAdd, setActiveLaneAdd] = useState<Status | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const columns: { id: Status; title: string; color: string }[] = [
    { id: 'backlog', title: 'Backlog', color: '#71717a' },
    { id: 'in_progress', title: 'In Progress', color: '#4f46e5' },
    { id: 'in_review', title: 'In Review', color: '#f59e0b' },
    { id: 'done', title: 'Completed', color: '#059669' },
  ];

  const filteredTasks = selectedProjectId
    ? tasks.filter((t) => t.projectId === selectedProjectId)
    : tasks;

  const getProject = (id: string) => projects.find((p) => p.id === id);

  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: Status) => {
    if (draggedTaskId) {
      onUpdateTaskStatus(draggedTaskId, status);
      setDraggedTaskId(null);
    }
  };

  const moveLane = (taskId: string, currentStatus: Status, direction: 'prev' | 'next') => {
    const order: Status[] = ['backlog', 'in_progress', 'in_review', 'done'];
    const idx = order.indexOf(currentStatus);
    const targetIdx = direction === 'next' ? idx + 1 : idx - 1;
    if (targetIdx >= 0 && targetIdx < order.length) {
      onUpdateTaskStatus(taskId, order[targetIdx]);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 overflow-hidden">
      {/* Top Bar inside Kanban */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#18181b]">
            Kanban Flow Board
          </h1>
          <p className="text-[13px] text-[#71717a]">
            Fluid multi-lane progression with 16px cards and drag-and-drop movement.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-mono tabular-nums text-[#71717a]">
            {filteredTasks.length} total tasks
          </span>
        </div>
      </div>

      {/* Columns Container */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full min-w-[900px]">
          {columns.map((col, colIdx) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            const isCompletedLane = col.id === 'done';

            return (
              <div
                key={col.id}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(col.id)}
                className="flex flex-col bg-[#f4f4f5]/60 border border-[#e4e4e7] rounded-lg p-3 min-h-[500px]"
              >
                {/* Sticky Section Header (§Components: Lists & Drag Handlers) */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#e4e4e7]">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: col.color }}
                    />
                    <h2 className="text-[11px] font-semibold tracking-wider uppercase text-[#18181b]">
                      {col.title}
                    </h2>
                  </div>
                  <span className="px-2 py-0.5 text-[11px] font-mono tabular-nums text-[#71717a] bg-white rounded border border-[#e4e4e7]">
                    {colTasks.length}
                  </span>
                </div>

                {/* Cards List with 16px uniform padding on cards */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                      className="relative group cursor-grab active:cursor-grabbing"
                    >
                      <TaskCard
                        task={task}
                        project={getProject(task.projectId)}
                        onToggleComplete={onToggleComplete}
                        onOpenDetails={onOpenDetails}
                        onDeleteTask={onDeleteTask}
                        onStartFlow={onStartFlow}
                        isKanban={true}
                      />

                      {/* Rapid lane shifting arrows on hover */}
                      <div className="absolute right-3 bottom-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 px-1 py-0.5 rounded shadow-sm border border-[#e4e4e7]">
                        {colIdx > 0 && (
                          <button
                            type="button"
                            title="Move to previous column"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveLane(task.id, col.id, 'prev');
                            }}
                            className="p-1 text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] rounded"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                        )}
                        {colIdx < columns.length - 1 && (
                          <button
                            type="button"
                            title="Move to next column"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveLane(task.id, col.id, 'next');
                            }}
                            className="p-1 text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] rounded"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="py-8 px-4 border border-dashed border-[#e4e4e7] rounded-lg text-center text-[12px] text-[#a1a1aa]">
                      Drop tasks here
                    </div>
                  )}
                </div>

                {/* Quick Add Lane Card */}
                <div className="pt-2 mt-auto">
                  {activeLaneAdd === col.id ? (
                    <QuickAddInput
                      placeholder={`Add to ${col.title}...`}
                      projects={projects}
                      onAddTask={(taskData) => {
                        onAddTask({
                          ...taskData,
                          status: col.id,
                        });
                        setActiveLaneAdd(null);
                      }}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveLaneAdd(col.id)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[12px] font-medium text-[#71717a] hover:text-[#18181b] bg-white hover:bg-[#fafafa] border border-[#e4e4e7] rounded transition-colors shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#a1a1aa]" />
                      <span>Add card</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
