import React, { useState, useEffect, useRef } from 'react';
import { Task, Project, FlowSessionSettings } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  CloudRain,
  Wind,
  Waves,
  Radio,
  CheckCircle2,
  CheckSquare,
} from 'lucide-react';
import { ambientSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface FlowSessionViewProps {
  tasks: Task[];
  projects: Project[];
  activeTask: Task | null;
  onSelectActiveTask: (task: Task | null) => void;
  onToggleComplete: (taskId: string) => void;
  onIncrementPom: (taskId: string) => void;
  settings: FlowSessionSettings;
  onUpdateSettings: (settings: FlowSessionSettings) => void;
}

export const FlowSessionView: React.FC<FlowSessionViewProps> = ({
  tasks,
  projects,
  activeTask,
  onSelectActiveTask,
  onToggleComplete,
  onIncrementPom,
  settings,
  onUpdateSettings,
}) => {
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(settings.focusDurationMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [ambientType, setAmbientType] = useState<FlowSessionSettings['soundType']>(settings.soundType);
  const [volume, setVolume] = useState<number>(settings.volume);
  const [completedSessionsToday, setCompletedSessionsToday] = useState<number>(3);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getDurationForMode = (m: 'focus' | 'shortBreak' | 'longBreak') => {
    switch (m) {
      case 'focus':
        return settings.focusDurationMinutes * 60;
      case 'shortBreak':
        return settings.shortBreakMinutes * 60;
      case 'longBreak':
        return settings.longBreakMinutes * 60;
    }
  };

  const switchMode = (newMode: 'focus' | 'shortBreak' | 'longBreak') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(getDurationForMode(newMode));
  };

  // Timer Tick Effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);

            // Flow complete!
            try {
              confetti({
                particleCount: 40,
                spread: 60,
                origin: { y: 0.6 },
                colors: ['#4f46e5', '#059669', '#82f5c1'],
              });
            } catch {
              // ignore
            }

            if (mode === 'focus') {
              setCompletedSessionsToday((c) => c + 1);
              if (activeTask) {
                onIncrementPom(activeTask.id);
              }
              switchMode('shortBreak');
            } else {
              switchMode('focus');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, activeTask]);

  // Audio effect management
  const handleToggleSound = (type: FlowSessionSettings['soundType']) => {
    if (ambientType === type && ambientSound.getStatus().isPlaying) {
      ambientSound.stop();
      setAmbientType('none');
      onUpdateSettings({ ...settings, soundType: 'none' });
    } else {
      ambientSound.play(type as 'rain' | 'whitenoise' | 'waves' | 'breeze', volume);
      setAmbientType(type);
      onUpdateSettings({ ...settings, soundType: type });
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    ambientSound.setVolume(newVol);
    onUpdateSettings({ ...settings, volume: newVol });
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getDurationForMode(mode));
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const availableTasks = tasks.filter((t) => t.status !== 'done');
  const activeProject = activeTask ? projects.find((p) => p.id === activeTask.projectId) : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 space-y-8 flex flex-col items-center text-center">
      {/* Session Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#18181b]">
          Ambient Flow Session
        </h1>
        <p className="text-[13px] text-[#71717a] mt-1">
          Distraction-free focus timer backed by organic synthesized acoustic noise.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#f4f4f5] rounded-lg border border-[#e4e4e7]">
        <button
          type="button"
          onClick={() => switchMode('focus')}
          className={`px-4 py-1.5 text-[12px] font-medium rounded transition-all whitespace-nowrap ${
            mode === 'focus'
              ? 'bg-white text-[#18181b] shadow-sm'
              : 'text-[#71717a] hover:text-[#18181b]'
          }`}
        >
          Flow ({settings.focusDurationMinutes}m)
        </button>
        <button
          type="button"
          onClick={() => switchMode('shortBreak')}
          className={`px-4 py-1.5 text-[12px] font-medium rounded transition-all whitespace-nowrap ${
            mode === 'shortBreak'
              ? 'bg-white text-[#18181b] shadow-sm'
              : 'text-[#71717a] hover:text-[#18181b]'
          }`}
        >
          Short Break ({settings.shortBreakMinutes}m)
        </button>
        <button
          type="button"
          onClick={() => switchMode('longBreak')}
          className={`px-4 py-1.5 text-[12px] font-medium rounded transition-all whitespace-nowrap ${
            mode === 'longBreak'
              ? 'bg-white text-[#18181b] shadow-sm'
              : 'text-[#71717a] hover:text-[#18181b]'
          }`}
        >
          Rest ({settings.longBreakMinutes}m)
        </button>
      </div>

      {/* Main Timer Display */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex flex-col items-center justify-center bg-white border border-[#e4e4e7] rounded-full shadow-lvl-2">
        {/* Subtle circular indicator */}
        <div className="text-[64px] sm:text-[76px] font-mono font-medium tracking-tight text-[#18181b] tabular-nums select-none">
          {formattedTime}
        </div>
        <div className="text-[12px] font-medium tracking-wider uppercase text-[#71717a] mt-1">
          {mode === 'focus' ? 'Deep Focus' : 'Mindful Rest'}
        </div>

        {/* Controls inside timer */}
        <div className="flex items-center gap-3 mt-4">
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isRunning
                ? 'bg-[#18181b] text-white hover:bg-[#27272a]'
                : 'bg-[#4f46e5] text-white hover:bg-[#4338ca] shadow-md'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
          <button
            type="button"
            onClick={resetTimer}
            title="Reset timer"
            className="w-10 h-10 rounded-full bg-[#f4f4f5] hover:bg-[#e4e4e7] text-[#71717a] hover:text-[#18181b] flex items-center justify-center transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Linked Task Card */}
      <div className="w-full max-w-md bg-white border border-[#e4e4e7] rounded-lg p-4 text-left shadow-lvl-1 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider uppercase text-[#71717a]">
          <span>Current Focus Object</span>
          {activeTask && (
            <span className="font-mono text-[11px] tabular-nums text-[#059669]">
              {activeTask.completedPoms}/{activeTask.estimatedPoms} pomodoros
            </span>
          )}
        </div>

        {activeTask ? (
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="min-w-0">
              <h4 className="text-[14px] font-medium text-[#18181b] truncate">
                {activeTask.title}
              </h4>
              <div className="flex items-center gap-2 mt-0.5 text-[12px] text-[#71717a]">
                {activeProject && (
                  <span className="flex items-center gap-1">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: activeProject.color }}
                    />
                    <span>{activeProject.name}</span>
                  </span>
                )}
                <span>·</span>
                <span className="capitalize">{activeTask.priority} priority</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onToggleComplete(activeTask.id)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[#059669] bg-[#ecfdf5] hover:bg-[#d1fae5] border border-[#059669]/20 px-2.5 py-1 rounded transition-colors"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Complete</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectActiveTask(null)}
                className="text-[11px] text-[#71717a] hover:text-[#18181b] px-1 py-1"
              >
                Change
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-1 flex items-center justify-between gap-3">
            <select
              onChange={(e) => {
                const found = availableTasks.find((t) => t.id === e.target.value);
                if (found) onSelectActiveTask(found);
              }}
              defaultValue=""
              aria-label="Select task to focus on"
              className="w-full text-[13px] bg-[#f4f4f5] border border-[#e4e4e7] rounded px-3 py-1.5 outline-none cursor-pointer"
            >
              <option value="" disabled>
                Select a task to focus on...
              </option>
              {availableTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.priority})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Synthesized Ambient Soundscapes */}
      <div className="w-full max-w-md bg-white border border-[#e4e4e7] rounded-lg p-4 text-left shadow-lvl-1 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-[#71717a]">
            Procedural Ambient Soundscape
          </span>
          <span className="text-[11px] font-mono text-[#a1a1aa]">Web Audio Synthesis</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'rain', label: 'Rain', icon: CloudRain },
            { id: 'waves', label: 'Waves', icon: Waves },
            { id: 'breeze', label: 'Breeze', icon: Wind },
            { id: 'whitenoise', label: 'Hum', icon: Radio },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = ambientType === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleToggleSound(item.id as FlowSessionSettings['soundType'])}
                className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-1 rounded border transition-all ${
                  isSelected
                    ? 'bg-[#eeedf7] text-[#3525cd] border-[#4f46e5]/40 font-medium'
                    : 'bg-[#fafafa] text-[#71717a] hover:text-[#18181b] border-[#e4e4e7] hover:border-[#d4d4d8]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[11px]">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-3 pt-1">
          <Volume2 className="w-4 h-4 text-[#71717a] shrink-0" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            aria-label="Ambient volume"
            className="w-full accent-[#4f46e5] h-1.5 bg-[#e4e4e7] rounded-lg cursor-pointer"
          />
          <span className="text-[11px] font-mono tabular-nums text-[#71717a] w-8 text-right shrink-0">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      {/* Accomplishment Metrics */}
      <div className="flex items-center gap-6 text-[12px] font-mono tabular-nums text-[#71717a]">
        <span>{completedSessionsToday} flow blocks completed today</span>
        <span>·</span>
        <span>{completedSessionsToday * 25} minutes focused</span>
      </div>
    </div>
  );
};
