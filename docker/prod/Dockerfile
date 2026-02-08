ARG GIT_COMMIT=unknown
ARG BUILD_DATE=unknown

FROM node:16.4.2-alpine3.14

ENV APP_VERSION=${GIT_COMMIT} \
    BUILD_DATE=${BUILD_DATE} \
    NODE_OPTIONS="--max-old-space-size=2048"

LABEL maintainer="Jairo Matos da Rocha <jairo@jairomr.com>" \
      org.opencontainers.image.version="${GIT_COMMIT}" \
      org.opencontainers.image.created="${BUILD_DATE}"

RUN apk add --no-cache bash curl tini && \
    mkdir -p /app && \
    chown -R node:node /app

WORKDIR /app/server
USER node

COPY --chown=node:node ./src/server ./
COPY --chown=node:node ./src/client/dist/client /app/client/
COPY --chown=node:node ./src/client/src/assets /app/client/assets/

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "app-cluster.js"]