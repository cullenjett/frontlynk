import { Authenticator } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';

import { sessionStorage } from '~/lib/session.server';

interface AuthUser {
  email: string;
}

export const authenticator = new Authenticator<AuthUser>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get('email') as string;
    // TODO: Add real login
    // const password = form.get('password');
    // const user = await login({ email, password })
    const user = {
      email
    };
    return user;
  }),
  'login-form'
);
