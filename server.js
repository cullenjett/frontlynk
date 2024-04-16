import { createRequestHandler } from '@remix-run/express';
import { installGlobals } from '@remix-run/node';
import closeWithGrace from 'close-with-grace';
import compression from 'compression';
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';

installGlobals();

const app = express();

app.use(compression());
app.disable('x-powered-by');

const viteDevServer =
  process.env.NODE_ENV === 'production'
    ? undefined
    : await import('vite').then((vite) =>
        vite.createServer({
          server: { middlewareMode: true }
        })
      );

if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  app.use(
    '/assets',
    express.static('build/client/assets', { immutable: true, maxAge: '1y' })
  );
}

app.use(express.static('build/client', { maxAge: '1h' }));
app.use(morgan('tiny'));

const remixHandler = createRequestHandler({
  build: viteDevServer
    ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
    : await import('./build/server/index.js')
});
app.all('*', remixHandler);

const port = process.env.PORT || 5173;
const server = app.listen(port, () =>
  console.log(`Express server listening at http://localhost:${port}`)
);

closeWithGrace(async () => {
  await new Promise((resolve, reject) => {
    server.close((e) => (e ? reject(e) : resolve('ok')));
  });
});
