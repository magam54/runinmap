FROM python:3.9-alpine
COPY . /runinmap_Project
RUN pip install -r /runinmap_Project/requirements.txt
CMD python /runinmap_Project/api.py