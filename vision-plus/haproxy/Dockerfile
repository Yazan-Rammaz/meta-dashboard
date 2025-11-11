FROM haproxy:2.6-alpine

USER root
RUN apk update && apk add --no-cache lua5.3 lua5.3-socket curl

RUN mkdir -p /usr/local/share/lua/5.3
RUN curl -s https://raw.githubusercontent.com/haproxytech/haproxy-lua-http/master/http.lua > /usr/local/share/lua/5.3/http.lua
RUN curl -s https://raw.githubusercontent.com/rxi/json.lua/master/json.lua > /usr/local/share/lua/5.3/json.lua

COPY haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg
COPY lua /usr/local/etc/haproxy/lua/

# HAProxy will run with its default command
