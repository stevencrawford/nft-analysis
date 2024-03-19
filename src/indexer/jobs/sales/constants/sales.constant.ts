const salesQueues = [
  'sales-backfill',
  'sales',
] as const;

export type SalesQueues = (typeof salesQueues)[number];

export const [SALES_BACKFILL, SALES] = salesQueues;
