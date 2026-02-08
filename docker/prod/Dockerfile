FROM lapig/app_agrotoxico:base

ARG GIT_COMMIT=unknown
ARG BUILD_DATE=unknown

LABEL maintainer="Jairo Matos da Rocha <jairo@jairomr.com>" \
      org.opencontainers.image.version="${GIT_COMMIT}" \
      org.opencontainers.image.created="${BUILD_DATE}"

RUN apt-get -qq update --fix-missing && \
    apt-get -qq --yes upgrade && \
    groupadd -r -g 1000 appuser && \
    useradd -r -g appuser -u 1000 -m -s /bin/bash appuser && \
    mkdir -p /app  && \
    chown -R appuser:appuser /app 
WORKDIR /app

ENV APP_VERSION=${GIT_COMMIT} \
    BUILD_DATE=${BUILD_DATE}

COPY --chown=appuser:appuser ./src/server /app/server/
COPY --chown=appuser:appuser ./src/client/dist/client /app/client/
COPY --chown=appuser:appuser ./src/client/src/assets /app/client/assets/

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', \
        (r) => process.exit(r.statusCode === 200 ? 0 : 1))" || exit 1

CMD [ "/bin/bash", "-c", "/usr/local/bin/node /app/agrotoxicos/src/server/app-cluster.js"]

