FROM registry.lapig.iesa.ufg.br/lapig-images-homol/app_agrotoxico:base

# Clone app and npm install on server
ENV URL_TO_APPLICATION_GITHUB="https://github.com/lapig-ufg/agrotoxicos.git"
ENV BRANCH="develop"

LABEL maintainer="Renato Gomes <renatogomessilverio@gmail.com>"

RUN if [ -d "/APP/agrotoxicos" ]; then rm -Rf /APP/agrotoxicos; fi  && \
    cd /APP && git clone -b ${BRANCH} ${URL_TO_APPLICATION_GITHUB}
    
ADD ./src/client/dist/client /APP/agrotoxicos/src/client/dist/client

CMD [ "/bin/bash", "-c", "/APP/src/server/prod-start.sh; tail -f /dev/null"]

ENTRYPOINT [ "/APP/Monitora.sh"]
