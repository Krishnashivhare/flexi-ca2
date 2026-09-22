'use client';

import React, { useEffect, useState } from 'react';
import { IrrigationRecord } from '@/types/irrigation';
import {
  History,
  Droplets,
  Filter,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

export default function HistoryPage() {
  const [records, setRecords] = useState<IrrigationRecord[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [selectedDecision, setSelectedDecision] = useState<string>('all');

  useEffect(() => {
    fetch('/api/history')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.records) {
          setRecords(data.records);
        }
      })
      .catch((err) => console.error('Failed to load history:', err));
  }, []);

  const filteredRecords = records.filter((r) => {
    const cropMatches = selectedCrop === 'all' || r.crop.toLowerCase() === selectedCrop.toLowerCase();
    const decisionMatches = selectedDecision === 'all' || r.decision === selectedDecision;
    return cropMatches && decisionMatches;
  });

  // Prepare chart data
  const chartData = [...records].reverse().map((r) => ({
    date: new Date(r.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    waterLitres: r.waterLitres,
    soilMoisture: r.soilMoisture,
    duration: r.durationMinutes,
    crop: r.crop,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <History className="h-6 w-6 text-emerald-400" />
              Irrigation History & Audit Logs
            </h1>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              Audit Trail
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Historical log of past irrigation actions, pump durations, and water volumes used to prevent over-watering.
          </p>
        </div>
      </div>

      {/* Recharts Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Water Volume Applied Over Time */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Droplets className="h-4 w-4 text-emerald-400" />
              Water Volume Consumption (Litres)
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Past Irrigation Events</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(value) => [`${Number(value || 0).toLocaleString()} L`, 'Water Applied']}
                />
                <Bar dataKey="waterLitres" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Soil Moisture Depletion Trend */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-sky-400" />
              Soil Moisture at Trigger Point (%)
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Pre-Irrigation Volumetric %</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[15, 85]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(value) => [`${value}%`, 'Moisture Before']}
                />
                <Line type="monotone" dataKey="soilMoisture" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 4, fill: '#0284c7' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filterable Table Section */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/70 shadow-xl overflow-hidden backdrop-blur-md">
        {/* Table Filters Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Filter className="h-4 w-4 text-emerald-400" />
            <span>Filter Event Logs ({filteredRecords.length} Results)</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Crop filter */}
            <div className="flex items-center gap-1.5">
              <label className="text-slate-400">Crop:</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-slate-200 text-xs focus:border-emerald-500 focus:outline-none capitalize"
              >
                <option value="all">All Crops</option>
                <option value="wheat">Wheat</option>
                <option value="rice">Rice</option>
                <option value="tomato">Tomato</option>
                <option value="cotton">Cotton</option>
              </select>
            </div>

            {/* Decision filter */}
            <div className="flex items-center gap-1.5">
              <label className="text-slate-400">Decision:</label>
              <select
                value={selectedDecision}
                onChange={(e) => setSelectedDecision(e.target.value)}
                className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
              >
                <option value="all">All Decisions</option>
                <option value="IRRIGATE">IRRIGATE</option>
                <option value="WAIT">WAIT</option>
                <option value="MONITOR">MONITOR</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Event ID</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Crop</th>
                <th className="px-4 py-3">Pre-Moisture</th>
                <th className="px-4 py-3">Agent Decision</th>
                <th className="px-4 py-3">Water Applied</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Trigger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400 font-sans">
                    No matching irrigation events found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
                  const badgeColor =
                    r.decision === 'IRRIGATE'
                      ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30'
                      : r.decision === 'WAIT'
                      ? 'text-amber-400 bg-amber-950/60 border-amber-500/30'
                      : 'text-sky-400 bg-sky-950/60 border-sky-500/30';

                  return (
                    <tr key={r.id} className="hover:bg-slate-900/40 transition">
                      <td className="px-4 py-3 text-slate-400">{r.id}</td>
                      <td className="px-4 py-3 text-slate-200">
                        {new Date(r.date).toLocaleDateString([], {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3 capitalize font-sans text-slate-100">{r.crop}</td>
                      <td className="px-4 py-3">{r.soilMoisture}%</td>
                      <td className="px-4 py-3 font-sans">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${badgeColor}`}>
                          {r.decision}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-100">
                        {r.waterLitres > 0 ? `${r.waterLitres.toLocaleString()} L` : '0 L'}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {r.durationMinutes > 0 ? `${r.durationMinutes} min` : '0 min'}
                      </td>
                      <td className="px-4 py-3 font-sans capitalize text-slate-400 text-[11px]">
                        {r.triggerSource}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
