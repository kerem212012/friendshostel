FROM alpine:3.19

RUN apk add --no-cache curl

COPY call_api.sh /usr/local/bin/call_api.sh
RUN chmod +x /usr/local/bin/call_api.sh

COPY crontab /etc/crontabs/root

CMD ["crond", "-f", "-l", "2"]
