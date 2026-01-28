FROM node:24
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src ./src
CMD ["npm", "run", "dev"]