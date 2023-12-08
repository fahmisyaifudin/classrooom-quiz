FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
RUN npm install -g ts-node

COPY . .

EXPOSE 9000

CMD ["ts-node", "./src/index.ts"]