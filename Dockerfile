FROM python:3.9-alpine
WORKDIR /runinmap_Project
COPY . /runinmap_Project
RUN pip install -r /runinmap_Project/requirements.txt
CMD gunicorn -w 4 -b 0.0.0.0:4000 api:api
