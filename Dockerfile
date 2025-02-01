FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY .env .env

RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node dist/index.js"]