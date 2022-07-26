FROM nginx:1.21.5-alpine
USER root

COPY ./build /usr/share/nginx/html
COPY ./docker/CI/nginx.conf /etc/nginx/nginx.conf

STOPSIGNAL SIGTERM
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
