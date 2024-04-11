import { vi, describe, it, expect } from 'vitest';

import { ServerHttpError, createServerHttpClient } from '~/lib/http.server';

const createFetchMock = (
  response = {},
  status = 200,
  responseOverride?: Response
) => {
  return vi.fn().mockResolvedValue(
    responseOverride ||
      new Response(JSON.stringify(response), {
        status,
        headers: {
          'Content-Type': 'application/json'
        }
      })
  );
};

const setup = (options: any = {}) => {
  const fetch = options.fetch || createFetchMock();
  const http = createServerHttpClient({
    baseUrl: 'http://localhost:3000',
    requestTransformers: [],
    ...options,
    fetch
  });

  return {
    http,
    fetch
  };
};

describe('createServerHttpClient', () => {
  it('appends the given path to the baseUrl', async () => {
    const { http, fetch } = setup();

    await http.get('/api');

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api',
      expect.any(Object)
    );
  });

  it('transforms the request', async () => {
    const getToken = vi.fn().mockResolvedValue('abc');

    const { http, fetch } = setup({
      requestTransformers: [
        async (request: any) => {
          const token = await getToken();
          return {
            ...request,
            headers: {
              ...request.headers,
              authorization: `bearer ${token}`
            }
          };
        }
      ]
    });

    await http.get('/api', { headers: { myHeader: 'myHeaderValue' } });

    expect(getToken).toHaveBeenCalled();

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api',
      expect.objectContaining({
        headers: {
          authorization: 'bearer abc',
          myHeader: 'myHeaderValue'
        }
      })
    );
  });

  it('throws a ServerHttpError on non-200 responses', () => {
    const errorResponse = { errors: { email: ['required'] } };
    const { http } = setup({
      fetch: vi.fn().mockResolvedValue(
        new Response(JSON.stringify(errorResponse), {
          status: 400
        })
      )
    });

    expect.assertions(1);
    return expect(http.get('/foo')).rejects.toEqual(
      new ServerHttpError({
        data: errorResponse,
        request: {},
        status: 400,
        url: '/foo'
      })
    );
  });

  it('does not blow up for empty 204 responses', async () => {
    const { http } = setup({
      fetch: vi.fn().mockResolvedValue(new Response(undefined, { status: 204 }))
    });

    expect.assertions(1);
    const res = await http.get('/foo');

    expect(res).toEqual('');
  });

  it('handles network errors', async () => {
    const error = new Error('failed to fetch');
    const { http } = setup({
      fetch: vi.fn().mockRejectedValue(error)
    });

    expect.assertions(1);
    await expect(http.get('/foo')).rejects.toEqual(error);
  });

  it('can send json in the request', async () => {
    const { http, fetch } = setup();
    const payload = { email: 'test@example.com' };

    await http.post('/api', payload);

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    );
  });

  it('can send custom payloads', async () => {
    const { http, fetch } = setup();
    const payload = new URLSearchParams();
    payload.append('username', 'test@example.com');

    await http.post('/api', undefined, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: payload
    });

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api',
      expect.objectContaining({
        method: 'POST',
        body: payload,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    );
  });

  it('handles html server error responses correctly', async () => {
    const fetchReturningHtmlError = createFetchMock(
      undefined,
      undefined,
      new Response('<html><h1>Unknown server error</h1></html>', {
        status: 500,
        headers: {
          'content-type': 'text/html'
        }
      })
    );
    const { http } = setup({
      fetch: fetchReturningHtmlError
    });

    await expect(http.get('/')).rejects.toEqual(
      new ServerHttpError({
        data: '<html><h1>Unknown server error</h1></html>',
        request: {},
        status: 500,
        url: '/'
      })
    );
  });

  it('will retry 500 responses', async () => {
    const { http, fetch } = setup({
      retries: 1,
      fetch: vi.fn().mockResolvedValue(new Response('kaboom', { status: 500 }))
    });
    expect.assertions(1);
    await http.get('/').catch(() => {});
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('will not retry 400 responses', async () => {
    const { http, fetch } = setup({
      retries: 1,
      fetch: vi.fn().mockResolvedValue(new Response('kaboom', { status: 400 }))
    });
    await http.get('/').catch(() => {});
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('will not retry Errors', async () => {
    const { http, fetch } = setup({
      retries: 1,
      // using a rejected promise to mimic thrown Errors
      fetch: vi.fn().mockRejectedValue(new Error('kaboom'))
    });
    await http.get('/').catch(() => {});
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('can retry an individual request', async () => {
    const { http, fetch } = setup({
      retries: 0, // global retries are disabled
      fetch: vi.fn().mockResolvedValue(new Response('kaboom', { status: 500 }))
    });
    await http.get('/', { retries: 1 }).catch(() => {});
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('has the right error shape', async () => {
    const errorResponse = { error: true };
    const { http } = setup({
      fetch: vi.fn().mockResolvedValue(
        new Response(JSON.stringify(errorResponse), {
          status: 400
        })
      )
    });

    expect.assertions(1);
    try {
      await http.get('/');
    } catch (err) {
      if (err instanceof ServerHttpError) {
        expect(err.data).toEqual(errorResponse);
      }
    }
  });
});
