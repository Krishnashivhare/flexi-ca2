'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CloudRain,
  Cpu,
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-900 bg-gradient-to-b from-emerald-950/20 via-slate-950 to-slate-950">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>B.Tech Flexi Credit Academic Capstone</span>
            <span className="h-1 w-1 rounded-full bg-emerald-400" />
            <span className="font-semibold text-white">Agentic AI Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Automated Irrigation{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
              Decision Agent
            </span>
          </h1>

          <p className="mx-auto max-w-3xl text-lg sm:text-xl text-slate-300 leading-relaxed font-normal">
            An Agentic AI system that analyzes soil, crop and weather conditions to generate intelligent
            irrigation decisions.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/50 hover:bg-emerald-500 transition active:scale-95"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/agent"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition active:scale-95"
            >
              <Bot className="h-4 w-4 text-emerald-400" />
              <span>Try AI Agent</span>
            </Link>
          </div>

          {/* Key Tech Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Multi-Step Autonomous Loop
            </span>
            <span className="flex items-center gap-1.5">
              <CloudRain className="h-4 w-4 text-sky-400" /> Live Open-Meteo Integration
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-amber-400" /> IoT-Ready (ESP32 / MQTT Stub)
            </span>
          </div>
        </div>
      </section>

      {/* 2. Why Agentic AI Beats Static if/else Thresholds */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Why Agentic AI Outperforms Static If/Else Logic
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Traditional automated irrigation relies on a single rigid threshold (e.g.{' '}
            <code className="text-amber-300">if moisture &lt; 30% then irrigate</code>). Here is why an
            autonomous agentic system is essential for real-world agronomy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Legacy If/Else Approach */}
          <div className="rounded-xl border border-red-500/20 bg-red-950/10 p-6 space-y-4">
            <div className="flex items-center gap-2 text-red-400 font-semibold text-sm">
              <XCircle className="h-5 w-5 text-red-400" />
              <span>Legacy Static Threshold Approach</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  <strong>Blind to Impending Weather:</strong> Pumps expensive water even when a heavy downpour
                  is forecasted in 2 hours, causing surface runoff and root hypoxia.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  <strong>Ignores Crop Growth Stages:</strong> Treats seedling vegetative wheat identically to
                  flowering grain-filling wheat, risking catastrophic yield loss at critical anthesis.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  <strong>Fails on Paddy Rice:</strong> Classifies normal standing paddy water (75-80%) as
                  &ldquo;over-watered&rdquo; because it lacks physiological crop domain awareness.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  <strong>No Soil Texture Context:</strong> Treats coarse sand (rapid drainage) the same as dense
                  clay (water retention), leading to under-watering sand and waterlogging clay.
                </span>
              </li>
            </ul>
          </div>

          {/* Agentic AI Approach */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <span>Multi-Step Agentic AI System</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>
                  <strong>Proactive Weather Reconciliation:</strong> Checks Open-Meteo forecasts and withholds
                  pumping (<span className="text-amber-300 font-medium">WAIT</span>) if natural rain is
                  anticipated within the replenishment window.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>
                  <strong>Agronomic Phenology Knowledge:</strong> Dynamically looks up 6 crops across 5 growth
                  stages to apply stage-sensitive moisture tolerances.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>
                  <strong>Soil Physics Calculation:</strong> Accounts for Field Capacity and Permanent Wilting
                  Point across sandy, clay, and loam soil matrices.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>
                  <strong>Irrigation Cycle Memory:</strong> Inspects past watering events to avoid repeating
                  cycles prematurely, saving pump electricity and groundwater.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Three Feature Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full border-t border-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-emerald-500/40 transition group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-4 group-hover:scale-105 transition">
              <Bot className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-semibold text-white">AI Decision Agent</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Autonomously decides which tools to invoke across up to 10 steps. Synthesizes conflicting inputs
              to reach grounded action recommendations.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-emerald-500/40 transition group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 mb-4 group-hover:scale-105 transition">
              <BrainCircuit className="h-5 w-5 text-sky-400" />
            </div>
            <h3 className="text-base font-semibold text-white">Multi-factor Analysis</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Synthesizes real-time microclimate, volumetric soil moisture deficit, crop phenological sensitivity,
              and historical water application logs.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-emerald-500/40 transition group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-4 group-hover:scale-105 transition">
              <Zap className="h-5 w-5 text-amber-400" />
            </div>
            <h3 className="text-base font-semibold text-white">Explainable Recommendations</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              No hidden black-box chains. Every recommendation features an observable &ldquo;Decision Factors&rdquo;
              breakdown showing the contribution of each agronomic variable.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Visual Agent Architecture Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase font-semibold tracking-wider text-emerald-400">
            Academic Concept Demonstration
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            The 6-Phase Agentic Workflow
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            Perception &rarr; Tool Use &rarr; Reasoning &rarr; Decision &rarr; Action Recommendation &rarr; Explanation
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              Phase 1: Perception
            </div>
            <p className="text-xs text-slate-300">
              Ingests live telemetry from MockSensorProvider or ESP32 hardware (moisture, temperature, humidity, rain probability).
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
              Phase 2: Tool Use
            </div>
            <p className="text-xs text-slate-300">
              Autonomously queries Open-Meteo, parses soil texture physics, and looks up phenology data across 6 crops and 5 stages.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
              Phase 3: Reasoning
            </div>
            <p className="text-xs text-slate-300">
              Reconciles conflicting agronomic signals (e.g. low soil moisture + high rain forecast &rarr; WAIT or MONITOR).
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              Phase 4: Decision
            </div>
            <p className="text-xs text-slate-300">
              Formulates an operational decision: IRRIGATE, WAIT, or MONITOR, with cross-tool agreement confidence rating.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-1">
              Phase 5: Action Recommendation
            </div>
            <p className="text-xs text-slate-300">
              Executes calculateIrrigation arithmetic to specify exact water volume in Litres and pump run duration in minutes.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
              Phase 6: Explanation
            </div>
            <p className="text-xs text-slate-300">
              Renders grounded Decision Factors and agronomic warnings without exposing unverified chains of thought.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
