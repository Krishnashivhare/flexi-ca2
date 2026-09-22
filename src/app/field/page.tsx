'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CropType, FieldData, GrowthStage, SoilType } from '@/types/irrigation';
import {
  SlidersHorizontal,
  Save,
  Bot,
  MapPin,
  Sprout,
  Droplet,
  CheckCircle,
} from 'lucide-react';

export default function FieldPage() {
  const router = useRouter();
  const [field, setField] = useState<FieldData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/field')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.field) {
          setField(data.field);
        }
      })
      .catch(err => console.error('Failed to load field:', err));
  }, []);

  const handleChange = <K extends keyof FieldData>(key: K, value: FieldData[K]) => {
    setField(prev => (prev ? { ...prev, [key]: value } : null));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!field) return;

    try {
      setIsSaving(true);
      const res = await fetch('/api/field', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(field),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save field settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnalyzeField = async () => {
    if (!field) return;
    await handleSave();
    router.push('/dashboard');
  };

  if (!field) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <SlidersHorizontal className="h-6 w-6 text-emerald-400" />
              Field Monitoring & Parameters
            </h1>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              Configurable Agronomic State
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Override telemetry sensors or modify crop phenology parameters to simulate field experiments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleAnalyzeField}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-950/40 hover:bg-emerald-500 transition active:scale-95"
          >
            <Bot className="h-3.5 w-3.5" />
            <span>Analyze Field & Return</span>
          </button>
        </div>
      </div>

      {/* Success Alert */}
      {saveSuccess && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>Field configuration successfully updated in telemetry memory.</span>
        </div>
      )}

      {/* Configuration Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Field Metadata */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800/80 pb-2">
            <MapPin className="h-4 w-4 text-emerald-400" />
            Field Identification & Geography
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Field Name</label>
              <input
                type="text"
                value={field.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Area (Hectares)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={field.areaHectares}
                onChange={(e) => handleChange('areaHectares', parseFloat(e.target.value))}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Location / Region</label>
              <input
                type="text"
                value={field.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Coordinates (Lat, Lon)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="0.0001"
                  value={field.latitude}
                  onChange={(e) => handleChange('latitude', parseFloat(e.target.value))}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-2 text-white text-xs"
                />
                <input
                  type="number"
                  step="0.0001"
                  value={field.longitude}
                  onChange={(e) => handleChange('longitude', parseFloat(e.target.value))}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-2 text-white text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Crop & Soil Phenology */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800/80 pb-2">
            <Sprout className="h-4 w-4 text-emerald-400" />
            Agronomic Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Active Crop Variety</label>
              <select
                value={field.crop}
                onChange={(e) => handleChange('crop', e.target.value as CropType)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none capitalize"
              >
                <option value="wheat">Wheat</option>
                <option value="rice">Rice (Paddy)</option>
                <option value="maize">Maize</option>
                <option value="cotton">Cotton</option>
                <option value="tomato">Tomato</option>
                <option value="sugarcane">Sugarcane</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Phenological Growth Stage</label>
              <select
                value={field.growthStage}
                onChange={(e) => handleChange('growthStage', e.target.value as GrowthStage)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none capitalize"
              >
                <option value="germination">Germination</option>
                <option value="vegetative">Vegetative</option>
                <option value="flowering">Flowering (Anthesis)</option>
                <option value="fruiting">Fruiting / Grain Fill</option>
                <option value="maturity">Maturity / Ripening</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Soil Texture Matrix</label>
              <select
                value={field.soilType}
                onChange={(e) => handleChange('soilType', e.target.value as SoilType)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none capitalize"
              >
                <option value="sandy">Sandy (Fast Drainage)</option>
                <option value="loam">Loam (Balanced Retention)</option>
                <option value="clay">Clay (High Retention / Low Percolation)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Telemetry Sensor Simulation Overrides */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800/80 pb-2">
            <Droplet className="h-4 w-4 text-emerald-400" />
            Sensor Telemetry Overrides (Simulation Mode)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="flex items-center justify-between text-slate-400 mb-1">
                <span>Soil Moisture (%)</span>
                <span className="font-bold text-emerald-400">{field.currentMoisturePercent}%</span>
              </label>
              <input
                type="range"
                min="5"
                max="95"
                value={field.currentMoisturePercent}
                onChange={(e) => handleChange('currentMoisturePercent', parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="flex items-center justify-between text-slate-400 mb-1">
                <span>Temperature (°C)</span>
                <span className="font-bold text-amber-400">{field.currentTempC}°C</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="5"
                max="50"
                value={field.currentTempC}
                onChange={(e) => handleChange('currentTempC', parseFloat(e.target.value))}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-white"
              />
            </div>

            <div>
              <label className="flex items-center justify-between text-slate-400 mb-1">
                <span>Relative Humidity (%)</span>
                <span className="font-bold text-sky-400">{field.currentHumidityPercent}%</span>
              </label>
              <input
                type="number"
                min="10"
                max="100"
                value={field.currentHumidityPercent}
                onChange={(e) => handleChange('currentHumidityPercent', parseInt(e.target.value, 10))}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-white"
              />
            </div>

            <div>
              <label className="flex items-center justify-between text-slate-400 mb-1">
                <span>Precipitation Forecast (%)</span>
                <span className="font-bold text-blue-400">{field.rainProbabilityPercent}%</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={field.rainProbabilityPercent}
                onChange={(e) => handleChange('rainProbabilityPercent', parseInt(e.target.value, 10))}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-white"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Configuration'}</span>
          </button>

          <button
            type="button"
            onClick={handleAnalyzeField}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-950/40 hover:bg-emerald-500 transition active:scale-95"
          >
            <Bot className="h-3.5 w-3.5" />
            <span>Analyze Field with AI</span>
          </button>
        </div>
      </form>
    </div>
  );
}
