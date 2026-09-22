'use client';

import React from 'react';
import { DEMO_PRESETS } from '@/lib/constants/demoPresets';
import { DemoPreset } from '@/types/irrigation';
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

interface PresetSelectorProps {
  selectedPresetId?: string;
  onSelectPreset: (preset: DemoPreset) => void;
  onTriggerAgent?: (preset: DemoPreset) => void;
  isLoading?: boolean;
}

export function PresetSelector({
  selectedPresetId,
  onSelectPreset,
  onTriggerAgent,
  isLoading = false,
}: PresetSelectorProps) {
  return (
    <div className="rounded-xl border border-emerald-500/30 bg-slate-950/70 p-5 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Academic Demo Mode Presets</h3>
            <p className="text-xs text-slate-400">Pre-tuned scenarios demonstrating multi-factor conflict reconciliation</p>
          </div>
        </div>
        <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full w-fit">
          Grading Verification Mode
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {DEMO_PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          const badgeColor =
            preset.expectedDecision === 'IRRIGATE'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : preset.expectedDecision === 'WAIT'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-sky-500/20 text-sky-300 border-sky-500/40';

          return (
            <div
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`group relative flex flex-col justify-between rounded-lg border p-3.5 cursor-pointer transition ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-950/25 shadow-lg shadow-emerald-950/40'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-100 text-sm">{preset.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                    {preset.expectedDecision}
                  </span>
                </div>

                <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>

                {/* Telemetry pill row */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-300">
                  <span className="rounded bg-slate-800/80 px-1.5 py-0.5 border border-slate-700/50">
                    💧 {preset.moisture}%
                  </span>
                  <span className="rounded bg-slate-800/80 px-1.5 py-0.5 border border-slate-700/50">
                    🌧️ {preset.rainProbability}%
                  </span>
                  <span className="rounded bg-slate-800/80 px-1.5 py-0.5 border border-slate-700/50">
                    🌡️ {preset.temperature}°C
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/70 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 group-hover:text-emerald-300 transition flex items-center gap-1">
                  {isSelected ? <CheckCircle className="h-3 w-3 text-emerald-400" /> : null}
                  {isSelected ? 'Active Preset' : 'Click to Load'}
                </span>

                {onTriggerAgent && (
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPreset(preset);
                      onTriggerAgent(preset);
                    }}
                    className="inline-flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-1 text-[11px] font-medium text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition disabled:opacity-50"
                  >
                    <span>Ask Agent</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
