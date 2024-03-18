import { Network } from 'alchemy-sdk';

export interface Config {
  port: number;
  redis: RedisConfig;
  // postgres: PostgresConfig;
  reservoir: ReservoirConfig;
  alchemy: AlchemyConfig;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
}

export interface ReservoirConfig {
  apiKey: string;
}

export interface AlchemyConfig {
  apiKey: string;
  network: Network;
}

// export interface PostgresConfig {
//   host: string;
//   port: number;
//   username: string;
//   password: string;
// }

export default (): Config => {
  return {
    port: parseInt(process.env.PORT as string, 10),
    // postgres: {
    //   host: process.env.POSTGRES_HOST as string,
    //   port: parseInt(process.env.POSTGRES_PORT as string, 10),
    //   username: process.env.POSTGRES_USERNAME as string,
    //   password: process.env.POSTGRES_PASSWORD as string,
    // },
    redis: {
      host: process.env.REDIS_HOST as string,
      port: parseInt(process.env.REDIS_PORT as string, 10),
      password: process.env.REDIS_PASSWORD,
      db:
        process.env.REDIS_DB !== undefined
          ? parseInt(process.env.REDIS_DB, 10)
          : undefined,
      keyPrefix: process.env.REDIS_PREFIX ?? 'nft-analysis',
    },
    reservoir: {
      apiKey: process.env.RESERVOIR_API_KEY as string,
    },
    alchemy: {
      apiKey: process.env.ALCHEMY_API_KEY as string,
      network: process.env.ALCHEMY_NETWORK as Network,
    },
  };
};
