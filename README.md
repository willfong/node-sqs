# POC: Node + SQS

Just a little toolkit/boilerplate to demonstrate using Node and AWS SQS.

## Set up

You'll need a `.env`:

```
AWS_REGION=us-east-1
AWS_SQS_URL=https://sqs.us-east-1.amazonaws.com/123456789/example-queue
```

## Publishing a message

`yarn publisher`

## Consuming the message

`yarn consumer`
