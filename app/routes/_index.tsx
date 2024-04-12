import { useForm, getInputProps, getFormProps } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction
} from '@remix-run/node';
import { Form, Link, redirect, useActionData } from '@remix-run/react';
import { z } from 'zod';

import { Field } from '~/components/forms';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { sessionStorage } from '~/lib/session.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' }
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );
  if (session.has('user')) {
    return redirect('/dashboard');
  }
  return null;
}

const schema = z.object({
  email: z.string({ required_error: 'Email is required' }).email(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(4, 'Password must be at least 4 characters')
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = await parseWithZod(formData, { schema });
  if (submission.status !== 'success') {
    return submission.reply();
  }

  // TODO: validate credentials

  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );
  session.set('user', {
    email: submission.value.email
  });

  return redirect('/dashboard', {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session)
    }
  });
}

export default function Index() {
  return (
    <div className="w-full h-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-5 h-full">
        <div className="mx-auto w-[350px] grid gap-8">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-muted-foreground">
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
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    }
  });

  return (
    <Form className="grid gap-6" method="post" {...getFormProps(form)}>
      <Field
        label="Email"
        inputProps={{
          ...getInputProps(fields.email, { type: 'email' }),
          autoComplete: 'email',
          autoFocus: true
        }}
        errors={fields.email.errors}
      />

      <Field
        renderLabel={(labelProps) => (
          <div className="flex items-center relative">
            <Label {...labelProps}>Password</Label>
            <Link to="/forgot-password" className="ml-auto text-xs underline">
              Forgot your password?
            </Link>
          </div>
        )}
        inputProps={{
          ...getInputProps(fields.password, { type: 'password' }),
          autoComplete: 'current-password'
        }}
        errors={fields.password.errors}
      />

      <Button type="submit" className="w-full">
        Login
      </Button>

      <p className="mt-4 text-center text-sm">
        Don't have an account?{' '}
        <Link to="/register" className="underline">
          Sign up
        </Link>
      </p>
    </Form>
  );
}
