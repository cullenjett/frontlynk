import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';

import { Button } from '~/components/ui/button';
import { logout, requireAuth } from '~/lib/session.server';
import { createToastHeaders } from '~/lib/toast.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const { user } = await requireAuth(request);
  return json({ user });
}

export async function action({ request }: ActionFunctionArgs) {
  await logout(request, {
    headers: await createToastHeaders({
      type: 'message',
      title: 'Thanks for stopping by'
    })
  });
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
