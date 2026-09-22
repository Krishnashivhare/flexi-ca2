'use client';

import React, { useState } from 'react';
import {
  Loader2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CloudSun,
  Layers,
  BookOpen,
  Calculator,
  History,
  CheckSquare,
  Sparkles,
} from 'lucide-react';

export interface ToolExecutionRecord {
  id: string;
  name: string;
  state: 'calling' | 'completed' | 'error';
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
}

interface AgentTimelineProps {
  toolRecords: ToolExecutionRecord[];
  isStreaming?: boolean;
}

const TOOL_METADATA: Record<
  string,
  { label: string; description: string; icon: React.ComponentType<{ className?: string }> }
> = {
  getWeather: {
    label: 'Meteorological Perception',
    description: 'Querying Open-Meteo REST API for precipitation probability & ET conditions',
    icon: CloudSun,
  },
  analyzeSoil: {
    label: 'Soil Physics & Deficit',
    description: 'Evaluating texture percolation, permanent wilting point, and field capacity',
    icon: Layers,
  },
  getCropKnowledge: {
    label: 'Agronomic Phenology DB',
    description: 'Cross-referencing crop sensitivity and root-zone water requirements',
    icon: BookOpen,
  },
  calculateIrrigation: {
    label: 'Deterministic Hydrology Math',
    description: 'Computing exact water volume (Litres) and pump duration (minutes)',
    icon: Calculator,
  },
  getIrrigationHistory: {
    label: 'Irrigation Cycle Memory',
    description: 'Checking recent watering logs to avoid duplicate or premature irrigation',
    icon: History,
  },
  makeDecision: {
    label: 'Multi-Factor Action Synthesis',
    description: 'Reconciling conflicting signals into structured IRRIGATE / WAIT / MONITOR',
    icon: CheckSquare,
  },
};

export function AgentTimeline({ toolRecords, isStreaming = false }: AgentTimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!toolRecords || toolRecords.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Live Agentic Perception & Tool Activity ({toolRecords.length} Steps)
          </h4>
        </div>
        {isStreaming && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="font-mono text-[11px]">Reasoning loop active...</span>
          </div>
        )}
      </div>

      <div className="mt-3 space-y-2">
        {toolRecords.map((tool, idx) => {
          const meta = TOOL_METADATA[tool.name] || {
            label: tool.name,
            description: 'Custom agronomic evaluation step',
            icon: CheckSquare,
          };
          const Icon = meta.icon;
          const isCompleted = tool.state === 'completed';
          const isExpanded = expandedId === tool.id;

          return (
            <div
              key={tool.id}
              className={`rounded-lg border transition ${
                isCompleted
                  ? 'border-emerald-500/20 bg-slate-900/40'
                  : 'border-amber-500/30 bg-amber-950/10'
              }`}
            >
              {/* Header row */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : tool.id)}
                className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-slate-800/40 rounded-lg transition"
              >
                <div className="flex items-center gap-2.5">
                  {/* Status Indicator: Spinner -> Checkmark */}
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Loader2 className="h-4 w-4 text-amber-400 animate-spin" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                        <Icon className="h-3.5 w-3.5 text-emerald-400" />
                        Step {idx + 1}: {meta.label}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 rounded bg-slate-800/80 px-1 py-0.2">
                        {tool.name}()
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{meta.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-[10px] font-mono">
                    {isCompleted ? (
                      <span className="text-emerald-400">Executed</span>
                    ) : (
                      <span className="text-amber-400">Calling...</span>
                    )}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expandable input/output inspection panel */}
              {isExpanded && (
                <div className="p-3 border-t border-slate-800/60 bg-slate-950/80 text-xs font-mono space-y-2 rounded-b-lg">
                  {tool.input && (
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                        Arguments Passed by Model:
                      </span>
                      <pre className="mt-1 p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 overflow-x-auto text-[11px]">
                        {JSON.stringify(tool.input, null, 2)}
                      </pre>
                    </div>
                  )}

                  {tool.output && (
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-emerald-400 tracking-wider">
                        Deterministic Tool Return:
                      </span>
                      <pre className="mt-1 p-2 rounded bg-slate-900 border border-emerald-500/20 text-emerald-300/90 overflow-x-auto text-[11px]">
                        {JSON.stringify(tool.output, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
