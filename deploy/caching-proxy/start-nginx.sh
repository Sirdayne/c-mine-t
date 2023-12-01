#!/bin/sh

# nginx-confgen -i /etc/nginx.conf.tpl -o /etc/nginx.conf
# ln -sf /dev/stdout /var/log/nginx/access.log
# ln -sf /dev/stderr /var/log/nginx/error.log

exec nginx
