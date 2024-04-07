import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';

import { Button } from '~/components/ui/button';
import { authenticator } from '~/lib/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/'
  });

  return json({ user });
}

export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.logout(request, { redirectTo: '/' });
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
