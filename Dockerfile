FROM nginx

WORKDIR /www/wwwroot/106.53.173.123/user-management-center/user-management-center-frontend/
USER root

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf

###将打包的文件拷贝到nginx默认的静态文件存放处
#COPY ./dist  /usr/share/nginx/html/
###自定义打包的文件位置
COPY ./dist  /www/wwwroot/106.53.173.123/user-management-center/user-management-center-frontend/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
