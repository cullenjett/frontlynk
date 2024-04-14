import { createCookieSessionStorage, redirect } from '@remix-run/node';

import { combineHeaders } from '~/lib/headers.server';

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

export async function requireAuth(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );
  const user = session.get('user');
  if (!user) {
    throw redirect('/');
  }
  return { user };
}

export async function login(
  request: Request,
  credentials: { email: string; password: string }
) {
  // TODO: validate credentials
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );
  session.set('user', {
    email: credentials.email
  });

  throw redirect('/dashboard', {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session)
    }
  });
}

export async function logout(request: Request, responseInit?: ResponseInit) {
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );

  throw redirect('/', {
    ...responseInit,
    headers: combineHeaders(
      { 'Set-Cookie': await sessionStorage.destroySession(session) },
      responseInit?.headers
    )
  });
}
