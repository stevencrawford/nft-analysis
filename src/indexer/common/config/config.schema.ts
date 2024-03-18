import { z } from 'zod';
import { Network } from 'alchemy-sdk';

export const configSchema = z.object({
  PORT: z.coerce.number().optional().default(3000),
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.coerce.number().positive(),
  REDIS_PASSWORD: z.string().optional(),
  RESERVOIR_API_KEY: z.string().min(1),
  ALCHEMY_API_KEY: z.string().min(1),
  ALCHEMY_NETWORK: z.enum([Network.ETH_MAINNET]),
});
