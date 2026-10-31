import { Project, Task, FlowSessionSettings } from '../types';
import { INITIAL_PROJECTS, INITIAL_TASKS } from '../data/initialData';

const TASKS_KEY = 'calm_flow_tasks_v1';
const PROJECTS_KEY = 'calm_flow_projects_v1';
const FLOW_SETTINGS_KEY = 'calm_flow_settings_v1';

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) return INITIAL_TASKS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_TASKS;
  } catch {
    return INITIAL_TASKS;
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch {
    // ignore
  }
}

export function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) return INITIAL_PROJECTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PROJECTS;
  } catch {
    return INITIAL_PROJECTS;
  }
}

export function saveProjects(projects: Project[]): void {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch {
    // ignore
  }
}

export function loadFlowSettings(): FlowSessionSettings {
  const defaults: FlowSessionSettings = {
    focusDurationMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    soundType: 'rain',
    volume: 0.35,
  };
  try {
    const raw = localStorage.getItem(FLOW_SETTINGS_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

export function saveFlowSettings(settings: FlowSessionSettings): void {
  try {
    localStorage.setItem(FLOW_SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}
