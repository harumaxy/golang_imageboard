FROM golang as builder

WORKDIR /go/src/app
COPY . .

RUN go mod download
RUN CGO_ENABLED=0 go build main.go


FROM alpine
WORKDIR /app
COPY --from=builder /go/src/app/main .
COPY --from=builder /go/src/app/start.sh .
COPY --from=builder /go/src/app/credential.json .

CMD ["/app/start.sh"]