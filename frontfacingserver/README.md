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


## Run the server
To run the server there are two options:
    
    1- Locally with python
    2- Docker
 # Locally with python
    Before running the server, the developper needs to install the dependencies:
    To do so follow the tutorial in [1] to install a virtual environment:
    [1] https://medium.com/co-learning-lounge/create-virtual-environment-python-windows-2021-d947c3a3ca78
    Install the requirements: pip install -r requirements.txt
    Run the server: python app.py

 Note: Those instructions were tested on linux, solution for Windows may be different

To verify that the server is running correctly, in the browser go to:
    http://localhost:5000/index

A hello world message will appear 