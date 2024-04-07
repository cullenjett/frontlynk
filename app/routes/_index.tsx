import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, json, useActionData, useFormAction } from '@remix-run/react';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' }
  ];
};

export default function Index() {
  return (
    <div className="w-full h-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12 px-5 h-full">
        <div className="mx-auto w-[350px] grid gap-8">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email and password to login to your account
            </p>
          </div>

          <DemoForm />
        </div>
      </div>

      <div className="hidden bg-muted bg-burnt-sienna-400 lg:block"></div>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));

  const errors: Record<string, string> = {};

  if (!email.includes('@')) {
    errors.email = 'Invalid email address';
  }

  if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (Object.keys(errors).length > 0) {
    return json({ success: false, errors });
  }

  return json({ success: true, errors: null });
}

function DemoForm() {
  const actionData = useActionData<typeof action>();

  return (
    <Form className="grid gap-6" method="post">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <div className="grid gap-1">
          <Input id="email" name="email" type="email" autoComplete="off" />
          {actionData?.errors?.email && (
            <p className="text-destructive text-sm font-medium">
              {actionData?.errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
          <a
            href="/forgot-password"
            className="ml-auto inline-block text-sm underline"
          >
            Forgot your password?
          </a>
        </div>
        <div className="grid gap-1">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="off"
          />
          {actionData?.errors?.password && (
            <p className="text-destructive text-sm font-medium">
              {actionData?.errors.password}
            </p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Login
      </Button>

      <div className="mt-4 text-center text-sm">
        Don't have an account?{' '}
        <a href="/register" className="underline">
          Sign up
        </a>
      </div>

      {actionData?.success && (
        <p className="font-medium text-md text-emerald-800">Success</p>
      )}
    </Form>
  );
}
