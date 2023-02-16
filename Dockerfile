FROM markbekhet/horaire-infirmiere:base-image-v2
COPY nginx/sites-available /etc/nginx/sites-available
WORKDIR /app
COPY dataset/ dataset/
COPY src/ src/
COPY requirements.txt requirements.txt
COPY *.py /app/
RUN /venv/bin/pip install -r requirements.txt
