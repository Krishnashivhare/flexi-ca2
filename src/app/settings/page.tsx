'use client';

import React, { useState } from 'react';
import {
  Settings,
  Cpu,
  CheckCircle,
  Key,
  ShieldCheck,
  Code2,
} from 'lucide-react';

export default function SettingsPage() {
  const [providerType, setProviderType] = useState<'mock' | 'esp32-stub'>('mock');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Settings className="h-6 w-6 text-emerald-400" />
              System Architecture & IoT Settings
            </h1>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              Provider Abstraction
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure telemetry provider implementations, simulation variance, and AI agent model options.
          </p>
        </div>
      </div>

      {saved && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>System configuration updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Sensor Data Provider Architecture */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Cpu className="h-4 w-4 text-emerald-400" />
              SensorDataProvider Architecture (Polymorphic Pattern)
            </h3>
            <span className="text-[11px] text-slate-400">Design Pattern: Factory / Strategy</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The application defines an abstract <code className="text-emerald-400">SensorDataProvider</code> interface.
            Selection is managed cleanly via configuration rather than scattered <code className="text-amber-300">if</code> statements across UI files.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Mock Provider Card */}
            <div
              onClick={() => setProviderType('mock')}
              className={`rounded-lg border p-4 cursor-pointer transition ${
                providerType === 'mock'
                  ? 'border-emerald-500 bg-emerald-950/20 shadow-md'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-100">MockSensorProvider</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300 font-bold">
                  Active in Demo
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Generates plausible, diurnal solar cycles with bounded random walk. Provides realistic drift without needing hardware.
              </p>
            </div>

            {/* ESP32 Provider Card */}
            <div
              onClick={() => setProviderType('esp32-stub')}
              className={`rounded-lg border p-4 cursor-pointer transition ${
                providerType === 'esp32-stub'
                  ? 'border-emerald-500 bg-emerald-950/20 shadow-md'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-100">Esp32SensorProvider</span>
                <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] text-sky-300 font-bold">
                  IoT Hardware Stub
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Production-ready hardware parser stub. Specifies exact MQTT/HTTP schema for ESP32 microcontrollers with capacitive probes.
              </p>
            </div>
          </div>

          {/* Code snippet showing IoT Payload Schema */}
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
              <Code2 className="h-3.5 w-3.5 text-emerald-400" />
              ESP32 Hardware Ingestion Payload Format:
            </span>
            <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-300/90 overflow-x-auto">
{`// Expected MQTT / HTTP payload from physical ESP32 node
export interface Esp32TelemetryPayload {
  deviceId: "ESP32-NODE-AGRI-01",
  rawAnalogMoisture: 2450,       // ADC reading (0-4095)
  calibratedMoisturePercent: 36.5, // 0-100%
  dhtTempC: 29.2,                // Celsius
  dhtHumidityPercent: 52,        // RH %
  rainSensorDigital: 1,          // 1=dry, 0=wet
  batteryMillivolts: 3850        // 3.85V LiPo
}`}
            </pre>
          </div>
        </div>

        {/* AI Model & Key Configuration */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Key className="h-4 w-4 text-emerald-400" />
              Agentic Orchestration & Model Selection
            </h3>
            <span className="text-[11px] text-slate-400">Vercel AI SDK 7.0</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-lg bg-slate-900/80 p-3.5 border border-slate-800">
              <span className="text-slate-400">Inference Engine</span>
              <p className="mt-1 font-semibold text-slate-100 text-sm">Groq Llama 3.3 / Qwen (Ultra-Low Latency)</p>
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" /> Configured via .env.local
              </p>
            </div>

            <div className="rounded-lg bg-slate-900/80 p-3.5 border border-slate-800">
              <span className="text-slate-400">Meteorology API Provider</span>
              <p className="mt-1 font-semibold text-slate-100 text-sm">Open-Meteo REST API</p>
              <p className="text-[11px] text-sky-400 mt-1 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Free open access with deterministic fallback
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-950/40 hover:bg-emerald-500 transition active:scale-95"
          >
            Save Architecture Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
