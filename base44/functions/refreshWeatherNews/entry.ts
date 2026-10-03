import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const LANGUAGES = ['en', 'es', 'fr', 'de', 'zh', 'ar', 'hi', 'pt'];
const TOP_N = 7;
const TODAY = new Date().toISOString().slice(0, 10);

const NEWS_SCHEMA = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          summary: { type: 'string' },
          source: { type: 'string' }
        },
        required: ['title', 'summary', 'source']
      }
    }
  }
};

async function fetchEnglishNews(base44: any): Promise<any[]> {
  const prompt = `Today is ${TODAY}. Find the ${TOP_N} most significant currently-active or very recent weather and natural-disaster events happening around the world right now — hurricanes, typhoons, floods, heatwaves, wildfires, severe storms, droughts, earthquakes, and volcanic activity.

Requirements:
- Only include events that are actually occurring or have just occurred in the last few days. Do NOT include events from months or years ago.
- Do NOT include any date in the title or summary.
- For each item return a concise "title" (max 100 chars), a one-to-two sentence "summary" (max 300 chars) describing the event and its location/impact, and a short "source" identifying the outlet or agency (e.g. "Reuters", "BBC", "NOAA", "NHC", "GDACS").
- Return exactly ${TOP_N} items, or fewer if that many genuinely significant current events don't exist.`;
  const res = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt,
    add_context_from_internet: true,
    model: 'gemini_3_flash',
    response_json_schema: NEWS_SCHEMA
  });
  const items = Array.isArray(res) ? res : res.items || [];
  return items.slice(0, TOP_N).map((i: any) => ({
    title: String(i.title || '').slice(0, 200),
    summary: String(i.summary || '').slice(0, 600),
    source: String(i.source || 'Web').slice(0, 60),
    story_date: TODAY
  })).filter((i: any) => i.title);
}

const TRANSLATION_SCHEMA = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          summary: { type: 'string' }
        },
        required: ['title', 'summary']
      }
    }
  }
};

async function translate(base44: any, lang: string, englishItems: any[]): Promise<any[]> {
  if (lang === 'en') return englishItems;
  const languageNames: Record<string, string> = {
    es: 'Spanish', fr: 'French', de: 'German', zh: 'Chinese (Simplified)',
    ar: 'Arabic', hi: 'Hindi', pt: 'Portuguese'
  };
  const prompt = `Translate the following disaster news items into ${languageNames[lang]}. Keep the same meaning and tone; do not add information. Return the same number of items in the same order, each with a translated "title" and "summary".\n\nItems:\n${JSON.stringify(englishItems.map((i) => ({ title: i.title, summary: i.summary })))}`;
  try {
    const res = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: TRANSLATION_SCHEMA
    });
    const translated = Array.isArray(res) ? res : res.items || [];
    return englishItems.map((item, idx) => ({
      ...item,
      title: translated[idx]?.title || item.title,
      summary: translated[idx]?.summary || item.summary
    }));
  } catch {
    return englishItems; // fall back to English on translation failure
  }
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    // Generate current global weather/disaster news via AI web search.
    const top = await fetchEnglishNews(base44);

    // Translate into each language, then write per-language records.
    const records: any[] = [];
    if (top.length) {
      for (const lang of LANGUAGES) {
        const localized = await translate(base44, lang, top);
        localized.forEach((item, idx) => {
          records.push({
            title: item.title,
            summary: item.summary,
            source: 'GDACS',
            story_date: item.story_date,
            locality: 'global',
            language: lang,
            rank: idx + 1
          });
        });
      }
    }

    await base44.asServiceRole.entities.WeatherPost.deleteMany({ locality: 'global' });
    if (records.length) {
      await base44.asServiceRole.entities.WeatherPost.bulkCreate(records);
    }

    return Response.json({ status: 'success', count: records.length, stories: top.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}