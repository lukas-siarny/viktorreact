FROM node:18.15.0
USER root

WORKDIR /frontend

COPY . .
# copy .env.template as env to the container
COPY .env.template .env

# # install nodejs & npm
RUN apt update
RUN apt install nginx -y

# # install runtime-env-cra package
RUN npm i -g runtime-env-cra

RUN npm install --legacy-peer-deps
RUN npm run prebuild
RUN CI=false GENERATE_SOURCEMAP=false npm run build:coverage

RUN mv ./build/* /usr/share/nginx/html

STOPSIGNAL SIGTERM
EXPOSE 80

CMD ["/bin/sh", "-c", "runtime-env-cra --config-name=/usr/share/nginx/html/runtime-env.js && nginx -g \"daemon off;\""]
