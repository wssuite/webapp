FROM markbekhet/horaire-infirmiere:base-image-v2
USER root
COPY nginx/sites-available /etc/nginx/sites-available
RUN mkdir /fe
COPY front-end-application/src/ /fe/src/
COPY front-end-application/*.json /fe/
RUN cd fe && npm ci

EXPOSE 4200
RUN mkdir /ffs
COPY frontfacingserver/dataset/ /ffs/dataset/
COPY frontfacingserver/src/ /ffs/src/
COPY frontfacingserver/requirements.txt /ffs/
COPY frontfacingserver/*.py /ffs/
RUN cd /ffs && /venv/bin/pip install -r requirements.txt
EXPOSE 5000