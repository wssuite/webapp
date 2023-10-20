FROM node:20
USER root
RUN apt-get update && \
    apt-get install nginx curl python3 python3-venv -y && \
    python3 -m venv /venv

# install packages
RUN mkdir /fe
COPY front-end-application/*.json /fe/
RUN cd /fe && npm ci

RUN mkdir /ffs
COPY frontfacingserver/requirements.txt /ffs/
RUN cd /ffs && /venv/bin/pip install -r requirements.txt

# copy sources
COPY front-end-application/src/ /fe/src/

COPY frontfacingserver/src/ /ffs/src/
COPY frontfacingserver/config.json /ffs/
COPY frontfacingserver/template.csv /ffs/
RUN echo '{"mongo_address" : "mongo", "haproxy_address": "haproxy"}' > /ffs/config.json
COPY frontfacingserver/*.py /ffs/

EXPOSE 80 443 4200 5000
