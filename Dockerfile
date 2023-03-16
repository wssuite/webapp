FROM legraina/bcp
USER root
RUN apt-get --alow-releaseinfo-change update
RUN apt-get install python3-venv
RUN python3 -m venv venv