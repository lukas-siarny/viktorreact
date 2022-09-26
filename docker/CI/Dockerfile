FROM nginx:1.21.5-alpine
USER root

COPY ./build /usr/share/nginx/html

# copy .env to the container
COPY .env .env

# install nodejs & npm
RUN apk add --update nodejs
RUN apk add --update npm

# install runtime-env-cra package
RUN npm i -g runtime-env-cra

STOPSIGNAL SIGTERM
EXPOSE 80

CMD ["/bin/sh", "-c", "runtime-env-cra && nginx -g \"daemon off;\""]
