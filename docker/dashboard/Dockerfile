FROM nginx:1.27-alpine
RUN apk add --no-cache apache2-utils
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY 10-htpasswd.sh /docker-entrypoint.d/10-htpasswd.sh
COPY site/ /usr/share/nginx/html/
RUN chmod +x /docker-entrypoint.d/10-htpasswd.sh
