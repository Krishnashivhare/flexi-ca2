import { tool } from 'ai';
import { z } from 'zod';
import { DecisionType, IrrigationDecision, UrgencyLevel } from '@/types/irrigation';

export const makeDecisionInputSchema = z.object({
  decision: z.enum(['IRRIGATE', 'WAIT', 'MONITOR']).describe('Final irrigation action decision'),
  confidence: z.number().min(0).max(1).describe('Confidence score (0.0 to 1.0) grounded in cross-tool telemetry alignment'),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).describe('Operational urgency for irrigation activation'),
  waterLitres: z.number().min(0).describe('Calculated irrigation volume in Litres (0 if WAIT or MONITOR)'),
  durationMinutes: z.number().min(0).describe('System run duration in minutes (0 if WAIT or MONITOR)'),
  reasoningFactors: z
    .array(z.string())
    .min(1)
    .describe('List of key observable agronomic factors derived directly from tool outputs (weather, soil, crop, history)'),
  warnings: z.array(z.string()).describe('List of operational warnings or alerts (e.g. pending heavy rain, high temperature, risk of disease)'),
  recommendation: z.string().describe('Clear, actionable operational summary recommendation for the farm operator'),
});

export async function executeMakeDecision({
  decision,
  confidence,
  urgency,
  waterLitres,
  durationMinutes,
  reasoningFactors,
  warnings,
  recommendation,
}: z.infer<typeof makeDecisionInputSchema>): Promise<IrrigationDecision> {
  const finalDecision: IrrigationDecision = {
    decision: decision as DecisionType,
    confidence: Number(confidence.toFixed(2)),
    urgency: urgency as UrgencyLevel,
    waterLitres: Math.round(waterLitres),
    durationMinutes: Math.round(durationMinutes),
    reasoningFactors,
    warnings,
    recommendation,
    timestamp: new Date().toISOString(),
  };

  return finalDecision;
}

export const makeDecisionTool = tool({
  description:
    'Finalize and register the structured irrigation decision after synthesizing weather, soil physics, crop phenology, hydrological calculation, and irrigation history.',
  inputSchema: makeDecisionInputSchema,
  execute: executeMakeDecision,
});
