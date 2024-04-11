interface HttpRequest extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
  retries?: number;
}
interface HttpResponse {
  data?: unknown;
  request: HttpRequest;
  status: number;
  url: string;
}
export interface HttpClientArgs {
  baseUrl: string;
  fetch?: typeof fetch;
  requestTransformers?: Array<(request: HttpRequest) => Promise<HttpRequest>>;
  retries?: number;
  timeout?: number;
}
type HttpClientRequestBody = FormData | string | object;

export const createServerHttpClient = ({
  baseUrl,
  fetch = global.fetch,
  requestTransformers = [],
  retries = 0,
  timeout = 1000 * 30 // 30 seconds
}: HttpClientArgs) => {
  interface DoRequestArgs {
    body?: HttpClientRequestBody;
    method: string;
    options?: HttpRequest;
    url: string;
  }
  async function doRequest({ body, method, url, options = {} }: DoRequestArgs) {
    let request = {
      ...options
    };

    if (body && !options.body) {
      request.body = JSON.stringify(body);
      request.headers = request.headers || {};
      request.headers['Content-Type'] = 'application/json';
    }

    request = await requestTransformers.reduce((promises, fn) => {
      return promises.then((req) => fn(req));
    }, Promise.resolve(request));

    const controller = new AbortController();
    const timerId = setTimeout(() => controller.abort(), timeout);
    timerId.unref();

    const res = await fetch(`${baseUrl}${url}`, {
      method,
      signal: controller.signal as AbortSignal,
      ...request
    });

    clearTimeout(timerId);

    const response: HttpResponse = {
      request,
      url,
      status: res.status
    };

    const data = await res.text();
    response.data = data; // in case JSON.parse blows up we'll still have the response text
    if (data) {
      try {
        response.data = JSON.parse(data);
        // eslint-disable-next-line no-empty
      } catch (_) {}
    }

    if (!res.ok) {
      throw new ServerHttpError(response);
    }

    return response.data;
  }

  async function doSafeRequest(args: DoRequestArgs) {
    return withRetry(() => doRequest(args), args.options?.retries ?? retries);
  }

  return {
    get: (path: string, options?: HttpRequest) =>
      doSafeRequest({
        options,
        method: 'GET',
        url: path
      }),
    post: (path: string, body?: HttpClientRequestBody, options?: HttpRequest) =>
      doSafeRequest({
        body,
        options,
        method: 'POST',
        url: path
      }),
    put: (path: string, body?: HttpClientRequestBody, options?: HttpRequest) =>
      doSafeRequest({
        body,
        options,
        method: 'PUT',
        url: path
      }),
    patch: (
      path: string,
      body?: HttpClientRequestBody,
      options?: HttpRequest
    ) =>
      doSafeRequest({
        body,
        options,
        method: 'PATCH',
        url: path
      }),
    delete: (path: string, options?: HttpRequest) =>
      doSafeRequest({
        options,
        method: 'DELETE',
        url: path
      })
  };
};

function withRetry<FnType extends () => Promise<any>>(
  fn: FnType,
  retries: number
): Promise<Awaited<ReturnType<FnType>>> {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error: unknown) => {
        if (retries <= 0) {
          return reject(error);
        }

        // Only retry 500-level http responses
        if (!(error instanceof ServerHttpError)) {
          return reject(error);
        }

        if (!error.status || error.status < 500) {
          return reject(error);
        }

        const id = setTimeout(() => {
          withRetry(fn, retries - 1).then(resolve, reject);
        }, 500);
        id.unref();
      });
  });
}

export class ServerHttpError extends Error {
  data: unknown;
  status: number;

  constructor(public response: HttpResponse) {
    const message = `HTTP ${response.status}: ${
      response.request.method
    } - ${toReadableUrl(response.url)}`;
    super(message);
    this.name = 'ServerHttpError';
    this.data = response.data;
    this.status = response.status;
  }

  toString() {
    return `ServerHttpError: ${this.message}`;
  }
}

const UUID_REGEX = new RegExp(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/);
const ENCODED_EMAIL_REGEX = new RegExp(/.+%40.+\..+/);

/**
 * Replace UUID strings with ':uuid'
 * and encoded email strings with `:email`
 */
function toReadableUrl(url: string) {
  return url
    .split('/')
    .map((part) => {
      return part
        .replace(UUID_REGEX, ':uuid')
        .replace(ENCODED_EMAIL_REGEX, ':email');
    })
    .join('/');
}
