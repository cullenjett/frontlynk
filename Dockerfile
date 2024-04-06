# base node image
FROM node:20-bookworm-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /frontlynk

ADD package.json package-lock.json ./
RUN npm install --include=dev

# Setup production node_modules
FROM base as production-deps

WORKDIR /frontlynk

COPY --from=deps /frontlynk/node_modules ./node_modules
ADD package.json package-lock.json ./
RUN npm prune --omit=dev

# Build the app
FROM base as build

WORKDIR /frontlynk

COPY --from=deps /frontlynk/node_modules ./node_modules

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

ENV PORT="3000"
ENV NODE_ENV="production"

WORKDIR /frontlynk

COPY --from=production-deps /frontlynk/node_modules ./node_modules

COPY --from=build /frontlynk/build ./build
COPY --from=build /frontlynk/public ./public
COPY --from=build /frontlynk/package.json ./package.json
COPY --from=build /frontlynk/server.js ./server.js
COPY --from=build /frontlynk/start.sh ./start.sh

ENTRYPOINT [ "./start.sh" ]
