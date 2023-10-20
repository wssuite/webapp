FROM legraina/nurse-scheduler:master

USER root
RUN apt-get --allow-releaseinfo-change update && \
    apt-get install cpulimit python3-venv -y && \
    python3 -m venv /venv && \
    /venv/bin/pip install Flask requests

COPY . /invoker/.

# Set the working directory
WORKDIR /invoker/
RUN cp -r /home/dantzig/ns/bin /invoker/.

# Entrypoint for the invoker
ENTRYPOINT [ "/venv/bin/python", "app.py" ]

EXPOSE 5000
