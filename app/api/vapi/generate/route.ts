import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import Parser from '@postlight/parser';
import { db } from '@/firebase/admin';

export async function GET() {
  return Response.json({ success: true, data: 'Thank You!' }, { status: 200 });
}

export async function POST(request: Request) {
  const { url, tone, userid } = await request.json();

  
  async function scrape(url: string): Promise<string> {
    function stripHtml(html: string) {
      return html.replace(/<[^>]+>/g, '');
    }

    try {
      const result = await Parser.parse(url);
      return stripHtml(result.content || '');
    } catch (error) {
      console.error('Parsing error:', error);
      throw new Error('Failed to parse the URL.');
    }
  }

  function parseGeminiJSON(geminiOutput) {
    try {
      return JSON.parse(
        geminiOutput
          .replace(/^```(json)?\n?|\n?```$/g, '')
          .replace(/\\"/g, '"')
          .trim()
      );
    } catch (error) {
      console.error("Failed to parse Gemini output:", error);
      return []; 
    }
  }
  
 

  try {
    const content = await scrape(url);

    const toneType = (tone === 'Casual' || tone === 'Professional' || tone === 'Funny') ? tone : 'Casual';
    

    const { text } = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt: `Create a podcast script between two people Host and Guest about: ${content}
    
      === OUTPUT MUST BE ===
      A pure JSON array of objects with EXACTLY this structure, speaker should be alternated Host and Guest:
      [
        { "speaker": "Host", "text": "..." },
        { "speaker": "Guest", "text": "..." }
      ]
    
      === STRICT RULES ===
      1. Tone of Podcast should be ${toneType}
      2. NO markdown (no \`\`\`json, no code blocks)
      3. NO outer quotes or string escaping
      4. Each object must have "speaker" and "text" keys
      5. Keep "text" values under 2 sentences
      6. Alternate strictly between Host and Guest
    
      === BAD EXAMPLES (REJECT) ===
      Bad (markdown):
      \`\`\`json
      [{...}]
      \`\`\`
    
      Bad (escaped):
      "[{\\"speaker\\": ...}]"
    
      === GOOD EXAMPLE ===
      [
        { "speaker": "Host", "text": "Welcome!" },
        { "speaker": "Guest", "text": "Happy to be here." }
      ]
    
      === YOUR OUTPUT MUST ===
      Start with [ and end with ]
      Contain only valid JSON
      Be parseable by JSON.parse()`
    });

    const podcast = {
      url,
      tone: toneType,
      podcastScript: parseGeminiJSON(text),
      userID: userid,
      createdAt: new Date().toISOString()
    }

    await db.collection("podcasts").add(podcast);

    return Response.json({ success: true }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return Response.json({ success: false, error: e.message || e.toString() }, { status: 500 });
  }
}
