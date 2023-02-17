## LOG89xx-10

## Getting started

To clone the git repository including all the subdirectories please use the following command:

	 git clone --recurse-submodules https://gitlab.com/polytechnique-montr-al/log89xx/23-1/equipe-10/LOG89XX-10.git

To get the submodules as they were with the branch in use, use the following command:

	 git submodule update --init

## Using docker-compose

There are two docker-compose files in this repository:
	- docker-compose.yml : for deployment that uses an image pre-build
	- docker-compose-dev.yml: for testing reasons during development

Those files prepare the environment ex. creating the network and volumes necessary,
for the docker containers to work properly.

To use the docker-compose file, make sure to have docker and docker-compose installed on your computer.

To start the docker containers:
	 docker-compose -f <docker-compose-filename> up -d --build

To stop the docker containers:
	 docker-compose -f <docker-compose-filename> down -v --rmi local


Note: with docker-compose-dev.yml the images will be built each time that you launch docker-compose.
That may take time.

## Concerning the Dockerfiles in the gitsubmodules
The dockerfile is currently built on a custom made docker image: 
markbekhet/horaire-infirmiere:base-image-v2

This image has nginx, openssl, python3 , node18.x installed and it has a self signed ssl certificate.

The ssl certificate is good for one year, starting from 14/02/2023.

In order for the deployment to work correctly, the ssl certificate must be updated before 14/02/2023 and
a new image should be created to be used

To update the ssl certaficate use the following commands:

	docker run -dit --name container markbekhet/horaire-infirmiere:base-image-v2
	docker exec -it container bash
	(echo CA & echo QC & echo M & echo company & echo section & echo someone & echo happy@example.com) |\
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key \
	-out /etc/ssl/certs/nginx-selfsigned.crt
	exit
	docker commit container <NEW_IMAGE_NAME>:<TAG>
	(optionnal) docker push <NEW_IMAGE_NAME>:<TAG>

After those commands, update the Dockerfile to use new image and the https protocol will be used.

## Front-end Development
For the front-end development, AKA the gitmodule front-end-application, the developpers may need to restart
only the web-app service, for this
use the following command:
	docker-compose -f docker-compose-dev.yml up -d --force-recreate --no-deps --build frontfacingserver_webapp
