export type AppConfig = {
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  SALT: string;
};

export interface Config {
  get<T extends keyof AppConfig>(key: T): AppConfig[T];
}
