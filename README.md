## Nurse Scheduler interface

[![Docker Image Version (latest semver)](https://img.shields.io/docker/v/legraina/ns_app_front)](https://hub.docker.com/repository/docker/legraina/ns_app_front/)
[![Docker Image Version (latest semver)](https://img.shields.io/docker/v/legraina/ns_app_scheduler)](https://hub.docker.com/repository/docker/legraina/ns_app_scheduler/)

## Getting started

To clone the git repository, please use the following command:

	 git clone https://github.com/wssuite/webapp.git


## Using docker compose

There are two docker-compose files in this repository:

	docker-compose.yml : for deployment that uses an image pre-build
	docker-compose-dev.yml: for testing reasons during development

Those files prepare the environment ex. creating the network and volumes necessary, for the docker containers to work properly.

To use the docker-compose files, make sure to have docker and docker-compose installed on your computer.

## 1- Using docker-compose-dev.yml
To start the docker containers:

	 docker compose -f docker-compose-dev.yml up -d --build

The -d flag will make the docker containers run in detached mode

The --build flag will make docker compose build the images from the sources specified in docker-compose-dev.yml file.

To stop the docker containers:

	 docker compose -f docker-compose-dev.yml down -v --rmi local

--rmi local deletes all images created locally (not pulled from the internet)

-v deletes all volumes used by docker-compose

It is possible to force recreate the build of a service using the following command:

	 docker compose -f docker-compose-dev.yml up -d --force-recreate --no-deps --build <SERVICE_NAME>

This command is useful to catch the latest changes of the code while developping as the different services need to communicate together.

## 2- Using docker-compose.yml

To start the docker containers:

	 docker compose up -d

The -d flag will make the docker containers run in detached mode

To stop the docker containers:

	 docker compose down -v

-v deletes all volumes used by docker-compose

## The SSL certificate

Our solution uses a self-signed ssl certificate to activate HTTPS.

To update the SSL certificate use the following command

```
(echo CA & echo QC & echo M & echo company & echo section & echo someone & echo happy@example.com) |\
	 openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout front/nginx/ssl/private/nginx-selfsigned.key \
	 -out front/nginx/ssl/certs/nginx-selfsigned.crt
```

Then, the certificate needs to be mounted in the container with a volume at the same path, i.e. /etc/nginx/ssl/...

## Running a single service

The developer can also run a single service if it doesn't depend on other services for example mongodb service

    docker-compose -f docker-compose-dev.yml up mongodb

## Using the application

Head to https://localhost, a default user admin is was created with the credentials:
	 username: admin
	 password: admin

The application allows the admin to create other users.

The first action prompted is to create a hospital profile. In order to do that, the user can either use the format defined in the file template.csv in the api directory, or create an empty profile by entering the profile name.
You can also directly import a problem file like the one (template.txt) also provided in the api directory.

## Application functionalities

The user can then create/modify/delete the following profile components:

1- Skill: Defined by a name

2- Shift: Defined by a name, start time and end time

3- Shift type: Defined by a name, and can have multiple shifts

4- Shift Group: Defined by a name, and can have multiple shifts and shift types

5- Contract: Defined by a name and a set of constraints. Currently, the application supports 11 constraints.

6- Contract Group: Defined by its name, and can include multiple contracts.

7- Nurse: Defined by a name, a username and a set of contracts.

8- Nurse Group: Defined by a name, and can include multiple nurses and multiple contracts and contract groups.

After defining the profile components, the user can then request a schedule generation. Once a schedule is generated or failed to generate, the user can export the definition of the problem passed to the C++ code, export the error if the generation failed or export the schedule in case the generation succeeds.

A generated schedule can always be deleted. The user can also ask for a schedule regeneration by using the button regenerate schedule.

Finally, the user can export/share a profile and he can delete the profile if he is the owner.
