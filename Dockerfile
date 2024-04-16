# Base Node image
FROM node:20-bookworm-slim as base
ENV NODE_ENV production

# Install all node_modules, including dev dependencies
FROM base as deps
WORKDIR /myapp
ADD package.json package-lock.json ./
RUN npm install --include=dev

# Build production node_modules
FROM base as production-deps
WORKDIR /myapp
COPY --from=deps /myapp/node_modules ./node_modules
ADD package.json package-lock.json ./
RUN npm prune --omit=dev

# Build the app
FROM base as build
WORKDIR /myapp
COPY --from=deps /myapp/node_modules ./node_modules
ADD . .
RUN npm run build

# Build the production image with minimal footprint
FROM base
ENV PORT="5173"
ENV NODE_ENV="production"
WORKDIR /myapp
COPY --from=production-deps /myapp/node_modules ./node_modules
COPY --from=build /myapp/build ./build
COPY --from=build /myapp/public ./public
COPY --from=build /myapp/package.json ./package.json
COPY --from=build /myapp/.env.example ./.env
COPY --from=build /myapp/server.js ./server.js
ENTRYPOINT [ "node", "server.js" ]
