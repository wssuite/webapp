FROM node:18.10.0-alpine3.16
WORKDIR /app
COPY . .
RUN npm i @angular/cli
RUN npm ci
EXPOSE 4200
CMD ["npm","start"]