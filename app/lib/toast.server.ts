import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';

import { combineHeaders } from '~/lib/headers.server';

export const toastKey = 'toast';

const ToastSchema = z.object({
  description: z.string().optional(),
  id: z.string().default(() => randomUUID()),
  title: z.string().optional(),
  type: z.enum(['message', 'success', 'error']).default('message')
});

export type Toast = z.infer<typeof ToastSchema>;
export type ToastInput = z.input<typeof ToastSchema>;

export const toastSessionStorage = createCookieSessionStorage({
  cookie: {
    httpOnly: true,
    name: 'toast',
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production'
  }
});

export async function redirectWithToast(
  url: string,
  toast: ToastInput,
  init?: ResponseInit
) {
  return redirect(url, {
    ...init,
    headers: combineHeaders(init?.headers, await createToastHeaders(toast))
  });
}

export async function createToastHeaders(toastInput: ToastInput) {
  const session = await toastSessionStorage.getSession();
  const toast = ToastSchema.parse(toastInput);
  session.flash(toastKey, toast);
  const cookie = await toastSessionStorage.commitSession(session);
  return new Headers({ 'Set-Cookie': cookie });
}

export async function getToastFromRequest(request: Request) {
  const session = await toastSessionStorage.getSession(
    request.headers.get('Cookie')
  );
  const result = ToastSchema.safeParse(session.get(toastKey));
  const toast = result.success ? result.data : null;
  return {
    toast,
    headers: toast
      ? new Headers({
          'Set-Cookie': await toastSessionStorage.destroySession(session)
        })
      : null
  };
}
