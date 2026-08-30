import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import * as biEngine from '@/lib/bi-engine';
import { supabase } from '@/lib/supabase';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const lastMessage = messages[messages.length - 1];
  if (lastMessage?.role === 'user' && supabase) {
    // Log the query to Supabase asynchronously without blocking
    supabase.from('query_history').insert({
      query: lastMessage.content,
      created_at: new Date().toISOString()
    }).then(({ error }) => {
      if (error) console.error('Failed to log query to Supabase:', error);
    });
  }

  const result = streamText({
    model: google('gemini-1.5-pro-latest'),
    messages,
    system: `You are the Skylark Executive Intelligence Agent. 
You answer business intelligence questions for Skylark Drones' founders.
You have access to deterministic BI calculation tools. ALWAYS use these tools to answer questions about pipeline, deals, work orders, billing, and execution status.
NEVER make up data.
Present your final answer in a concise, executive-level summary. Use markdown formatting. Use bullet points for readability. Be decisive and professional.`,
    tools: {
      getTotalPipelineValue: tool({
        description: 'Get the total value of the current active deals pipeline. Optionally filter by sector.',
        parameters: z.object({
          sector: z.string().optional().describe('Sector to filter by (e.g. Mining, Powerline)'),
        }),
        execute: async ({ sector }: { sector?: string }) => {
          const { value, dealCount } = await biEngine.getTotalPipelineValue(sector);
          return { value, dealCount, sector: sector || 'All' };
        },
      }),
      getDealsByStage: tool({
        description: 'Get the total pipeline value broken down by deal stage.',
        parameters: z.object({}),
        execute: async (_args: Record<string, never>) => await biEngine.getDealsByStage(),
      }),
      getTopOpportunities: tool({
        description: 'Get the top N open opportunities by value.',
        parameters: z.object({
          limit: z.number().optional().describe('Number of deals to return, default 5'),
        }),
        execute: async ({ limit }: { limit?: number }) => {
          const deals = await biEngine.getTopOpportunities(limit);
          return deals.map(d => ({
            name: d.dealName,
            client: d.clientCode,
            value: d.maskedDealValue,
            stage: d.dealStage,
            probability: d.closureProbability
          }));
        },
      }),
      getExecutionStatusSummary: tool({
        description: 'Get a summary of work order execution statuses (count of projects by status).',
        parameters: z.object({}),
        execute: async (_args: Record<string, never>) => await biEngine.getExecutionStatusSummary(),
      }),
      getTotalBilledValue: tool({
        description: 'Get total billed value and total accounts receivable (outstanding amount) for work orders. Optionally filter by sector.',
        parameters: z.object({
          sector: z.string().optional().describe('Sector to filter by'),
        }),
        execute: async ({ sector }: { sector?: string }) => {
          const { billed, receivable } = await biEngine.getTotalBilledValue(sector);
          return { billed, receivable, sector: sector || 'All' };
        },
      }),
      getSectorPerformanceComparison: tool({
        description: 'Compare sector performance: Pipeline value vs Billed value.',
        parameters: z.object({}),
        execute: async (_args: Record<string, never>) => await biEngine.getSectorPerformanceComparison(),
      }),
      getProjectsNeedingAttention: tool({
        description: 'Get a list of work orders that need attention (e.g. billing update required, or not started but have receivables).',
        parameters: z.object({}),
        execute: async (_args: Record<string, never>) => {
          const wos = await biEngine.getProjectsNeedingAttention();
          return wos.map(w => ({
            deal: w.dealNameMasked,
            client: w.customerNameCode,
            status: w.executionStatus,
            billingStatus: w.billingStatus,
            receivable: w.amountReceivable
          }));
        }
      }),
      generateLeadershipBriefing: tool({
        description: 'Compiles all necessary data (pipeline, financials, top deals, risks) and generates a structured leadership update/briefing.',
        parameters: z.object({}),
        execute: async (_args: Record<string, never>) => await biEngine.compileLeadershipBriefingData(),
      })
    },
  });

  return (result as any).toDataStreamResponse();
}
