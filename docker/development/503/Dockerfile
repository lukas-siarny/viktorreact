FROM nginx:1.21.5-alpine
USER root

COPY ./build/503 /usr/share/nginx/html
COPY ./docker/development/503/nginx.conf /etc/nginx

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]
