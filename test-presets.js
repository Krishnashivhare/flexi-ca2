async function testPreset(name, prompt) {
  console.log('\n=============================================');
  console.log('Testing Scenario:', name);
  console.log('Prompt:', prompt);
  
  const startTime = Date.now();
  const res = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ id: 'msg-' + Date.now(), role: 'user', parts: [{ type: 'text', text: prompt }] }]
    })
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullOutput = '';
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    fullOutput += decoder.decode(value);
  }

  const durationMs = Date.now() - startTime;
  
  // Extract tools
  const tools = [];
  const toolMatches = fullOutput.match(/"toolName":"([^"]+)"/g) || [];
  for (const m of toolMatches) {
    const t = m.replace('"toolName":"', '').replace('"', '');
    if (!tools.includes(t)) tools.push(t);
  }

  // Extract definitive decision from evaluation header or makeDecision tool output
  const headerMatch = fullOutput.match(/Agentic Irrigation Evaluation: \*\*(IRRIGATE|WAIT|MONITOR)\*\*/);
  const toolDecisionMatch = fullOutput.match(/"decision":"(IRRIGATE|WAIT|MONITOR)"/g);
  const lastToolDecision = toolDecisionMatch ? toolDecisionMatch[toolDecisionMatch.length - 1].replace(/"decision":"|"/g, '') : null;

  const decided = headerMatch ? headerMatch[1] : lastToolDecision || 'UNKNOWN';

  console.log('Result in ' + durationMs + 'ms:');
  console.log('Tools Called (' + tools.length + '):', tools.join(' -> '));
  console.log('Final Synthesized Decision:', decided);

  return { name, tools, decided };
}

async function runAll() {
  const r1 = await testPreset('1. Dry Wheat Field (Expected: IRRIGATE)', 'Evaluate wheat field, 28% moisture, 10% rain, 31C, vegetative stage.');
  const r2 = await testPreset('2. Rainy Rice Field (Expected: WAIT)', 'Evaluate rice field, 75% moisture, 85% rain, 26C, vegetative stage.');
  const r3 = await testPreset('3. Moderate Tomato Field (Expected: MONITOR)', 'Evaluate tomato field, 48% moisture, 40% rain, 28C, fruiting stage.');
  const r4 = await testPreset('4. Hot Cotton Field (Expected: IRRIGATE)', 'Evaluate cotton field, 35% moisture, 15% rain, 36C, flowering stage.');

  console.log('\n=============================================');
  console.log('ACADEMIC GRADING VERIFICATION FOR ALL 4 PRESETS:');
  console.log('1. Wheat (28% moist, 10% rain):  ', r1.decided, r1.decided === 'IRRIGATE' ? '✅ PASS' : '❌ FAIL');
  console.log('2. Rice (75% moist, 85% rain):   ', r2.decided, r2.decided === 'WAIT' ? '✅ PASS' : '❌ FAIL');
  console.log('3. Tomato (48% moist, 40% rain): ', r3.decided, r3.decided === 'MONITOR' ? '✅ PASS' : '❌ FAIL');
  console.log('4. Cotton (35% moist, 15% rain): ', r4.decided, r4.decided === 'IRRIGATE' ? '✅ PASS' : '❌ FAIL');
  console.log('=============================================');
}

runAll().catch(err => console.error(err));
