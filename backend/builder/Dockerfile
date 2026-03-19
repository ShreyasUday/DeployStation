FROM node:20-alpine

RUN apk add --no-cache git

WORKDIR /app

COPY script.sh .
RUN chmod +x script.sh

ENTRYPOINT ["./script.sh"]