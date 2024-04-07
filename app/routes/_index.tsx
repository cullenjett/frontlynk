import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction
} from '@remix-run/node';
import { Form, json, useActionData } from '@remix-run/react';
import { useEffect } from 'react';

import { Field } from '~/components/forms';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { authenticator } from '~/lib/auth.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' }
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/dashboard'
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));

  const errors: Record<string, string> = {};

  if (!email.includes('@')) {
    errors.email = 'Invalid email address';
  }

  if (password.length < 4) {
    errors.password = 'Password must be at least 4 characters';
  }

  if (Object.keys(errors).length > 0) {
    return json({ success: false, errors });
  }

  return await authenticator.authenticate('login-form', request, {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    context: { formData }
  });
}

export default function Index() {
  return (
    <div className="w-full h-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-5 h-full">
        <div className="mx-auto w-[350px] grid gap-8">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email and password
            </p>
          </div>

          <LoginForm />
        </div>
      </div>

      <div className="hidden bg-burnt-sienna-400 lg:block"></div>
    </div>
  );
}

function LoginForm() {
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData?.errors) {
      document.querySelector<HTMLInputElement>('[aria-invalid]')?.focus();
    }
  }, [actionData]);

  return (
    <Form className="grid gap-6" method="post">
      <Field
        label="Email"
        inputProps={{
          name: 'email',
          type: 'email',
          autoComplete: 'off',
          autoFocus: true
        }}
        error={actionData?.errors?.email}
      />

      <Field
        renderLabel={(labelProps) => (
          <div className="flex items-center">
            <Label {...labelProps}>Password</Label>
            <a
              href="/forgot-password"
              className="ml-auto inline-block text-sm underline"
            >
              Forgot your password?
            </a>
          </div>
        )}
        inputProps={{
          name: 'password',
          type: 'password',
          autoComplete: 'off'
        }}
        error={actionData?.errors?.password}
      />

      <Button type="submit" className="w-full">
        Login
      </Button>

      <p className="mt-4 text-center text-sm">
        Don't have an account?{' '}
        <a href="/register" className="underline">
          Sign up
        </a>
      </p>
    </Form>
  );
}
