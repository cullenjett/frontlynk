import { createCookieSessionStorage } from '@remix-run/node';

// TODO: make this legit
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    httpOnly: true,
    name: 'session',
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production'
  }
});
