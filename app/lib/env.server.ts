import { z } from 'zod';

const schema = z.object({
  DEPLOY_ENV: z.enum(['local', 'develop', 'production'] as const),
  NODE_ENV: z.enum(['production', 'development', 'test'] as const),
  PORT: z.string().optional(),
  SESSION_SECRET: z.string()
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof schema> {}
  }
}

export function initEnv() {
  const parsed = schema.safeParse(process.env);

  if (parsed.success === false) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors
    );

    throw new Error('Invalid environment variables');
  }
}

/**
 * This is used in both `entry.server.ts` and `root.tsx` to ensure that
 * the environment variables are set and globally available before the app is
 * started.
 *
 * NOTE: Do *not* add any environment variables in here that you do not wish to
 * be included in the client.
 */
export function getPublicEnv() {
  return {
    DEPLOY_ENV: process.env.DEPLOY_ENV
  };
}

type ENV = ReturnType<typeof getPublicEnv>;

declare global {
  // ENV is a globally-accessible map of *public* env vars
  // eslint-disable-next-line no-var
  var ENV: ENV;
  interface Window {
    ENV: ENV;
  }
}
