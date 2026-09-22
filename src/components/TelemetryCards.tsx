'use client';

import React from 'react';
import { FieldData, WeatherData } from '@/types/irrigation';
import {
  Droplet,
  Thermometer,
  CloudRain,
  Wind,
  Sprout,
  MapPin,
} from 'lucide-react';

interface TelemetryCardsProps {
  field: FieldData;
  weather?: WeatherData | null;
}

export function TelemetryCards({ field, weather }: TelemetryCardsProps) {
  // Soil moisture classification
  const moisture = field.currentMoisturePercent;
  let moistureClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  let moistureLabel = 'Optimal Buffer';

  if (moisture <= 20) {
    moistureClass = 'text-red-400 bg-red-500/10 border-red-500/30';
    moistureLabel = 'Severe Deficit';
  } else if (moisture <= 30) {
    moistureClass = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    moistureLabel = 'Depleted';
  } else if (moisture >= 70) {
    moistureClass =
      field.crop === 'rice'
        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
        : 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    moistureLabel = field.crop === 'rice' ? 'Paddy Ponded' : 'Saturated';
  }

  const rainProb = weather ? weather.rainProbability : field.rainProbabilityPercent;
  const temp = weather ? weather.temperature : field.currentTempC;
  const humidity = weather ? weather.humidity : field.currentHumidityPercent;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Soil Moisture Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Soil Moisture</span>
          <Droplet className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-white">{moisture}%</span>
          <span className="text-xs text-slate-400">Volumetric</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${moistureClass}`}>
            {moistureLabel}
          </span>
          <span className="text-[11px] text-slate-400 capitalize">{field.soilType} soil</span>
        </div>
      </div>

      {/* 2. Temperature Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Ambient Temp</span>
          <Thermometer className="h-4 w-4 text-amber-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-white">{temp}°C</span>
          <span className="text-xs text-slate-400">Air / Canopy</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
          <span>{temp > 32 ? 'High Heat Stress' : 'Moderate ET'}</span>
          <span>{weather?.source === 'open-meteo' ? 'Open-Meteo' : 'Simulated'}</span>
        </div>
      </div>

      {/* 3. Humidity Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Relative Humidity</span>
          <Wind className="h-4 w-4 text-sky-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-white">{humidity}%</span>
          <span className="text-xs text-slate-400">RH</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
          <span>Vapor Pressure</span>
          <span>{humidity < 40 ? 'High Vapor Deficit' : 'Balanced'}</span>
        </div>
      </div>

      {/* 4. Rain Probability Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Precipitation Forecast</span>
          <CloudRain className="h-4 w-4 text-blue-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-white">{rainProb}%</span>
          <span className="text-xs text-slate-400">Probability</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px]">
          <span className={rainProb >= 60 ? 'text-blue-400 font-semibold' : 'text-slate-400'}>
            {rainProb >= 60 ? 'Rain Expected Soon' : 'Low Rain Signal'}
          </span>
          <span className="text-slate-400">{weather?.rainfallForecastMm ?? 0} mm</span>
        </div>
      </div>

      {/* 5. Crop & Growth Stage Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Active Crop</span>
          <Sprout className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="mt-2">
          <div className="text-lg font-bold tracking-tight text-white capitalize flex items-center gap-1.5">
            <span>{field.crop}</span>
            <span className="text-xs font-normal px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
              {field.areaHectares} ha
            </span>
          </div>
          <p className="text-xs text-slate-400 capitalize mt-0.5">Stage: {field.growthStage}</p>
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 truncate max-w-[120px]">
            <MapPin className="h-3 w-3 text-emerald-500 shrink-0" />
            {field.location}
          </span>
          <span className="capitalize">{field.soilType}</span>
        </div>
      </div>
    </div>
  );
}
