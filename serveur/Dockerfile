# Serveur Appui : PocketBase (comptes, base de données, API, admin) + site (page publique et outil).
FROM alpine:3.20
ARG PB_VERSION=0.40.5
ARG PB_SHA256=1dbea1b01eb3dfe64953513859d01e759c96650c4e3264fa4eecd54b769382e4
RUN apk add --no-cache ca-certificates unzip wget tzdata \
 && wget -q https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip -O /tmp/pb.zip \
 && if [ -n "$PB_SHA256" ]; then echo "$PB_SHA256  /tmp/pb.zip" | sha256sum -c -; fi \
 && unzip /tmp/pb.zip -d /pb && rm /tmp/pb.zip
ENV TZ=Europe/Zurich
COPY serveur/pb_migrations /pb/pb_migrations
COPY serveur/pb_hooks /pb/pb_hooks
COPY site /pb/pb_public
EXPOSE 8090
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data", "--publicDir=/pb/pb_public", "--migrationsDir=/pb/pb_migrations", "--hooksDir=/pb/pb_hooks"]
