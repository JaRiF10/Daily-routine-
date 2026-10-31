import React, { useState, useEffect } from 'react';
import { Task, Project, ViewMode, Priority, Status, FlowSessionSettings } from './types';
import {
  loadTasks,
  saveTasks,
  loadProjects,
  saveProjects,
  loadFlowSettings,
  saveFlowSettings,
} from './utils/storage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TodayView } from './components/TodayView';
import { MatrixView } from './components/MatrixView';
import { KanbanView } from './components/KanbanView';
import { FlowSessionView } from './components/FlowSessionView';
import { ScheduleView } from './components/ScheduleView';
import { InsightsView } from './components/InsightsView';
import { TaskDetailModal } from './components/TaskDetailModal';
import { CommandPalette } from './components/CommandPalette';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [flowSettings, setFlowSettings] = useState<FlowSessionSettings>(() => loadFlowSettings());

  const [currentView, setCurrentView] = useState<ViewMode>('today');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Modals state
  const [activeTaskForFlow, setActiveTaskForFlow] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    saveFlowSettings(flowSettings);
  }, [flowSettings]);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleToggleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextDone = t.status !== 'done';
          return {
            ...t,
            status: nextDone ? 'done' : 'in_progress',
            completedAt: nextDone ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: Status) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: newStatus,
              completedAt: newStatus === 'done' ? new Date().toISOString() : undefined,
            }
          : t
      )
    );
  };

  const handleUpdateTaskDate = (taskId: string, newDate: string) => {
    const todayIso = new Date().toISOString().split('T')[0];
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              dueDate: newDate,
              isToday: newDate === todayIso,
            }
          : t
      )
    );
  };

  const handleIncrementPom = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completedPoms: (t.completedPoms || 0) + 1 } : t))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (editingTask?.id === taskId) setEditingTask(null);
    if (activeTaskForFlow?.id === taskId) setActiveTaskForFlow(null);
  };

  const handleUpdateTask = (updated: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setEditingTask(null);
  };

  const handleAddNewTask = (taskData: {
    title: string;
    projectId?: string;
    priority?: Priority;
    status?: Status;
    dueDate?: string;
    isToday?: boolean;
    timeSlot?: 'morning' | 'afternoon' | 'evening';
  }) => {
    const todayIso = new Date().toISOString().split('T')[0];
    const isToday = taskData.isToday ?? (taskData.dueDate === todayIso);

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskData.title,
      description: '',
      status: taskData.status || 'backlog',
      priority: taskData.priority || 'medium',
      projectId: taskData.projectId || selectedProjectId || projects[0]?.id || 'proj-1',
      dueDate: taskData.dueDate || (isToday ? todayIso : undefined),
      isToday: isToday,
      timeSlot: taskData.timeSlot,
      subtasks: [],
      estimatedPoms: 1,
      completedPoms: 0,
      createdAt: new Date().toISOString(),
      tags: [],
    };

    setTasks((prev) => [newTask, ...prev]);
  };

  const handleAddProject = (name: string, color: string) => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name,
      color,
      iconName: 'Folder',
    };
    setProjects((prev) => [...prev, newProj]);
  };

  const handleStartFlow = (task: Task) => {
    setActiveTaskForFlow(task);
    setCurrentView('flow');
  };

  const handleOpenBlankNewTask = () => {
    const todayIso = new Date().toISOString().split('T')[0];
    const blankTask: Task = {
      id: `task-${Date.now()}`,
      title: '',
      description: '',
      status: 'backlog',
      priority: 'medium',
      projectId: selectedProjectId || projects[0]?.id || 'proj-1',
      dueDate: todayIso,
      isToday: true,
      subtasks: [],
      estimatedPoms: 1,
      completedPoms: 0,
      createdAt: new Date().toISOString(),
      tags: [],
    };
    setEditingTask(blankTask);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#18181b] flex flex-col font-sans selection:bg-[#eeedf7] selection:text-[#3525cd]">
      {/* Top Bar Header strictly following Top Bar Contract (§2) */}
      <Header
        currentView={currentView}
        onSelectView={(v) => {
          setCurrentView(v);
          setSelectedProjectId(null);
        }}
        onOpenNewTask={handleOpenBlankNewTask}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
          projects={projects}
          tasks={tasks}
          onAddProject={handleAddProject}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Dynamic View Canvas */}
        <main className="flex-1 overflow-y-auto bg-[#fafafa]">
          {currentView === 'today' && (
            <TodayView
              tasks={tasks}
              projects={projects}
              onToggleComplete={handleToggleComplete}
              onOpenDetails={setEditingTask}
              onDeleteTask={handleDeleteTask}
              onStartFlow={handleStartFlow}
              onAddTask={handleAddNewTask}
            />
          )}

          {currentView === 'matrix' && (
            <MatrixView
              tasks={tasks}
              projects={projects}
              selectedProjectId={selectedProjectId}
              onToggleComplete={handleToggleComplete}
              onOpenDetails={setEditingTask}
              onDeleteTask={handleDeleteTask}
              onStartFlow={handleStartFlow}
              onAddTask={handleAddNewTask}
            />
          )}

          {currentView === 'kanban' && (
            <KanbanView
              tasks={tasks}
              projects={projects}
              selectedProjectId={selectedProjectId}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onToggleComplete={handleToggleComplete}
              onOpenDetails={setEditingTask}
              onDeleteTask={handleDeleteTask}
              onStartFlow={handleStartFlow}
              onAddTask={handleAddNewTask}
            />
          )}

          {currentView === 'flow' && (
            <FlowSessionView
              tasks={tasks}
              projects={projects}
              activeTask={activeTaskForFlow}
              onSelectActiveTask={setActiveTaskForFlow}
              onToggleComplete={handleToggleComplete}
              onIncrementPom={handleIncrementPom}
              settings={flowSettings}
              onUpdateSettings={setFlowSettings}
            />
          )}

          {currentView === 'schedule' && (
            <ScheduleView
              tasks={tasks}
              projects={projects}
              onToggleComplete={handleToggleComplete}
              onOpenDetails={setEditingTask}
              onDeleteTask={handleDeleteTask}
              onStartFlow={handleStartFlow}
              onUpdateTaskDate={handleUpdateTaskDate}
              onAddTask={handleAddNewTask}
            />
          )}

          {currentView === 'insights' && (
            <InsightsView tasks={tasks} projects={projects} />
          )}
        </main>
      </div>

      {/* Task Details Modal / Drawer (Large 12px rounded-xl with Level 3 shadow) */}
      <TaskDetailModal
        task={editingTask}
        projects={projects}
        isOpen={editingTask !== null}
        onClose={() => setEditingTask(null)}
        onUpdateTask={(updated) => {
          if (!tasks.some((t) => t.id === updated.id)) {
            setTasks((prev) => [updated, ...prev]);
          } else {
            handleUpdateTask(updated);
          }
          setEditingTask(null);
        }}
        onDeleteTask={handleDeleteTask}
        onStartFlow={handleStartFlow}
      />

      {/* Elevated Floating Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        tasks={tasks}
        projects={projects}
        onSelectView={(v) => {
          setCurrentView(v);
          setSelectedProjectId(null);
        }}
        onOpenDetails={setEditingTask}
        onOpenNewTask={handleOpenBlankNewTask}
      />
    </div>
  );
}
