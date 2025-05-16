import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const updatePreferencesTool = createTool({
  id: 'update-preferences',
  description: 'Update the LLM notes/preferences for the user.',
  inputSchema: z.object({
    llm_notes: z.array(z.string()),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    preferences: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const res = await fetch('/api/neon/preferences', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ llm_notes: context.llm_notes }),
    });
    if (!res.ok) {
      return { success: false, error: await res.text() };
    }
    const preferences = await res.json();
    return { success: true, preferences };
  },
});
