# use a node image as the base image and name it 'build' for
# later reference
FROM node:20-alpine as build

# set the working directory to /app
WORKDIR /app

# copy the current configuration into the container at /app
COPY ./*.json .
# install dependencies, matching package-lock.json
RUN npm ci

# copy the current sources contents into the container at /app
COPY ./src/ ./src/
# build the app
RUN npm run build


# Use the latest version of the official Nginx image as the base image
FROM nginx:latest

# copy the built application from the build stage to the nginx html
# directory
COPY --from=build /app/dist/angular-app /usr/share/nginx/html

# copy the custom nginx configuration file to the container in the default
# location
COPY ./nginx/ /etc/nginx/
COPY ./nginx/sites-available/default /etc/nginx/conf.d/default.conf

EXPOSE 80 443

# The above commands build the Angular app and then configure and build a
# Docker image for serving it using the nginx web server.
