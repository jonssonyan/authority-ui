FROM nginx:1.20-alpine
LABEL maintainer="jonsosnyan <yz808@outlook.com>"
RUN mkdir -p /authortiy/
WORKDIR /authortiy/
ENV TZ=Asia/Shanghai
COPY dist/ .
ENTRYPOINT nginx -g 'daemon off;'