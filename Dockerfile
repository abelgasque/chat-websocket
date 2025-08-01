FROM node:23 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

FROM node:23-slim

WORKDIR /app

COPY --from=builder /app .

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

EXPOSE 9090

CMD ["node", "src/index.js"]