FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/
COPY .env ./
COPY tsconfig.json ./
COPY . .

RUN npm install

EXPOSE 3082

CMD [ "npm", "run", "dev" ]
