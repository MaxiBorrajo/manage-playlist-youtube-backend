# Etapa 1: build
FROM node:20-slim AS builder
WORKDIR /usr/src/app
COPY package*.json ./
# instala TODO (dev + prod)
RUN yarn install          
COPY . .
# compila TS → dist/
RUN yarn build            

# Etapa 2: producción
FROM node:20-slim AS production
WORKDIR /usr/src/app
COPY package*.json ./
# solo dependencias de producción
RUN yarn install --production   
# copia solo el dist compilado
COPY --from=builder /usr/src/app/dist ./dist   
CMD yarn migration:up --config=/usr/src/app/dist/infrastructure/database/mikroOrm.config.js && yarn start:prod
