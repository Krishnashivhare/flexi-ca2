import { createGroq } from '@ai-sdk/groq';

export interface AgentConfig {
  hasApiKey: boolean;
  providerName: string;
  modelName: string;
}

export function getAgentConfig(): AgentConfig {
  const apiKey = process.env.AI_API_KEY || process.env.GROQ_API_KEY;
  const modelName = process.env.AI_MODEL || 'openai/gpt-oss-20b';

  return {
    hasApiKey: Boolean(apiKey && apiKey.trim().length > 0 && !apiKey.includes('your_')),
    providerName: 'Groq',
    modelName,
  };
}

export function getGroqModel() {
  const apiKey = process.env.AI_API_KEY || process.env.GROQ_API_KEY;
  const modelName = process.env.AI_MODEL || 'openai/gpt-oss-20b';

  if (!apiKey || apiKey.includes('your_')) {
    return null;
  }

  const groqClient = createGroq({ apiKey });
  return groqClient(modelName);
}
