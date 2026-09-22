'use client';

import React, { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { AgentTimeline, ToolExecutionRecord } from '@/components/AgentTimeline';
import { DecisionCard } from '@/components/DecisionCard';
import { PresetSelector } from '@/components/PresetSelector';
import { DemoPreset, IrrigationDecision } from '@/types/irrigation';
import {
  Bot,
  Send,
  RotateCcw,
  Terminal,
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'Should I irrigate my wheat field today?',
  'What happens if it rains tomorrow?',
  'Which crop needs the most water?',
  'Evaluate rice field with 75% moisture and 85% rain forecast.',
];

export default function AgentPage() {
  const [inputVal, setInputVal] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('dry-wheat');
  const [lastStructuredDecision, setLastStructuredDecision] = useState<IrrigationDecision | null>(null);

  const { messages, sendMessage, status, setMessages } = useChat();

  const isGenerating = status === 'submitted' || status === 'streaming';

  // Extract tool records from the latest assistant message parts
  const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
  const toolRecords: ToolExecutionRecord[] = [];

  if (lastAssistantMessage && lastAssistantMessage.parts) {
    for (const part of lastAssistantMessage.parts) {
      const partRecord = part as Record<string, unknown>;
      const partType = typeof partRecord.type === 'string' ? partRecord.type : '';

      // Check tool invocation parts
      if (partType.startsWith('tool-') || partType === 'dynamic-tool') {
        const toolName = (partRecord.toolName as string) || partType.replace(/^tool-/, '');
        const toolCallId = (partRecord.toolCallId as string) || 'tool-' + toolRecords.length;
        const isCompleted = partRecord.state === 'output-available' || Boolean(partRecord.output);

        toolRecords.push({
          id: toolCallId,
          name: toolName,
          state: isCompleted ? 'completed' : 'calling',
          input: partRecord.input as Record<string, unknown> | undefined,
          output: partRecord.output as Record<string, unknown> | undefined,
        });

        // If this is makeDecision output, store structured decision
        if (toolName === 'makeDecision' && partRecord.output && !lastStructuredDecision) {
          setLastStructuredDecision(partRecord.output as unknown as IrrigationDecision);
        }
      } else if (partType === 'tool-call') {
        toolRecords.push({
          id: (partRecord.toolCallId as string) || 'tool-' + toolRecords.length,
          name: partRecord.toolName as string,
          state: 'calling',
          input: partRecord.input as Record<string, unknown> | undefined,
        });
      } else if (partType === 'tool-result') {
        const existing = toolRecords.find(t => t.name === partRecord.toolName);
        if (existing) {
          existing.state = 'completed';
          existing.output = partRecord.output as Record<string, unknown> | undefined;
        } else {
          toolRecords.push({
            id: (partRecord.toolCallId as string) || 'tool-' + toolRecords.length,
            name: partRecord.toolName as string,
            state: 'completed',
            output: partRecord.output as Record<string, unknown> | undefined,
          });
        }

        if (partRecord.toolName === 'makeDecision' && partRecord.output) {
          setLastStructuredDecision(partRecord.output as unknown as IrrigationDecision);
        }
      }
    }
  }

  // Handle message submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isGenerating) return;

    setLastStructuredDecision(null);
    sendMessage({ text: inputVal });
    setInputVal('');
  };

  // Handle Preset selection & execution
  const handlePresetTrigger = (preset: DemoPreset) => {
    setSelectedPresetId(preset.id);
    setLastStructuredDecision(null);
    const prompt = `Academic Scenario: ${preset.name}. The field has ${preset.crop} in ${preset.growthStage} stage on ${preset.soilType} soil. Current soil moisture is ${preset.moisture}%, ambient temperature is ${preset.temperature}°C, humidity is ${preset.humidity}%, rain probability is ${preset.rainProbability}%, and days since last irrigation is ${preset.daysSinceLastIrrigation}. Autonomously execute your full tool-calling cycle to evaluate whether to IRRIGATE, WAIT, or MONITOR.`;
    sendMessage({ text: prompt });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Bot className="h-6 w-6 text-emerald-400" />
              Autonomous AI Decision Agent
            </h1>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              Multi-Step Tool Calling
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Genuinely autonomous agent with dynamic tool sequence selection, multi-factor reconciliation, and real-time streaming.
          </p>
        </div>

        {messages.length > 0 && (
          <button
            onClick={() => {
              setMessages([]);
              setLastStructuredDecision(null);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Session</span>
          </button>
        )}
      </div>

      {/* Demo Preset Bar for Instant 1-Click Verification */}
      <PresetSelector
        selectedPresetId={selectedPresetId}
        onSelectPreset={(p) => setSelectedPresetId(p.id)}
        onTriggerAgent={handlePresetTrigger}
        isLoading={isGenerating}
      />

      {/* Main Grid: Chat Conversation + Live Perception/Tool Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Chat Conversation Stream (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-800 bg-slate-950/60 shadow-xl backdrop-blur-md overflow-hidden min-h-[500px]">
          {/* Chat Header */}
          <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <span>Agent Conversation & Reasoning Stream</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">maxSteps: 10</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[550px]">
            {messages.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Bot className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-200">
                  Automated Irrigation Decision Agent Ready
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Ask a field irrigation question or click any Demo Preset above. The agent will autonomously
                  perceive the environment, invoke tools across multiple steps, reconcile conflicting signals,
                  and formulate an evidence-backed decision.
                </p>

                {/* Suggested prompts */}
                <div className="pt-4 flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                  {SUGGESTED_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInputVal(prompt);
                        sendMessage({ text: prompt });
                      }}
                      className="text-left rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 hover:border-emerald-500/40 hover:bg-emerald-950/20 transition"
                    >
                      &ldquo;{prompt}&rdquo;
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => {
                const isUser = message.role === 'user';
                const textContent =
                  message.parts
                    ?.filter(p => p.type === 'text')
                    .map(p => (p as { text: string }).text)
                    .join('\n') || '';

                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}

                    <div
                      className={`rounded-xl p-4 text-xs max-w-[85%] leading-relaxed ${
                        isUser
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-900 border border-slate-800 text-slate-200'
                      }`}
                    >
                      {textContent ? (
                        <div className="whitespace-pre-line space-y-2">{textContent}</div>
                      ) : (
                        <div className="text-slate-400 italic">Thinking and calling tools...</div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {isGenerating && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 pt-2 animate-pulse">
                <Bot className="h-4 w-4 animate-spin" />
                <span>Agent is reasoning and executing domain tools...</span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleFormSubmit} className="p-3 border-t border-slate-800 bg-slate-900/70">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask about wheat irrigation, soil deficit, rainfall effects..."
                disabled={isGenerating}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isGenerating}
                className="rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 transition disabled:opacity-40 flex items-center gap-1.5"
              >
                <span>Send</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Tool Activity Timeline + Structured Decision Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Live Tool Execution Activity */}
          <AgentTimeline toolRecords={toolRecords} isStreaming={isGenerating} />

          {/* Structured Decision Card */}
          {lastStructuredDecision ? (
            <DecisionCard decision={lastStructuredDecision} isLoading={false} />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-6 text-center text-xs text-slate-400">
              <p>Decision synthesis card will appear here once the agent completes the tool invocation cycle.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
