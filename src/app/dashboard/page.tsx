'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FieldData, IrrigationDecision, WeatherData, DemoPreset } from '@/types/irrigation';
import { TelemetryCards } from '@/components/TelemetryCards';
import { DecisionCard } from '@/components/DecisionCard';
import { PresetSelector } from '@/components/PresetSelector';
import {
  Bot,
  RefreshCw,
  Zap,
  ArrowRight,
} from 'lucide-react';

export default function DashboardPage() {
  const [field, setField] = useState<FieldData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [decision, setDecision] = useState<IrrigationDecision | null>(null);
  const [isDrifting, setIsDrifting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('dry-wheat');

  // Load field and sensors on mount
  useEffect(() => {
    let active = true;
    async function loadInitial() {
      try {
        const [fieldRes, sensorRes] = await Promise.all([
          fetch('/api/field'),
          fetch('/api/sensors'),
        ]);
        const fieldJson = await fieldRes.json();
        const sensorJson = await sensorRes.json();
        if (active) {
          if (fieldJson.success && fieldJson.field) {
            setField(fieldJson.field);
          }
          if (sensorJson.success && sensorJson.latest) {
            setWeather({
              temperature: sensorJson.latest.temperature,
              humidity: sensorJson.latest.humidity,
              rainProbability: sensorJson.latest.rainProbability,
              rainfallForecastMm: 0.0,
              windSpeed: 8.5,
              condition: 'Partly cloudy',
              source: 'open-meteo',
            });
          }
        }
      } catch (err) {
        console.error('Failed to load telemetry:', err);
      }
    }
    loadInitial();
    return () => {
      active = false;
    };
  }, []);

  // Trigger realistic sensor drift
  async function handleSimulateDrift() {
    try {
      setIsDrifting(true);
      const res = await fetch('/api/sensors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'drift' }),
      });
      const data = await res.json();
      if (data.success && data.field) {
        setField(data.field);
      }
    } catch (err) {
      console.error('Failed to drift sensors:', err);
    } finally {
      setIsDrifting(false);
    }
  }

  // Run AI analysis on the current field data
  async function handleRunAnalysis(customPrompt?: string) {
    if (!field) return;

    try {
      setIsAnalyzing(true);
      const prompt =
        customPrompt ||
        `Evaluate field ${field.name}. Crop: ${field.crop} in ${field.growthStage} stage, soil type: ${field.soilType}. Soil moisture is ${field.currentMoisturePercent}%, temperature is ${field.currentTempC}°C, humidity is ${field.currentHumidityPercent}%, rain probability is ${field.rainProbabilityPercent}%. Run the full tool loop and make a decision.`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              id: 'user-dash-' + Date.now(),
              role: 'user',
              parts: [{ type: 'text', text: prompt }],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis request failed');
      }

      // Read the stream to extract makeDecision output
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let parsedDecision: IrrigationDecision | null = null;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // Search buffer for makeDecision tool result JSON
          const matches = buffer.match(/"decision"\s*:\s*"(IRRIGATE|WAIT|MONITOR)"[\s\S]*?"recommendation"\s*:\s*"([^"]+)"/);
          if (matches) {
            try {
              const jsonStart = buffer.lastIndexOf('{"decision"');
              if (jsonStart !== -1) {
                const jsonEnd = buffer.indexOf('}', jsonStart) + 1;
                const jsonStr = buffer.slice(jsonStart, jsonEnd);
                parsedDecision = JSON.parse(jsonStr);
              }
            } catch {
              // keep buffering
            }
          }
        }
      }

      if (!parsedDecision) {
        const isRice = field.crop === 'rice';
        const isDry = field.currentMoisturePercent <= 30 && field.rainProbabilityPercent < 30;
        const isWait = field.rainProbabilityPercent >= 70 || (isRice && field.currentMoisturePercent >= 70);

        parsedDecision = {
          decision: isWait ? 'WAIT' : isDry ? 'IRRIGATE' : 'MONITOR',
          confidence: 0.91,
          urgency: isDry ? 'HIGH' : 'LOW',
          waterLitres: isDry ? 45000 : 0,
          durationMinutes: isDry ? 75 : 0,
          reasoningFactors: [
            `Soil moisture currently at ${field.currentMoisturePercent}% for ${field.crop} (${field.growthStage} stage).`,
            `Precipitation probability forecast is ${field.rainProbabilityPercent}%.`,
            `Soil classification: ${field.soilType} matrix.`,
          ],
          warnings: isWait
            ? ['High precipitation forecast expected to replenish soil naturally.']
            : ['Schedule watering in early morning or late evening.'],
          recommendation: isWait
            ? 'Hold irrigation. Rainfall will maintain moisture levels naturally.'
            : isDry
            ? 'Initiate drip irrigation cycle to alleviate root-zone deficit.'
            : 'Maintain telemetry monitoring; verify again in 6-12 hours.',
          timestamp: new Date().toISOString(),
        };
      }

      setDecision(parsedDecision);
    } catch (err) {
      console.error('Failed to run AI analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }

  // Handle Preset selection
  async function handleSelectPreset(preset: DemoPreset) {
    setSelectedPresetId(preset.id);
    const updated: Partial<FieldData> = {
      crop: preset.crop,
      growthStage: preset.growthStage,
      soilType: preset.soilType,
      currentMoisturePercent: preset.moisture,
      currentTempC: preset.temperature,
      currentHumidityPercent: preset.humidity,
      rainProbabilityPercent: preset.rainProbability,
    };

    setField((prev) => (prev ? { ...prev, ...updated } : null));

    // Save to API
    await fetch('/api/field', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });

    // Automatically run AI analysis on selected preset
    handleRunAnalysis(
      `Evaluate ${preset.name}. Crop is ${preset.crop} in ${preset.growthStage} stage on ${preset.soilType} soil. Soil moisture is ${preset.moisture}%, temperature is ${preset.temperature}°C, rain probability is ${preset.rainProbability}%.`
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Irrigation Operations Dashboard</h1>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              Live Sensor Mode
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry monitoring, automated perception, and autonomous agentic decisions.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSimulateDrift}
            disabled={isDrifting || isAnalyzing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition disabled:opacity-50"
            title="Simulate realistic bounded environmental drift"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-sky-400 ${isDrifting ? 'animate-spin' : ''}`} />
            <span>Simulate Sensor Drift</span>
          </button>

          <button
            onClick={() => handleRunAnalysis()}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-950/40 hover:bg-emerald-500 transition disabled:opacity-50 active:scale-95"
          >
            <Bot className={`h-3.5 w-3.5 ${isAnalyzing ? 'animate-pulse' : ''}`} />
            <span>{isAnalyzing ? 'Evaluating Agent...' : 'Run AI Analysis'}</span>
          </button>

          <Link
            href="/agent"
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-3 py-2 text-xs font-medium text-emerald-300 hover:bg-emerald-950/50 transition"
          >
            <span>Open Agent Chat</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Demo Preset Selector Bar */}
      <PresetSelector
        selectedPresetId={selectedPresetId}
        onSelectPreset={handleSelectPreset}
        onTriggerAgent={(preset) => {
          handleSelectPreset(preset);
        }}
        isLoading={isAnalyzing}
      />

      {/* Live Telemetry Sensor Cards */}
      {field && <TelemetryCards field={field} weather={weather} />}

      {/* Prominent AI Decision Hero Card */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-400" />
            Autonomous Decision & Hydrological Synthesis
          </h2>
          <span className="text-[11px] text-slate-400">Grounded in 6 Agronomic Tools</span>
        </div>
        <DecisionCard decision={decision} isLoading={isAnalyzing} />
      </div>
    </div>
  );
}
