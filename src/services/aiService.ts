import { GoogleGenAI } from '@google/genai';
import { Participant, CompanyCountData } from '../types/chat';

// Contextual intelligent response generator
export async function generateAIResponse(
  prompt: string,
  bot: Participant,
  conversationHistory: { role: 'user' | 'model'; text: string }[] = []
): Promise<{
  text: string;
  codeBlock?: { language: string; code: string; filename?: string };
  companyStats?: CompanyCountData;
  suggestions: string[];
}> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are ${bot.name}, a verified ${bot.role} in a modern Slate & Emerald messaging application.
Your domain expertise: ${bot.bio}.
Keep your responses direct, highly knowledgeable, and conversational.
Do not use generic filler words. If code is requested, format it cleanly.
At the end, suggest 2 or 3 quick concise follow-up actions.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          ...conversationHistory.map((m) => ({
            role: m.role,
            parts: [{ text: m.text }],
          })),
          { role: 'user', parts: [{ text: prompt }] },
        ],
        config: {
          systemInstruction,
          temperature: bot.temperature ?? 0.3,
        },
      });

      const responseText = response.text || '';
      
      // Extract code block if any
      const codeMatch = responseText.match(/```([a-zA-Z0-9_-]+)?\n([\s\S]*?)```/);
      let extractedCode: { language: string; code: string; filename?: string } | undefined;
      let cleanText = responseText;

      if (codeMatch) {
        extractedCode = {
          language: codeMatch[1] || 'typescript',
          code: codeMatch[2].trim(),
          filename: `${bot.name.toLowerCase()}-snippet.${codeMatch[1] || 'ts'}`,
        };
        cleanText = responseText.replace(/```([a-zA-Z0-9_-]+)?\n([\s\S]*?)```/g, '').trim();
      }

      return {
        text: cleanText || responseText,
        codeBlock: extractedCode,
        suggestions: [
          `Refine ${bot.name}'s approach`,
          'Provide architectural edge-cases',
          'Export implementation plan',
        ],
      };
    } catch (err) {
      console.warn('Gemini API call fell back to local domain intelligence:', err);
    }
  }

  // Simulated high-fidelity domain intelligence fallback
  await new Promise((res) => setTimeout(res, 800));

  const lower = prompt.toLowerCase();

  // Aya: Online Company Counter & KRA Intelligence Bot
  if (
    bot.id === 'bot_aya' ||
    bot.category === 'Company & KRA' ||
    lower.includes('company') ||
    lower.includes('count') ||
    lower.includes('kra')
  ) {
    return {
      text: `Online Company Audit & Census Report:\n\n• Verified Online Companies: 18,450 active registered entities\n• Active Enterprise Accounts: 42,890 verified portals\n• Statutory KRA Compliance Rate: 98.4% (18,154 filed & verified)\n• Monthly Registry Expansion: +8.2% (+1,420 companies onboarded)\n\nHere is the real-time breakdown of online companies, active accounts, and statutory compliance status:`,
      companyStats: {
        totalCompanies: 18450,
        activeAccounts: 42890,
        kraCompliantPercent: 98.4,
        monthlyGrowth: '+8.2%',
        sectors: [
          { name: 'SaaS & Cloud Tech', count: 5640, percentage: 30.6, color: '#128C7E' },
          { name: 'E-Commerce & Retail', count: 4930, percentage: 26.7, color: '#25D366' },
          { name: 'FinTech & Payments', count: 4820, percentage: 26.1, color: '#008376' },
          { name: 'AI & Autonomous', count: 2110, percentage: 11.4, color: '#075E54' },
          { name: 'Logistics & Supply', count: 950, percentage: 5.2, color: '#388075' },
        ],
        featuredCompanies: [
          { name: 'NovaPay Global', sector: 'FinTech', kraStatus: 'Compliant', country: 'United States', accountsCount: 1420, revenueEst: '$42M' },
          { name: 'Aether Cloud Systems', sector: 'SaaS & Cloud', kraStatus: 'Compliant', country: 'Germany', accountsCount: 2890, revenueEst: '$88M' },
          { name: 'Verdant Retail Labs', sector: 'E-Commerce', kraStatus: 'Compliant', country: 'United Kingdom', accountsCount: 840, revenueEst: '$19M' },
          { name: 'Apex Logistics Corp', sector: 'Logistics', kraStatus: 'Audited', country: 'Singapore', accountsCount: 510, revenueEst: '$65M' },
        ],
      },
      suggestions: [
        'Count companies by region / country',
        'Check pending KRA statutory audits',
        'Export online company census ledger',
      ],
    };
  }

  if (bot.category === 'Architecture' || bot.id === 'bot_aria') {
    if (lower.includes('redis') || lower.includes('cache')) {
      return {
        text: `For high-concurrency Redis caching, the standard TTL decay pattern leads to cache stampedes. I recommend deploying an adaptive early-expiration algorithm with probabilistic recomputation:`,
        codeBlock: {
          language: 'typescript',
          filename: 'probabilistic-cache.ts',
          code: `// XFetch Probabilistic Cache Invalidation
export async function getWithProbabilisticRefresh<T>(
  key: string,
  ttlSec: number,
  deltaSec: number, // compute duration
  beta: number = 1.0,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = await redis.get(key);
  const now = Date.now() / 1000;
  
  if (cached && -deltaSec * beta * Math.log(Math.random()) < (cached.expiry - now)) {
    return cached.value;
  }
  
  // Background asynchronous recompute
  const fresh = await fetcher();
  await redis.set(key, { value: fresh, expiry: now + ttlSec });
  return fresh;
}`,
        },
        suggestions: [
          'Add Bloom filter for key existence check',
          'Configure memory eviction policy to volatile-lfu',
          'Simulate 100k req/sec load test',
        ],
      };
    }

    if (lower.includes('pub/sub') || lower.includes('websocket') || lower.includes('event')) {
      return {
        text: `Here is the event-driven pub/sub architecture breakdown:\n\n1. Socket Handlers ingest binary buffers directly into ephemeral ring buffers.\n2. Partitioned dispatch workers distribute payload by topic hash without thread lock contention.\n3. Downstream consumer groups process with idempotent monotonic sequence IDs.`,
        suggestions: [
          'Generate sequence number validator',
          'Benchmark p99 latency SLA',
          'Review disaster recovery playbook',
        ],
      };
    }

    return {
      text: `Understood Alex. I analyzed your prompt regarding "${prompt}". From a system architecture perspective, prioritizing deterministic latency budgets and decoupling stateful socket nodes from stateless routing tiers yields a 3.4x boost in sustained RPS.`,
      suggestions: [
        'Explore sharding topology',
        'Draft sequence flow diagram',
        'Analyze memory profile under load',
      ],
    };
  }

  if (bot.category === 'Code Review' || bot.id === 'bot_turing') {
    return {
      text: `Turing code review completed. Found zero critical AST anomalies. Memory allocations stay flat with O(1) space complexity.`,
      codeBlock: {
        language: 'typescript',
        filename: 'optimized-pipeline.ts',
        code: `// Zero-allocation generator stream
export function* createObjectStream<T>(items: readonly T[]) {
  for (let i = 0; i < items.length; i++) {
    yield items[i];
  }
}`,
      },
      suggestions: [
        'Run bundle size analyzer',
        'Verify TypeScript strictNullChecks',
        'Add mutation test coverage',
      ],
    };
  }

  return {
    text: `Got your request: "${prompt}". I've parsed the requirements and tuned the parameters for immediate deployment. Let me know if you want me to expand on edge cases or produce the full implementation documentation.`,
    suggestions: [
      'Show detailed technical breakdown',
      'Optimize for memory efficiency',
      'Draft test cases',
    ],
  };
}
