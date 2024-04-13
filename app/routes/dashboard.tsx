import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect
} from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';

import { Button } from '~/components/ui/button';
import { sessionStorage } from '~/lib/session.server';
import { redirectWithToast } from '~/lib/toast.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );
  const user = session.get('user');
  if (!user) {
    throw redirect('/');
  }

  return json({ user });
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );
  return redirectWithToast(
    '/',
    {
      type: 'message',
      title: 'Thanks for stopping by'
    },
    {
      headers: {
        'Set-Cookie': await sessionStorage.destroySession(session)
      }
    }
  );
}

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <main>
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <p>Signed in as {user.email}</p>

      <Form method="post">
        <Button type="submit">Sign out</Button>
      </Form>
    </main>
  );
}
