FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
RUN apk add --no-cache postgresql-client
COPY prisma/schema.prisma prisma/schema.prisma
COPY . .
CMD ["npm", "run", "start"]
EXPOSE 4000