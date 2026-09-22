'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sprout,
  Activity,
  Bot,
  SlidersHorizontal,
  History,
  BarChart3,
  Settings,
  Menu,
  X,
  Radio,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Overview', icon: Sprout },
  { href: '/dashboard', label: 'Dashboard', icon: Activity },
  { href: '/agent', label: 'AI Agent', icon: Bot },
  { href: '/field', label: 'Field Monitoring', icon: SlidersHorizontal },
  { href: '/history', label: 'Irrigation History', icon: History },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-950/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo & Academic Badge */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 group-hover:bg-emerald-500/30 transition">
            <Sprout className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-100 text-base tracking-tight group-hover:text-emerald-300 transition">
                Irrigation Agent
              </span>
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                Agentic AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400">B.Tech Flexi Credit Project</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Status Indicator & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/30 px-2.5 py-1 text-[11px] text-emerald-300">
            <Radio className="h-3 w-3 animate-pulse text-emerald-400" />
            <span>IoT Ready</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg border border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 text-emerald-400" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
