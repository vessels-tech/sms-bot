#we may need to make this more generic later...
FROM mongo:3.4.3

RUN apt-get update && apt-get -y install cron

ENV APP_DIR /usr/src/app
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

ENV BACKUP_DIR /backups
RUN mkdir -p ${BACKUP_DIR}

COPY ./ ./

CMD ["/usr/src/app/entrypoint.sh"]
