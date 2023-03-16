FROM legraina/bcp
USER root
RUN apt-get --allow-releaseinfo-change update
RUN apt-get install python3-venv
RUN python3 -m venv venv
RUN mkdir invoker
COPY . invoker/.
RUN cd invoker && /venv/bin/pip install -r requirements.txt
EXPOSE 5000