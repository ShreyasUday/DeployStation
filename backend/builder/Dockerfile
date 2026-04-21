FROM node:20-alpine

RUN apk add --no-cache git

WORKDIR /app

COPY script.sh .
COPY patch.cjs .
RUN chmod +x script.sh

ENTRYPOINT ["./script.sh"]