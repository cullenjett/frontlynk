import { useForm, getInputProps, getFormProps } from '@conform-to/react';
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

import { Field } from '~/components/forms';
import { Button } from '~/components/ui/button';
import { resetPassword, sessionStorage } from '~/lib/session.server';
import { createToastHeaders } from '~/lib/toast.server';

export const meta: MetaFunction = () => {
  return [{ title: 'Forgot Password' }];
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
  email: z
    .string({ required_error: 'Email is required' })
    .email()
    .transform((value) => value.toLowerCase().trim())
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = await parseWithZod(formData, { schema });
  if (submission.status !== 'success') {
    return json(submission.reply());
  }

  return await resetPassword(request, submission.value.email, {
    headers: await createToastHeaders({
      type: 'success',
      title: 'Password reset email sent',
      description: 'Check your email for a link to reset your password',
      duration: 8000
    })
  });
}

export default function ForgotPassword() {
  return (
    <div className="h-full w-full lg:grid lg:grid-cols-[3fr_2fr]">
      <div className="flex h-full items-center justify-center px-5 py-12">
        <div className="mx-auto grid w-full max-w-[350px] gap-8">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Forgot Password</h1>
            <p className="text-muted-foreground">
              Enter your email and we'll send you a link to reset your password
            </p>
          </div>

          <ForgotPasswordForm />
        </div>
      </div>

      <div className="hidden bg-burnt-sienna-400 bg-gradient-to-br from-burnt-sienna-400 to-burnt-sienna-500 lg:block"></div>
    </div>
  );
}

function ForgotPasswordForm() {
  const navigation = useNavigation();
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm<z.input<typeof schema>>({
    lastResult
  });

  return (
    <Form className="grid gap-6" method="post" {...getFormProps(form)}>
      <Field
        label="Email address"
        inputProps={{
          ...getInputProps(fields.email, { type: 'email' }),
          autoComplete: 'email',
          autoFocus: true
        }}
        errors={fields.email.errors}
      />

      <Button
        type="submit"
        className="w-full"
        isLoading={navigation.state === 'submitting'}
      >
        Reset Password
      </Button>

      <p className="mt-4 text-center text-sm">
        Remember your password?{' '}
        <Link to="/" className="link">
          Sign in
        </Link>
      </p>
    </Form>
  );
}
