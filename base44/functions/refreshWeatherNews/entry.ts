import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const PROMPT = `You are a weather and natural-disaster news editor. Research the top 7 most significant weather and natural-disaster news stories from the PAST 7 DAYS worldwide — including floods, wildfires, earthquakes, severe storms, heatwaves, hurricanes/typhoons, landslides, volcanic eruptions and other natural disasters. Prioritize events that have captured significant mainstream media attention (international news agencies such as Reuters, AP, BBC, AFP), similar in scale to major regional floods or wildfires. For each story return: a concise headline (max 90 characters), a 1-2 sentence summary of what happened and its impact (max 240 characters), the primary news source name (short, e.g. "Reuters", "BBC", "AP", "AFP"), and the story date in YYYY-MM-DD format. Rank them 1 (biggest) to 7 (smallest). Return exactly 7 items.`;

const SCHEMA = {
  type: "object",
  properties: {
    articles: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          summary: { type: "string" },
          source: { type: "string" },
          story_date: { type: "string" },
          rank: { type: "number" }
        },
        required: ["title", "summary", "source", "story_date"]
      }
    }
  }
};

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: PROMPT,
      add_context_from_internet: true,
      model: "gemini_3_1_pro",
      response_json_schema: SCHEMA
    });

    const raw = Array.isArray(result) ? result : result.articles || [];
    const posts = raw.slice(0, 7).map((a, i) => ({
      title: String(a.title || "Weather News").slice(0, 200),
      summary: String(a.summary || "").slice(0, 600),
      source: String(a.source || "News"),
      story_date: String(a.story_date || new Date().toISOString().slice(0, 10)),
      locality: "global",
      language: "en",
      rank: a.rank != null ? Number(a.rank) : i + 1
    }));

    await base44.asServiceRole.entities.WeatherPost.deleteMany({ locality: "global" });
    if (posts.length) {
      await base44.asServiceRole.entities.WeatherPost.bulkCreate(posts);
    }

    return Response.json({ status: "success", count: posts.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}