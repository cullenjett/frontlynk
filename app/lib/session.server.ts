import { createCookieSessionStorage } from '@remix-run/node';

// TODO: make this legit
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'session', // use any name you want here
    sameSite: 'lax', // this helps with CSRF
    path: '/', // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: ['s3cr3t'], // replace this with an actual secret
    secure: process.env.NODE_ENV === 'production' // enable this in prod only
  }
});