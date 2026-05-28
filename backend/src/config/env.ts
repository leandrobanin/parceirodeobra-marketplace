const INSECURE_JWT_SECRETS = new Set([
  'your_super_secret_jwt_key',
  'secret',
  'changeme',
  'change-me',
]);

function requireJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();

  if (!secret || secret.length < 32 || INSECURE_JWT_SECRETS.has(secret.toLowerCase())) {
    throw new Error('JWT_SECRET must be set to a non-placeholder value with at least 32 characters.');
  }

  return secret;
}

function parsePort(value: string | undefined): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 5000;
}

function parseAllowedOrigins(value: string | undefined): string[] {
  const origins = value
    ? value.split(',')
    : ['http://localhost:3000', 'http://127.0.0.1:3000'];

  return origins.map((origin) => origin.trim()).filter(Boolean);
}

export const env = {
  port: parsePort(process.env.PORT),
  jwtSecret: requireJwtSecret(),
  allowedOrigins: parseAllowedOrigins(process.env.CORS_ORIGIN),
};
