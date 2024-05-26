WORKDIR /app

COPY . .

RUN go mod tidy
RUN go build

EXPOSE 8080

RUN chmod +x ./ftl-api
CMD [ "./ftl-api" ]
