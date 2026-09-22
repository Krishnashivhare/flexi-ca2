import { getWeatherTool } from './getWeather';
import { analyzeSoilTool } from './analyzeSoil';
import { getCropKnowledgeTool } from './getCropKnowledge';
import { calculateIrrigationTool } from './calculateIrrigation';
import { getIrrigationHistoryTool } from './getIrrigationHistory';
import { makeDecisionTool } from './makeDecision';

export const agentTools = {
  getWeather: getWeatherTool,
  analyzeSoil: analyzeSoilTool,
  getCropKnowledge: getCropKnowledgeTool,
  calculateIrrigation: calculateIrrigationTool,
  getIrrigationHistory: getIrrigationHistoryTool,
  makeDecision: makeDecisionTool,
};

export {
  getWeatherTool,
  analyzeSoilTool,
  getCropKnowledgeTool,
  calculateIrrigationTool,
  getIrrigationHistoryTool,
  makeDecisionTool,
};

export { executeWeather } from './getWeather';
export { executeSoilAnalysis } from './analyzeSoil';
export { executeCropKnowledge } from './getCropKnowledge';
export { executeCalculateIrrigation } from './calculateIrrigation';
export { executeIrrigationHistory } from './getIrrigationHistory';
export { executeMakeDecision } from './makeDecision';
