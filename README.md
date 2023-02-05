# Front Facing server

## Project structure

For this project, the source code of the functionalities
is in the src directory and the test directory contains all different tests.

There is an empty __init__.py file in each directory containing test classes.
That helps pytest discover all test files and to run all the tests.

## For Gitlab docker containers
To build an image:
    docker build -t registry.gitlab.com/polytechnique-montr-al/log89xx/23-1/equipe-10/frontfacingserver:<TAG> .

To push an image:
    docker push registry.gitlab.com/polytechnique-montr-al/log89xx/23-1/equipe-10/frontfacingserver:<TAG>
