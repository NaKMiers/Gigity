export const ENV = {
  // Public
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_PREFIX: process.env.NEXT_PUBLIC_API_PREFIX,
  NEXT_PUBLIC_VERSION: process.env.NEXT_PUBLIC_VERSION,

  // Atlas
  MONGODB: process.env.MONGODB,

  // Secret
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  CRON_SECRET: process.env.CRON_SECRET,
  BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,

  // Open AI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  SUNO_API_KEY: process.env.SUNO_API_KEY,
}
