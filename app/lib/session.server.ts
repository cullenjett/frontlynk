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

  // TODO: validate token
  await new Promise((resolve) => setTimeout(resolve, 100));

  return { user };
}

export async function createAccount(
  request: Request,
  newAccount: {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
  },
  responseInit?: ResponseInit
) {
  // TODO: create a real account
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );
  session.set('user', {
    email: newAccount.email
  });

  throw redirect('/dashboard', {
    ...responseInit,
    headers: combineHeaders(
      {
        'Set-Cookie': await sessionStorage.commitSession(session)
      },
      responseInit?.headers
    )
  });
}

export async function login(
  request: Request,
  credentials: { email: string; password: string },
  responseInit?: ResponseInit
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
    ...responseInit,
    headers: combineHeaders(
      {
        'Set-Cookie': await sessionStorage.commitSession(session)
      },
      responseInit?.headers
    )
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
