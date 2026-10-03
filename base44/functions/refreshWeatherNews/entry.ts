import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const GDACS_RSS_URL = 'https://www.gdacs.org/xml/rss.xml';
const LANGUAGES = ['en', 'es', 'fr', 'de', 'zh', 'ar', 'hi', 'pt'];
const TOP_N = 7;

// Decode common HTML/XML entities in RSS text.
function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTag(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  return m ? decodeEntities(m[1]) : '';
}

// Alert severity: Red > Orange > Green (0 default for unknown).
function alertLevel(title: string): number {
  if (/red alert/i.test(title)) return 3;
  if (/orange alert/i.test(title)) return 2;
  return 1;
}

function parseRss(xml: string) {
  const items: any[] = [];
  const blocks = xml.split('<item>').slice(1);
  for (const block of blocks) {
    const end = block.indexOf('</item>');
    const itemXml = end >= 0 ? block.slice(0, end) : block;
    const title = extractTag(itemXml, 'title');
    const description = extractTag(itemXml, 'description');
    const link = extractTag(itemXml, 'link');
    const pubDate = extractTag(itemXml, 'pubDate');
    if (!title) continue;
    let storyDate = new Date().toISOString().slice(0, 10);
    if (pubDate) {
      const d = new Date(pubDate);
      if (!isNaN(d.getTime())) storyDate = d.toISOString().slice(0, 10);
    }
    items.push({ title, summary: description, link, storyDate, alert: alertLevel(title), pubDateMs: pubDate ? Date.parse(pubDate) || 0 : 0 });
  }
  return items;
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

    // Fetch + parse the live GDACS feed.
    const res = await fetch(GDACS_RSS_URL, { headers: { 'User-Agent': 'Weatherskies/1.0' } });
    if (!res.ok) throw new Error(`GDACS fetch failed: ${res.status}`);
    const xml = await res.text();
    const all = parseRss(xml);

    // Rank by alert severity, then recency.
    all.sort((a, b) => b.alert - a.alert || b.pubDateMs - a.pubDateMs);
    const top = all.slice(0, TOP_N).map((i, idx) => ({
      title: String(i.title).slice(0, 200),
      summary: String(i.summary).slice(0, 600),
      source: 'GDACS',
      story_date: i.storyDate
    }));

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