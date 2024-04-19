import { useForm, getInputProps, getFormProps } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs, json } from '@remix-run/node';
import {
  Form,
  Link,
  MetaFunction,
  useActionData,
  useNavigation
} from '@remix-run/react';
import { ArrowRight } from 'lucide-react';
import { z } from 'zod';

import { Field } from '~/components/forms';
import { Button } from '~/components/ui/button';
import { createAccount } from '~/lib/session.server';
import { createToastHeaders } from '~/lib/toast.server';

export const meta: MetaFunction = () => {
  return [{ title: 'Create Account' }];
};

const schema = z
  .object({
    firstName: z.string({ required_error: 'Fist name is required' }),
    lastName: z.string().optional(),
    email: z
      .string({ required_error: 'Email is required' })
      .email()
      .transform((value) => value.toLowerCase().trim()),
    password: z
      .string({ required_error: 'Password is required' })
      .min(4, 'Password must be at least 4 characters'),
    passwordConfirm: z.string()
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ['passwordConfirm']
  });

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = await parseWithZod(formData, { schema });
  if (submission.status !== 'success') {
    return json(submission.reply());
  }

  return createAccount(request, submission.value, {
    headers: await createToastHeaders({
      type: 'success',
      title: 'Welcome to Sublynk!',
      description: 'Check out the onboarding section to get started',
      duration: 8000
    })
  });
}

export default function CreateAccount() {
  return (
    <div className="h-full lg:grid lg:grid-cols-[2fr_3fr]">
      <div className="hidden bg-burnt-sienna-400 bg-gradient-to-bl from-burnt-sienna-400 to-burnt-sienna-500 lg:block"></div>

      <div className="flex h-full items-center justify-center px-5 py-12">
        <div className="mx-auto grid w-full max-w-[420px] gap-6">
          <h1 className="text-center text-3xl font-bold">Create Account</h1>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}

function RegisterForm() {
  const navigation = useNavigation();
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm<z.input<typeof schema>>({
    lastResult
  });

  return (
    <Form className="grid gap-6" method="post" {...getFormProps(form)}>
      <p className="mb-4 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/" className="link">
          Sign in
        </Link>
      </p>

      <div className="flex gap-6">
        <Field
          label="First name"
          inputProps={{
            ...getInputProps(fields.firstName, { type: 'text' }),
            autoComplete: 'given-name'
          }}
          errors={fields.firstName.errors}
        />
        <Field
          label="Last name"
          inputProps={{
            ...getInputProps(fields.lastName, { type: 'text' }),
            autoComplete: 'family-name'
          }}
          errors={fields.lastName.errors}
        />
      </div>

      <Field
        label="Email address"
        inputProps={{
          ...getInputProps(fields.email, { type: 'email' }),
          autoComplete: 'email'
        }}
        errors={fields.email.errors}
      />

      <Field
        label="Password"
        inputProps={{
          ...getInputProps(fields.password, { type: 'password' }),
          autoComplete: 'off'
        }}
        errors={fields.password.errors}
      />

      <Field
        label="Confirm Password"
        inputProps={{
          ...getInputProps(fields.passwordConfirm, { type: 'password' }),
          autoComplete: 'off'
        }}
        errors={fields.passwordConfirm.errors}
      />

      <Button
        type="submit"
        className="w-full"
        isLoading={navigation.state === 'submitting'}
      >
        Sign Up
        <ArrowRight className="size-4" />
      </Button>
    </Form>
  );
}
