import {
  useForm,
  getInputProps,
  getFormProps,
  getSelectProps
} from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs, json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { ArrowRight } from 'lucide-react';
import { z } from 'zod';

import { Field, SelectField, StateSelectField } from '~/components/forms';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { redirectWithToast } from '~/lib/toast.server';

const schema = z.object({
  businessName: z.string(),
  line1: z.string(),
  line2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  phoneType: z.string(),
  phoneNumber: z.string()
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = await parseWithZod(formData, { schema });
  if (submission.status !== 'success') {
    return json(submission.reply());
  }

  return redirectWithToast('/dashboard', {
    title: 'Onboarding complete',
    type: 'success'
  });
}

export default function Onboarding() {
  return (
    <div>
      <header className="h-[4.75rem] border-b bg-background">
        <div className="container"></div>
      </header>

      <main className="min-h-full bg-muted">
        <div className="container grid gap-8 py-12">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-muted-foreground">Lorem ipsum dolor sit amet</p>
          </div>

          <Card className="mx-auto grid w-full max-w-[560px] gap-8">
            <OnboardingForm />
          </Card>
        </div>
      </main>
    </div>
  );
}

function OnboardingForm() {
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm<z.input<typeof schema>>({
    lastResult
  });

  return (
    <Form method="post" {...getFormProps(form)}>
      <Group title="Business Information">
        <Field
          label="Business name"
          inputProps={{
            ...getInputProps(fields.businessName, { type: 'text' }),
            autoComplete: 'organization'
          }}
          errors={fields.businessName.errors}
        />
      </Group>

      <Group title="Address">
        <Field
          label="Address line 1"
          inputProps={{
            ...getInputProps(fields.line1, { type: 'text' }),
            autoComplete: 'address-line1'
          }}
          errors={fields.line1.errors}
        />
        <Field
          label="Address line 2"
          inputProps={{
            ...getInputProps(fields.line2, { type: 'text' }),
            autoComplete: 'address-line2'
          }}
          errors={fields.line2.errors}
        />

        <Field
          label="City"
          inputProps={{
            ...getInputProps(fields.city, { type: 'text' }),
            autoComplete: 'address-level2'
          }}
          errors={fields.city.errors}
        />
        <div className="grid grid-cols-[1fr_auto] gap-4">
          <StateSelectField
            label="State"
            selectProps={{
              ...getSelectProps(fields.state),
              autoComplete: 'address-level1'
            }}
            errors={fields.state.errors}
          />
          <Field
            label="ZIP"
            inputProps={{
              ...getInputProps(fields.postalCode, { type: 'text' }),
              autoComplete: 'postal-code',
              className: 'w-32'
            }}
            errors={fields.postalCode.errors}
          />
        </div>
      </Group>

      <Group title="Contact">
        <div className="grid grid-cols-[auto_1fr] gap-4">
          <SelectField
            label="Phone type"
            selectProps={{
              ...getSelectProps(fields.phoneType),
              autoComplete: 'off',
              className: 'w-32'
            }}
            options={[
              { label: 'Mobile', value: 'mobile' },
              { label: 'Office', value: 'office' }
            ]}
            errors={fields.phoneType.errors}
          />
          <Field
            label="Phone number"
            inputProps={{
              ...getInputProps(fields.phoneNumber, { type: 'tel' }),
              autoComplete: 'tel-national'
            }}
            errors={fields.phoneNumber.errors}
          />
        </div>
      </Group>

      <Button type="submit" className="w-full">
        Next
        <ArrowRight className="size-4" />
      </Button>
    </Form>
  );
}

function Group({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-12 grid gap-4">
      <h2 className="mb-2 text-xl font-bold">{title}</h2>
      {children}
    </div>
  );
}
