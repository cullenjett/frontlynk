# Frontlynk

Frontend app built with [Remix](https://remix.run/docs)

## Initial Setup

- Install Node.js v20
  - If you don't have Node.js you can install it with [fnm](https://github.com/Schniz/fnm?tab=readme-ov-file):
    1. `curl -fsSL https://fnm.vercel.app/install | bash`
    2. `fnm install 20`
    3. `fnm default 20`
- Run `npm install` to install local dependencies. If you use the recommended VS Code plugins you'll need these installed for editor integrations to work.
- Setup environment variables: `cp .env.example .env`

## Local Development

```sh
# Run the app
npm run dev
```

```sh
# Run the with docker compose
docker compose up --build
```

```sh
# Run Vitest unit tests
npm test
```

```sh
# Run Playwright E2E tests
npm run test:e2e
```

### Changes

List of changes made to the default Remix/Express template:

- [x] Docker
- [x] Prettier
- [x] [Vitest](https://vitest.dev/)
- [x] Github Actions
- [x] PR template
- [x] ESLint
- [x] [Tailwind](https://tailwindcss.com/)
- [x] [Shadcn UI](https://ui.shadcn.com/)
- [x] [Session Auth](https://remix.run/docs/en/main/utils/sessions)
- [x] [Conform](https://conform.guide/)
- [x] [Playwright](https://playwright.dev/)
- [x] Browser env vars
- [x] Toasts
- [x] Error Boundary
