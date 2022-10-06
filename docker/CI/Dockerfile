FROM nginx:1.21.5-alpine
USER root

COPY ./build /usr/share/nginx/html

# copy .env.template as env to the container
COPY .env.template .env

# install nodejs & npm
RUN apk add --update nodejs
RUN apk add --update npm

# install runtime-env-cra package
RUN npm i -g runtime-env-cra

STOPSIGNAL SIGTERM
EXPOSE 80

CMD ["/bin/sh", "-c", "runtime-env-cra --config-name=/usr/share/nginx/html/runtime-env.js && nginx -g \"daemon off;\""]
