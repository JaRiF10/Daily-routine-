import React, { useState } from 'react';
import { ViewMode, Project, Task } from '../types';
import {
  Sun,
  LayoutGrid,
  Columns,
  Calendar,
  Hourglass,
  BarChart2,
  FolderPlus,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  CheckCircle2,
} from 'lucide-react';
import { ambientSound } from '../utils/audio';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  selectedProjectId: string | null;
  onSelectProject: (projectId: string | null) => void;
  projects: Project[];
  tasks: Task[];
  onAddProject: (name: string, color: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  selectedProjectId,
  onSelectProject,
  projects,
  tasks,
  onAddProject,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState('#4f46e5');
  const [ambientPlaying, setAmbientPlaying] = useState(false);

  const navItems: { id: ViewMode; label: string; icon: React.ElementType }[] = [
    { id: 'today', label: 'Today Focus', icon: Sun },
    { id: 'matrix', label: 'All Tasks Matrix', icon: LayoutGrid },
    { id: 'kanban', label: 'Kanban Board', icon: Columns },
    { id: 'schedule', label: 'Weekly Schedule', icon: Calendar },
    { id: 'flow', label: 'Flow Session', icon: Hourglass },
    { id: 'insights', label: 'Calm Insights', icon: BarChart2 },
  ];

  const todayTasks = tasks.filter((t) => t.isToday);
  const todayCompleted = todayTasks.filter((t) => t.status === 'done').length;
  const todayProgressPercent =
    todayTasks.length > 0 ? Math.round((todayCompleted / todayTasks.length) * 100) : 0;

  const handleToggleAmbient = () => {
    if (ambientPlaying) {
      ambientSound.stop();
      setAmbientPlaying(false);
    } else {
      ambientSound.play('rain', 0.3);
      setAmbientPlaying(true);
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    onAddProject(newProjectName.trim(), newProjectColor);
    setNewProjectName('');
    setIsAddingProject(false);
  };

  return (
    <aside
      className={`relative flex flex-col bg-[#fafafa] border-r border-[#e4e4e7] transition-all duration-200 select-none shrink-0 ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Collapse / Expand rail toggle */}
      <button
        type="button"
        onClick={onToggleCollapse}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-5 z-20 w-6 h-6 rounded-full bg-white border border-[#e4e4e7] shadow-sm flex items-center justify-center text-[#71717a] hover:text-[#18181b] hover:border-[#d4d4d8] transition-colors"
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Primary Navigation Views */}
      <div className="p-3 space-y-1">
        <div className={`px-2 pt-1 pb-1.5 text-[11px] font-semibold tracking-wider text-[#a1a1aa] uppercase ${isCollapsed ? 'text-center' : ''}`}>
          {!isCollapsed ? 'Workspace' : '•••'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id && selectedProjectId === null;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectView(item.id);
                onSelectProject(null);
              }}
              title={item.label}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] font-medium rounded transition-colors ${
                isActive
                  ? 'bg-white text-[#18181b] shadow-sm border border-[#e4e4e7]'
                  : 'text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#4f46e5]' : 'text-[#71717a]'}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
              {!isCollapsed && item.id === 'today' && (
                <span className="ml-auto font-mono text-[11px] tabular-nums text-[#a1a1aa]">
                  {todayCompleted}/{todayTasks.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Separator */}
      <div className="mx-3 my-2 border-t border-[#e4e4e7]" />

      {/* Projects Section */}
      <div className="flex-1 px-3 py-1 overflow-y-auto space-y-1">
        <div className="flex items-center justify-between px-2 pb-1.5">
          {!isCollapsed && (
            <span className="text-[11px] font-semibold tracking-wider text-[#a1a1aa] uppercase">
              Projects
            </span>
          )}
          {!isCollapsed && (
            <button
              type="button"
              onClick={() => setIsAddingProject(!isAddingProject)}
              title="Add Project"
              className="p-1 rounded text-[#a1a1aa] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Project quick-add form */}
        {isAddingProject && !isCollapsed && (
          <form onSubmit={handleCreateProject} className="p-2 mb-2 bg-white rounded border border-[#e4e4e7] space-y-2 shadow-sm">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project name..."
              autoFocus
              className="w-full text-[12px] px-2 py-1 bg-[#f4f4f5] border border-[#e4e4e7] rounded outline-none focus:border-[#4f46e5]"
            />
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1">
                {['#4f46e5', '#059669', '#3b82f6', '#8b5cf6', '#e11d48'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewProjectColor(c)}
                    className={`w-4 h-4 rounded-full transition-transform ${
                      newProjectColor === c ? 'scale-125 ring-2 ring-offset-1 ring-[#4f46e5]' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsAddingProject(false)}
                  className="text-[11px] text-[#71717a] px-1.5 py-0.5 rounded hover:bg-[#f4f4f5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newProjectName.trim()}
                  className="text-[11px] font-medium text-white bg-[#4f46e5] px-2 py-0.5 rounded hover:bg-[#4338ca] disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Project rows */}
        {projects.map((proj) => {
          const isSelected = selectedProjectId === proj.id;
          const projectTaskCount = tasks.filter(
            (t) => t.projectId === proj.id && t.status !== 'done'
          ).length;

          return (
            <button
              key={proj.id}
              onClick={() => {
                onSelectProject(isSelected ? null : proj.id);
                if (currentView === 'today' || currentView === 'insights' || currentView === 'schedule') {
                  onSelectView('matrix');
                }
              }}
              title={proj.name}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] font-medium rounded transition-colors ${
                isSelected
                  ? 'bg-white text-[#18181b] shadow-sm border border-[#e4e4e7]'
                  : 'text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5]'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: proj.color }}
              />
              {!isCollapsed && <span className="truncate">{proj.name}</span>}
              {!isCollapsed && (
                <span className="ml-auto font-mono text-[11px] tabular-nums text-[#a1a1aa]">
                  {projectTaskCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Area: Ambient Sound & Daily Accomplishment */}
      <div className="p-3 border-t border-[#e4e4e7] space-y-2.5">
        {/* Ambient Soundscape Controller */}
        <button
          type="button"
          onClick={handleToggleAmbient}
          title={ambientPlaying ? 'Mute ambient soundscape' : 'Play focus ambient soundscape'}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-[12px] font-medium rounded border transition-colors ${
            ambientPlaying
              ? 'bg-[#ecfdf5] text-[#059669] border-[#059669]/30'
              : 'bg-white text-[#71717a] hover:text-[#18181b] border-[#e4e4e7] hover:border-[#d4d4d8]'
          }`}
        >
          <div className="flex items-center gap-2">
            {ambientPlaying ? (
              <Volume2 className="w-3.5 h-3.5 text-[#059669] animate-pulse" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-[#a1a1aa]" />
            )}
            {!isCollapsed && <span>{ambientPlaying ? 'Rain Focus Audio' : 'Ambient Audio'}</span>}
          </div>
          {!isCollapsed && (
            <span className="text-[10px] font-mono tracking-wider uppercase text-[#a1a1aa]">
              {ambientPlaying ? 'ON' : 'OFF'}
            </span>
          )}
        </button>

        {/* Calm Progress Strip */}
        {!isCollapsed && (
          <div className="p-2.5 bg-white border border-[#e4e4e7] rounded-lg shadow-lvl-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-[#71717a] mb-1.5">
              <span className="flex items-center gap-1 text-[#18181b]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                <span>Today's Flow</span>
              </span>
              <span className="font-mono tabular-nums text-[#464555]">
                {todayProgressPercent}%
              </span>
            </div>
            {/* Emerald Progress Bar */}
            <div className="w-full h-1.5 bg-[#f4f4f5] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#059669] transition-all duration-300 rounded-full"
                style={{ width: `${todayProgressPercent}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#a1a1aa] font-mono tabular-nums">
              <span>{todayCompleted} completed</span>
              <span>{todayTasks.length - todayCompleted} remaining</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
