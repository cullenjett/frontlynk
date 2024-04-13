import { installGlobals } from '@remix-run/node';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import 'dotenv/config';
import { afterEach } from 'vitest';

import '~/lib/env.server';

installGlobals();

afterEach(() => cleanup());
