import 'dotenv/config';

export function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value.trim() === '') {
    throw new Error(`Missing required environment variable "${name}". See .env.example.`);
  }
  return value;
}

export function getBaseUrl(): string {
  return getRequiredEnv('BASE_URL');
}
