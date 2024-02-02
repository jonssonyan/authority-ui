FROM nginx:1.20-alpine
WORKDIR /app
COPY dist /usr/share/nginx/html/
ENTRYPOINT nginx -g 'daemon off;'