FROM markbekhet/horaire-infirmiere:base-image-v3
USER root
COPY nginx/sites-available /etc/nginx/sites-available
RUN mkdir /fe
COPY front-end-application/src/ /fe/src/
COPY front-end-application/*.json /fe/
RUN cd fe && npm ci

EXPOSE 4200
RUN mkdir /ffs
COPY frontfacingserver/src/ /ffs/src/
COPY frontfacingserver/requirements.txt /ffs/
COPY frontfacingserver/config.json /ffs/
RUN echo '{"mongo_address" : "192.168.5.4", "haproxy_address": "192.168.5.5"}' > /ffs/config.json
COPY frontfacingserver/*.py /ffs/
RUN cd /ffs && /venv/bin/pip install -r requirements.txt
EXPOSE 5000