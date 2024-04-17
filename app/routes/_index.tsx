import {
  useForm,
  getInputProps,
  getFormProps,
  getSelectProps
} from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction
} from '@remix-run/node';
import {
  Form,
  Link,
  json,
  redirect,
  useActionData,
  useNavigation
} from '@remix-run/react';
import { z } from 'zod';

import { Field, SelectField } from '~/components/forms';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { login, sessionStorage } from '~/lib/session.server';

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
    .min(4, 'Password must be at least 4 characters'),
  favoriteNumber: z.enum(['one', 'two', 'three'] as const, {
    errorMap: () => ({ message: 'Required' })
  })
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = await parseWithZod(formData, { schema });
  if (submission.status !== 'success') {
    return json(submission.reply());
  }

  return await login(request, {
    email: submission.value.email,
    password: submission.value.password
  });
}

export default function Index() {
  return (
    <div className="h-full w-full lg:grid lg:grid-cols-2">
      <div className="flex h-full items-center justify-center px-5 py-12">
        <div className="mx-auto grid w-[350px] gap-8">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-muted-foreground">
              Any email and password will do
            </p>
          </div>

          <LoginForm />
        </div>
      </div>

      <div className="hidden items-center justify-center bg-burnt-sienna-400 lg:flex">
        <img
          className="rounded opacity-30"
          src="https://placehold.co/180x40"
          alt="Logo"
          width="180"
          height="40"
        />
      </div>
    </div>
  );
}

function LoginForm() {
  const navigation = useNavigation();
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm<z.input<typeof schema>>({
    lastResult
    // defaultValue: {
    //   favoriteNumber: 'two'
    // }
    // Adding client-side validation costs ~15kb...
    // constraint: getZodConstraint(schema),
    // onValidate({ formData }) {
    //   return parseWithZod(formData, { schema });
    // }
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
          <div className="relative flex items-center">
            <Label {...labelProps}>Password</Label>
            <Link to="/forgot-password" className="link ml-auto text-xs">
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

      <SelectField
        label="Favorite number"
        options={[
          { label: 'One', value: 'one' },
          { label: 'Two', value: 'two' },
          { label: 'Three', value: 'three' }
        ]}
        selectProps={{
          ...getSelectProps(fields.favoriteNumber)
        }}
        errors={fields.favoriteNumber.errors}
      />

      <Button
        type="submit"
        className="w-full"
        isLoading={navigation.state === 'submitting'}
      >
        Login
      </Button>

      <p className="mt-4 text-center text-sm">
        Don't have an account?{' '}
        <Link to="/register" className="link">
          Sign up
        </Link>
      </p>
    </Form>
  );
}
