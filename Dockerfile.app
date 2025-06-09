FROM node:22-alpine AS build

WORKDIR /app

  

COPY package.json package-lock.json ./

  

RUN npm install && npm install -g @nestjs/cli

  

COPY . .

  

RUN npx nest build

  

FROM node:22-alpine

WORKDIR /app

  

COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/dist ./dist

COPY --from=build /app/prisma ./prisma

COPY --from=build /app/package.json ./

  

RUN apk add --no-cache postgresql-client && npx prisma generate

  

EXPOSE 4000

  

CMD ["sh", "-c", "npx nest build && node dist/main.js"]