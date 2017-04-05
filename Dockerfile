FROM node:latest

# app directory
ENV APP_DIR /usr/src/app
ENV TOKEN .

RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

# install pm2 first
RUN npm i -g pm2

# install app dependencies
ADD src/package.json ./
RUN npm install

# add the rest of the files
ADD src/ ./
ADD processes.json ./

EXPOSE 3000

CMD ["pm2", "start", "processes.json", "--no-daemon"]