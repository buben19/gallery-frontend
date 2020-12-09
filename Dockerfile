FROM nginx
LABEL maintainere="Ivo Slanina <ivo.slanina@gmail.com>"

EXPOSE 80
WORKDIR /app

COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/gallery-frontened /app
