// POST /api/customization/ai-advisor
// Sends the customer's plain-language goal, the vehicle, and the vehicle's
// actual available option keys per category to Groq's OpenAI-compatible
// chat-completions API (a free-tier LLM host), and gets back a structured
// pick per category (from those exact keys only) with a short explanation
// for each. Recommendations are re-validated against the real catalog before
// they're sent back, since Groq's JSON mode guarantees valid JSON but not
// schema conformance the way OpenAI's strict json_schema mode would.
exports.getAiRecommendations = async (req, res) => {
  const { vehicle, goal, categories } = req.body;

  if (!goal || !goal.trim()) {
    return res
      .status(400)
      .json({ message: 'Describe what you want first (e.g. "sportier look for city driving").' });
  }
  if (!Array.isArray(categories) || categories.length === 0) {
    return res.status(400).json({ message: 'No customization categories available for this vehicle' });
  }
  if (!process.env.GROQ_API_KEY) {
    return res
      .status(500)
      .json({ message: 'AI Mod Advisor is not configured. Set GROQ_API_KEY in server/.env.' });
  }

  const catalogText = categories
    .map((c) => `- ${c.category}: ${c.options.map((o) => o.key).join(', ')}`)
    .join('\n');

  const prompt = [
    `Vehicle: ${vehicle?.year || ''} ${vehicle?.make || ''} ${vehicle?.model || ''} (${vehicle?.bodyType || 'unknown body type'})`,
    `Customer goal: "${goal.trim()}"`,
    '',
    'Available customization categories and their exact option keys (pick ONLY from these keys, at most one per category, and skip a category entirely if nothing in it suits the goal):',
    catalogText,
    '',
    "First judge how bold or subtle the customer's goal sounds, then pick accordingly:",
    '- Aggressive/sporty/loud goals ("sportier", "aggressive", "track-ready") -> prefer the boldest fitting options (bright/dark colors, race-style decals, performance parts).',
    '- Mild/clean/practical goals ("decent", "clean", "subtle", "for daily commuting", "fuel efficiency") -> prefer restrained options, including "stock" or "none" — do not default to the flashiest option just because it exists.',
    'Two different goals should usually produce different picks. Only repeat a pick across goals if it is genuinely still the best fit for both.',
    '',
    'Respond with ONLY a JSON object of this exact shape, no extra text:',
    '{ "summary": string, "recommendations": [ { "category": string, "key": string, "reason": string } ] }',
  ].join('\n');

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
        messages: [
          {
            role: 'system',
            content:
              "You are MotoFix's AI Mod Advisor. Recommend vehicle modifications strictly from the given category/key catalog based on the customer's stated goal. Never invent a key that isn't listed. Keep each reason to one short sentence. Always reply with raw JSON only.",
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error?.message || `Groq request failed (${response.status})`);
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    const validKeys = new Map(categories.map((c) => [c.category, new Set(c.options.map((o) => o.key))]));
    const recommendations = (parsed.recommendations || []).filter((r) => validKeys.get(r.category)?.has(r.key));

    res.json({ summary: parsed.summary, recommendations });
  } catch (err) {
    res.status(502).json({ message: `AI Mod Advisor is unavailable right now: ${err.message}` });
  }
};
