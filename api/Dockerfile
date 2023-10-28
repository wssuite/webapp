FROM python:3.10

WORKDIR /app

# install packages
COPY requirements.txt ./app/
RUN cd app && pip install -r requirements.txt

# copy sources
COPY ./src/ /app/src/
COPY ./config.json /app/
COPY ./template.csv /app/
RUN echo '{"mongo_address" : "mongo", "haproxy_address": "haproxy"}' > /app/config.json
COPY ./*.py /app/

EXPOSE 5000

CMD ["python","app.py"]
