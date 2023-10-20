FROM node:18.10.0-alpine3.16

WORKDIR /app

COPY ./*.json .
RUN npm i @angular/cli
RUN npm ci

COPY . .

EXPOSE 4200

CMD ["npm", "start"]
