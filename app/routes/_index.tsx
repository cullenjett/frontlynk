import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, json, useActionData } from '@remix-run/react';

import { Field } from '~/components/forms';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' }
  ];
};

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

export default function Index() {
  return (
    <div className="w-full h-full lg:grid lg:grid-cols-2">
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

function DemoForm() {
  const actionData = useActionData<typeof action>();

  return (
    <Form className="grid gap-6" method="post">
      <Field
        label="Email"
        inputProps={{
          name: 'email',
          type: 'email',
          autoComplete: 'off'
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

      {actionData?.success ? (
        <div className="relative flex justify-center items-center bg-emerald-100 h-10 rounded border-l-4 border-emerald-900">
          <p className="font-medium text-sm text-emerald-900">
            Login successful
          </p>
        </div>
      ) : (
        <Button type="submit" className="w-full">
          Login
        </Button>
      )}

      <p className="mt-4 text-center text-sm">
        Don't have an account?{' '}
        <a href="/register" className="underline">
          Sign up
        </a>
      </p>
    </Form>
  );
}
