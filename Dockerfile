FROM legraina/nurse-scheduler
USER root
RUN apt-get --allow-releaseinfo-change update
RUN apt-get update
RUN apt-get install python3-venv -y
RUN python3 -m venv /venv
RUN /venv/bin/pip install Flask
RUN /venv/bin/pip install requests
RUN mkdir /invoker
COPY . /invoker/.
EXPOSE 5000