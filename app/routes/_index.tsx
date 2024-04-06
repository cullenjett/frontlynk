import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' }
  ];
};

export default function Index() {
  return (
    <div className="max-w-screen-xl m-auto p-4">
      <h1 className="text-4xl font-extrabold mb-4">Welcome to Remix</h1>
      <ul className="list-disc pl-4 leading-8">
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
            className="underline"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
            className="underline"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/docs"
            rel="noreferrer"
            className="underline"
          >
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
