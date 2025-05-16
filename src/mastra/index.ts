import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { LibSQLStore } from '@mastra/libsql';

import { recommendationAgent } from './agents';
import { recommendationWorkflow } from "./workflow/recommendationWorkflow";

export const mastra = new Mastra({
  agents: { recommendationAgent },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
  workflows: { recommendationWorkflow },
});
