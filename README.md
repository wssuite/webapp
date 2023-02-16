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
    Create a virtual env: python3 -m virtualenv ~/venv
    Activate the virtual environment: source ~/venv/bin/activate
    Install the requirements: pip install -r requirements.txt
    Run the server: python app.py

 Note: Those instructions were tested on linux, solution for Windows may be different

 # Docker
    docker build -t frontserver .
    docker run --rm -p 5000:5000 -v dataset:/app/dataset --name server frontserver

To verify that the server is running correctly, in the browser go to:
    http://localhost:5000/index

A hello world message will appear 