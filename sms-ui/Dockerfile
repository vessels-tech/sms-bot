FROM node:6.10

ENV APP_DIR /usr/src/app
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

RUN npm install -g nodemon

COPY package.json ./
RUN npm install

COPY ./ ./

EXPOSE 3002

RUN npm run build

CMD ["./entrypoint.sh"]
