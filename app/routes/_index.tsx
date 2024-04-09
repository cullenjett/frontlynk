import { useForm, getInputProps, getFormProps } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction
} from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { z } from 'zod';

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
          autoComplete: 'off',
          autoFocus: true
        }}
        errors={fields.email.errors}
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
          ...getInputProps(fields.password, { type: 'password' }),
          autoComplete: 'off'
        }}
        errors={fields.password.errors}
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
