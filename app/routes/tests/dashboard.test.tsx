import { describe, expect, test } from 'vitest';

import { authenticator } from '~/lib/auth.server';
import { sessionStorage } from '~/lib/session.server';
import { loader } from '~/routes/dashboard';

describe('Dashboard', () => {
  test('Loader - is signed in', async () => {
    const session = await sessionStorage.getSession();
    const fakeUser = { email: 'test@example.com' };
    session.set(authenticator.sessionKey, fakeUser);
    const request = new Request('http://localhost:3000/dashboard', {
      headers: { Cookie: await sessionStorage.commitSession(session) }
    });
    const response = await loader({ request, context: {}, params: {} });
    expect(response.status).toBe(200);
  });

  test('Loader - is not signed in', async () => {
    const request = new Request('http://localhost:3000/dashboard', {
      headers: { Cookie: '' }
    });

    expect.assertions(1);
    try {
      await loader({ request, context: {}, params: {} });
    } catch (err) {
      if (err instanceof Response) {
        expect(err.status).toEqual(302);
      }
    }
  });
});
