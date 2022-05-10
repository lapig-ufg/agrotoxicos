FROM registry.lapig.iesa.ufg.br/lapig-images-prod/app_agrotoxico:base

# Clone app and npm install on server
ENV URL_TO_APPLICATION_GITHUB="https://github.com/lapig-ufg/agrotoxicos.git"
ENV BRANCH="main"

LABEL maintainer="Renato Gomes <renatogomessilverio@gmail.com>"

RUN cd /APP && git clone -b ${BRANCH} ${URL_TO_APPLICATION_GITHUB}

ADD ./src/server/node_modules /APP/agrotoxicos/src/server   
ADD ./src/client/dist/client /APP/agrotoxicos/src/client/dist/client

CMD [ "/bin/bash", "-c", "/APP/src/server/prod-start.sh; tail -f /dev/null"]

ENTRYPOINT [ "/APP/Monitora.sh"]
