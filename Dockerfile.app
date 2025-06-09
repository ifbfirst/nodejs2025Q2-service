FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --omit=dev @nestjs/cli

FROM node:22-alpine
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY . .

RUN apk add --no-cache postgresql-client && npx prisma generate && rm -rf /root/.npm /root/.cache /app/.cache

EXPOSE 4000
CMD ["node", "dist/main.js"]
