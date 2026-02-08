FROM lapig/app_agrotoxico:base

ARG GIT_COMMIT=unknown
ARG BUILD_DATE=unknown

LABEL maintainer="Jairo Matos da Rocha <jairo@jairomr.com>" \
      org.opencontainers.image.version="${GIT_COMMIT}" \
      org.opencontainers.image.created="${BUILD_DATE}"

RUN mkdir -p /app && \
    chown -R node:node /app

WORKDIR /app

ENV APP_VERSION=${GIT_COMMIT} \
    BUILD_DATE=${BUILD_DATE} \
    NODE_ENV=production

COPY --chown=node:node ./src/server /app/server/
COPY --chown=node:node ./src/client/dist/client /app/client/
COPY --chown=node:node ./src/client/src/assets /app/client/assets/

USER node

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', \
        (r) => process.exit(r.statusCode === 200 ? 0 : 1))" || exit 1

CMD ["node", "/app/server/app-cluster.js"]