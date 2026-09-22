'use client';

import React from 'react';
import { IrrigationDecision } from '@/types/irrigation';
import {
  Droplets,
  Clock,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  Hourglass,
  Lightbulb,
  ShieldAlert,
} from 'lucide-react';

interface DecisionCardProps {
  decision: IrrigationDecision | null;
  isLoading?: boolean;
}

export function DecisionCard({ decision, isLoading = false }: DecisionCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-emerald-500/20 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm animate-pulse">
        <div className="h-6 w-48 bg-slate-800 rounded mb-4" />
        <div className="h-16 w-full bg-slate-800/60 rounded-lg mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div className="h-16 bg-slate-800/40 rounded" />
          <div className="h-16 bg-slate-800/40 rounded" />
          <div className="h-16 bg-slate-800/40 rounded" />
          <div className="h-16 bg-slate-800/40 rounded" />
        </div>
        <div className="h-24 bg-slate-800/30 rounded" />
      </div>
    );
  }

  if (!decision) {
    return (
      <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400 mb-3">
          <Gauge className="h-6 w-6" />
        </div>
        <h3 className="text-base font-medium text-slate-200">No Decision Evaluated Yet</h3>
        <p className="mt-1 text-sm text-slate-400 max-w-md mx-auto">
          Trigger the Agentic AI evaluation or choose a Demo Preset to run the multi-step perception-reasoning loop.
        </p>
      </div>
    );
  }

  const isIrrigate = decision.decision === 'IRRIGATE';
  const isWait = decision.decision === 'WAIT';
  const isMonitor = decision.decision === 'MONITOR';

  const badgeColor = isIrrigate
    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-emerald-950/50'
    : isWait
    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-950/50'
    : 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-sky-950/50';

  const urgencyColor =
    decision.urgency === 'CRITICAL'
      ? 'text-red-400 bg-red-950/40 border-red-500/40'
      : decision.urgency === 'HIGH'
      ? 'text-amber-400 bg-amber-950/40 border-amber-500/40'
      : decision.urgency === 'MEDIUM'
      ? 'text-blue-400 bg-blue-950/40 border-blue-500/40'
      : 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 p-6 shadow-2xl backdrop-blur-md">
      {/* Decorative ambient glow */}
      <div
        className={`absolute -top-24 -right-24 h-56 w-56 rounded-full blur-3xl pointer-events-none opacity-20 ${
          isIrrigate ? 'bg-emerald-500' : isWait ? 'bg-amber-500' : 'bg-sky-500'
        }`}
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Agentic AI Recommendation
          </span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold shadow-md ${badgeColor}`}>
            {isIrrigate && <Droplets className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />}
            {isWait && <Hourglass className="h-3.5 w-3.5 text-amber-400" />}
            {isMonitor && <CheckCircle2 className="h-3.5 w-3.5 text-sky-400" />}
            {decision.decision}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Evaluated:</span>
          <span className="font-mono text-slate-300">
            {new Date(decision.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Recommended Water */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
            <Droplets className="h-4 w-4 text-emerald-400" />
            <span>Water Volume</span>
          </div>
          <div className="mt-1.5 text-xl font-bold text-slate-100 tracking-tight">
            {decision.waterLitres > 0 ? (
              <span>
                {decision.waterLitres.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400">Litres</span>
              </span>
            ) : (
              <span className="text-slate-400 font-normal text-base">0 L (Paused)</span>
            )}
          </div>
        </div>

        {/* Duration */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
            <Clock className="h-4 w-4 text-sky-400" />
            <span>Pump Duration</span>
          </div>
          <div className="mt-1.5 text-xl font-bold text-slate-100 tracking-tight">
            {decision.durationMinutes > 0 ? (
              <span>
                {decision.durationMinutes}{' '}
                <span className="text-xs font-normal text-slate-400">mins</span>
              </span>
            ) : (
              <span className="text-slate-400 font-normal text-base">0 mins</span>
            )}
          </div>
        </div>

        {/* Urgency */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
            <ShieldAlert className="h-4 w-4 text-amber-400" />
            <span>Urgency</span>
          </div>
          <div className="mt-1.5">
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border ${urgencyColor}`}>
              {decision.urgency}
            </span>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
            <Gauge className="h-4 w-4 text-purple-400" />
            <span>Tool Agreement</span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-100">
              {Math.round(decision.confidence * 100)}%
            </span>
            <span className="text-[10px] text-slate-400">Confidence</span>
          </div>
        </div>
      </div>

      {/* Operational Recommendation Banner */}
      <div className="mt-5 rounded-lg border border-emerald-500/20 bg-emerald-950/15 p-4 text-sm text-emerald-200">
        <div className="flex items-start gap-2.5">
          <Lightbulb className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-emerald-300">Action Plan: </span>
            <span>{decision.recommendation}</span>
          </div>
        </div>
      </div>

      {/* Decision Factors & Grounded Observations */}
      {decision.reasoningFactors && decision.reasoningFactors.length > 0 && (
        <div className="mt-5">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Observable Decision Factors (Grounded Tool Outputs)
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {decision.reasoningFactors.map((factor, index) => (
              <li key={index} className="flex items-start gap-2 rounded bg-slate-950/40 p-2 border border-slate-800/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                <span className="leading-relaxed">{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings & Alerts */}
      {decision.warnings && decision.warnings.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            Agronomic Cautions
          </h4>
          <ul className="space-y-1.5 text-xs text-amber-200/90">
            {decision.warnings.map((warning, index) => (
              <li key={index} className="flex items-start gap-2 rounded bg-amber-950/20 p-2 border border-amber-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Required Academic Prototype Disclaimer */}
      <div className="mt-5 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 italic">
        * Irrigation recommendations are generated by an academic AI prototype and should be validated against local agronomic conditions before real-world use.
      </div>
    </div>
  );
}
