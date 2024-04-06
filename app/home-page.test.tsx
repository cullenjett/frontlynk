import { createRemixStub } from '@remix-run/testing';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import Index from '~/routes/_index';

describe('home page', () => {
  test('smoke test', () => {
    const App = createRemixStub([
      {
        path: '/',
        Component: Index
      }
    ]);

    render(<App initialEntries={['/']} />);

    expect(
      screen.getByRole('heading', { name: /Welcome to Remix/i })
    ).toBeInTheDocument();
  });
});
