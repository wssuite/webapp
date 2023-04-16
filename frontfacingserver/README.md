# Front Facing server

## Install dependencies
To install the dependencies used in this server use the following command:

     pip install -r requirements.txt

## Automatic tests

Some tests are developped for the server. The tests use mongomock to emulate MongoDB and pyfakefs to emulate a filesystem.

To run the tests use the following command:

     pytest .

You can also run the coverage using the following commands:
    
     coverage run -m pytest .
     coverage report -m

Note: the tests were developped using Unix, some tests related to the filesystem can fail on Windows because of the differences in the filsystem annotation.
