'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Droplets,
  TrendingUp,
  CloudSun,
  Info,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { SensorReading } from '@/types/irrigation';

export default function AnalyticsPage() {
  const [historyReadings, setHistoryReadings] = useState<SensorReading[]>([]);

  useEffect(() => {
    fetch('/api/sensors')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.history) {
          setHistoryReadings(data.history);
        }
      })
      .catch((err) => console.error('Failed to load sensor analytics:', err));
  }, []);

  // Format 24-hour readings
  const formattedReadings = historyReadings.map((r) => {
    const time = new Date(r.timestamp);
    return {
      hour: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      soilMoisture: r.soilMoisture,
      temperature: r.temperature,
      humidity: r.humidity,
      rainProbability: r.rainProbability,
    };
  });

  // Water savings comparison data (Naive Threshold vs Agentic AI)
  const savingsData = [
    { week: 'Week 1', naiveThresholdLitres: 120000, agenticAILitres: 85000, waterSaved: 35000 },
    { week: 'Week 2', naiveThresholdLitres: 140000, agenticAILitres: 95000, waterSaved: 45000 },
    { week: 'Week 3', naiveThresholdLitres: 110000, agenticAILitres: 70000, waterSaved: 40000 },
    { week: 'Week 4', naiveThresholdLitres: 160000, agenticAILitres: 105000, waterSaved: 55000 },
  ];

  const totalSaved = savingsData.reduce((acc, curr) => acc + curr.waterSaved, 0);
  const totalNaive = savingsData.reduce((acc, curr) => acc + curr.naiveThresholdLitres, 0);
  const percentSaved = Math.round((totalSaved / totalNaive) * 100);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-emerald-400" />
              Hydrological Analytics & Efficiency
            </h1>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              Comparative Impact
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            24-hour telemetry drift trends, weather vs irrigation correlation, and simulated water conservation estimates.
          </p>
        </div>
      </div>

      {/* Prominent Estimated Water Saved Metric Card */}
      <div className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-emerald-400">
              <Droplets className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span>Conservation Performance Metric</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {totalSaved.toLocaleString()}{' '}
              <span className="text-xl font-normal text-emerald-300">Litres Saved</span>
              <span className="ml-3 text-lg font-bold text-emerald-400">({percentSaved}% Reduction)</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              By anticipating impending rainfall, accounting for soil percolation, and respecting crop
              phenological dormancy, the agent avoided unnecessary irrigation cycles compared to a static moisture threshold.
            </p>
          </div>

          <div className="rounded-lg border border-amber-500/30 bg-amber-950/30 p-3.5 max-w-xs text-[11px] text-amber-200 shrink-0">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300">Academic Demo Estimate:</span>
                <p className="mt-0.5 text-amber-200/90 leading-relaxed">
                  Water conservation metric is an academic simulation estimate based on seasonal model comparison for a 1.5-hectare plot.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: 24-Hour Soil Moisture Trend */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              24-Hour Soil Moisture Depletion Curve (%)
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Continuous Drift</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedReadings} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} interval={3} />
                <YAxis stroke="#64748b" fontSize={11} domain={[15, 60]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(v) => [`${v}%`, 'Moisture']}
                />
                <Area type="monotone" dataKey="soilMoisture" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#moistureGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Weather vs Irrigation Comparison (Naive vs Agentic) */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-sky-400" />
              Water Volume: Naive Threshold vs. Agentic AI
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Weekly Comparison</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={savingsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(v) => [`${Number(v || 0).toLocaleString()} L`]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="naiveThresholdLitres" name="Static Threshold (L)" fill="#64748b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="agenticAILitres" name="Agentic AI Optimized (L)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 3: Temperature vs Humidity Diurnal Cycle */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <CloudSun className="h-4 w-4 text-amber-400" />
            Canopy Microclimate: Temperature (°C) vs Relative Humidity (%)
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Diurnal Cycle</span>
        </div>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedReadings} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} interval={3} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#38bdf8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="rainProbability" name="Rain Prob (%)" stroke="#6366f1" strokeWidth={2} strokeDasharray="4 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
