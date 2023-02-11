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
	 docker-compose -f <docker-compose-filename> up -d

To stop the docker containers:
	 docker-compose -f <docker-compose-filename> down -v --rmi local


Note: with docker-compose-dev.yml the images will be built each time that you launch docker-compose.
That may take time.
