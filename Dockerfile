FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci
COPY src ./src
RUN npm run build

FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

RUN mkdir -p /db && \
    chown -R node:node /db && \
    chown -R node:node /app

VOLUME ["/db"]

ENV NODE_ENV=production

USER node

CMD ["node", "dist/index.js"]