async function inspect(prompt) {
  console.log('Sending:', prompt);
  const res = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ id: '1', role: 'user', parts: [{ type: 'text', text: prompt }] }]
    })
  });

  const text = await res.text();
  console.log('\n--- Tool Invocations ---');
  const toolNames = text.match(/"toolName":"[^"]+"/g) || [];
  console.log(toolNames);

  console.log('\n--- makeDecision Input/Output ---');
  const decisionMatch = text.match(/"decision":"(IRRIGATE|WAIT|MONITOR)"/g);
  console.log('Decisions found in JSON:', decisionMatch);

  console.log('\n--- Last 1000 Chars ---');
  console.log(text.slice(-1000));
}

inspect('Evaluate rice field, 75% moisture, 85% rain, 26C, vegetative stage.');
