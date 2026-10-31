import { Project, Task } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Design System',
    color: '#4f46e5', // Indigo
    iconName: 'Layers',
    description: 'Component architecture, tokens, and visual balance'
  },
  {
    id: 'proj-2',
    name: 'Core Sync Engine',
    color: '#059669', // Emerald
    iconName: 'Cpu',
    description: 'High-throughput offline-first synchronization'
  },
  {
    id: 'proj-3',
    name: 'Product Strategy',
    color: '#3b82f6', // Sky/Blue
    iconName: 'Compass',
    description: 'Q4 customer journey mapping and key milestones'
  },
  {
    id: 'proj-4',
    name: 'Personal Wellbeing',
    color: '#8b5cf6', // Violet
    iconName: 'Sun',
    description: 'Deep work rituals, reading, and mindful habits'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Audit Geist typographic rhythm and scale',
    description: 'Verify heading tracking (-0.025em to -0.015em), tabular figures on all timestamps, and body line heights for sustained legibility.',
    status: 'done',
    priority: 'high',
    projectId: 'proj-1',
    dueDate: '2026-10-31',
    dueTime: '10:00',
    isToday: true,
    timeSlot: 'morning',
    subtasks: [
      { id: 'sub-1', title: 'Check display-lg tracking at 2.25rem', completed: true },
      { id: 'sub-2', title: 'Ensure tabular-nums in metric counters', completed: true },
      { id: 'sub-3', title: 'Test 65ch line measure across task notes', completed: true }
    ],
    estimatedPoms: 2,
    completedPoms: 2,
    createdAt: '2026-10-30T08:00:00Z',
    completedAt: '2026-10-31T09:30:00Z',
    tags: ['design', 'typography']
  },
  {
    id: 'task-2',
    title: 'Implement 18px animated checkbox with emerald check',
    description: 'Create 4px rounded checkbox frame with 1.5px zinc-300 hairline border and smooth fill transition to #059669.',
    status: 'done',
    priority: 'medium',
    projectId: 'proj-1',
    dueDate: '2026-10-31',
    dueTime: '11:30',
    isToday: true,
    timeSlot: 'morning',
    subtasks: [
      { id: 'sub-4', title: 'Square 18px dimensions with 4px radius', completed: true },
      { id: 'sub-5', title: 'SVG checkmark scale from center', completed: true }
    ],
    estimatedPoms: 1,
    completedPoms: 1,
    createdAt: '2026-10-30T09:15:00Z',
    completedAt: '2026-10-31T11:15:00Z',
    tags: ['ui', 'micro-delight']
  },
  {
    id: 'task-3',
    title: 'Structure multi-column Kanban board with 16px cards',
    description: 'Ensure Backlog, In Progress, Review, and Completed columns support fluid task movement with Level 1 to Level 2 elevation.',
    status: 'in_progress',
    priority: 'urgent',
    projectId: 'proj-1',
    dueDate: '2026-10-31',
    dueTime: '14:30',
    isToday: true,
    timeSlot: 'afternoon',
    subtasks: [
      { id: 'sub-6', title: 'Column headers with sticky uppercase label-xs', completed: true },
      { id: 'sub-7', title: 'Uniform 16px internal padding for board cards', completed: false },
      { id: 'sub-8', title: 'Quick-add button at bottom of each lane', completed: false }
    ],
    estimatedPoms: 3,
    completedPoms: 1,
    createdAt: '2026-10-31T08:30:00Z',
    tags: ['kanban', 'core']
  },
  {
    id: 'task-4',
    title: 'Benchmark optimistic conflict resolution in sync engine',
    description: 'Simulate concurrent multi-device updates on task hierarchies with vector clocks to prevent data overwrite.',
    status: 'in_progress',
    priority: 'high',
    projectId: 'proj-2',
    dueDate: '2026-10-31',
    dueTime: '16:00',
    isToday: true,
    timeSlot: 'afternoon',
    subtasks: [
      { id: 'sub-9', title: 'Construct 100-node simulated partition test', completed: false },
      { id: 'sub-10', title: 'Profile latency overhead under 15ms target', completed: false }
    ],
    estimatedPoms: 4,
    completedPoms: 2,
    createdAt: '2026-10-31T09:00:00Z',
    tags: ['sync', 'performance']
  },
  {
    id: 'task-5',
    title: 'Synthesize low-friction Pomodoro flow with ambient soundscapes',
    description: 'Integrate Web Audio procedural rain, ocean waves, and breeze to maintain distraction-free cognitive stamina.',
    status: 'in_progress',
    priority: 'medium',
    projectId: 'proj-4',
    dueDate: '2026-10-31',
    dueTime: '17:30',
    isToday: true,
    timeSlot: 'afternoon',
    subtasks: [
      { id: 'sub-11', title: 'Procedural pink-noise rain filter shaping', completed: true },
      { id: 'sub-12', title: 'Smooth volume ramp curve', completed: true },
      { id: 'sub-13', title: 'Link timer directly to active task completion', completed: false }
    ],
    estimatedPoms: 2,
    completedPoms: 1,
    createdAt: '2026-10-31T10:00:00Z',
    tags: ['focus', 'audio']
  },
  {
    id: 'task-6',
    title: 'Synthesize Q4 customer feedback into strategic themes',
    description: 'Collate notes from 18 interviews into high-leverage opportunities: faster capture, keyboard shortcuts, and weekly capacity planning.',
    status: 'in_review',
    priority: 'medium',
    projectId: 'proj-3',
    dueDate: '2026-11-01',
    dueTime: '11:00',
    isToday: false,
    timeSlot: 'morning',
    subtasks: [
      { id: 'sub-14', title: 'Extract recurring friction points in onboarding', completed: true },
      { id: 'sub-15', title: 'Draft memo for weekly architecture review', completed: false }
    ],
    estimatedPoms: 3,
    completedPoms: 2,
    createdAt: '2026-10-29T14:00:00Z',
    tags: ['strategy', 'research']
  },
  {
    id: 'task-7',
    title: 'Build weekly capacity and time-blocking planner view',
    description: 'Display 7-day schedule with visual hours allocated against max daily bandwidth to prevent burnout.',
    status: 'backlog',
    priority: 'medium',
    projectId: 'proj-1',
    dueDate: '2026-11-02',
    dueTime: '15:00',
    isToday: false,
    subtasks: [
      { id: 'sub-16', title: 'Calculate daily sum of estimated focus blocks', completed: false },
      { id: 'sub-17', title: 'Drag or click to reassign day slots', completed: false }
    ],
    estimatedPoms: 3,
    completedPoms: 0,
    createdAt: '2026-10-30T16:00:00Z',
    tags: ['planning', 'calendar']
  },
  {
    id: 'task-8',
    title: 'Read 20 pages of "Deep Work" by Cal Newport',
    description: 'Evening intellectual replenishment and ritual journaling before wind-down.',
    status: 'backlog',
    priority: 'low',
    projectId: 'proj-4',
    dueDate: '2026-10-31',
    dueTime: '21:00',
    isToday: true,
    timeSlot: 'evening',
    subtasks: [],
    estimatedPoms: 1,
    completedPoms: 0,
    createdAt: '2026-10-31T07:30:00Z',
    tags: ['mindfulness', 'reading']
  }
];
