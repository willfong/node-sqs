# POC: Node + SQS

Just a little toolkit/boilerplate to demonstrate using Node and AWS SQS.

## How Queues Work

1. A publisher service publishes a message to SQS
1. A consumer service polls SQS and consumes available messages

## Message Visibility

1. When a consumer takes a message, SQS will hold on to the message, but not make it available to another consumer until `VisibilityTimeout` has expired
1. After the consumer has finished processing the message, it must delete the message in SQS. If it doesn't, SQS will give the message to another consumer (defined by `VisibilityTimeout`)
1. If the consumer has crashed, the `VisibilityTimeout` will expire for that message in SQS, and SQS will assign the message to another consumer
1. If the consumer requires more time to process the message, it must extend the `VisibilityTimeout`

## Set up

You'll need an `.env`:

```
AWS_REGION=us-east-1
AWS_SQS_URL=https://sqs.us-east-1.amazonaws.com/123456789/example-queue
```

## Publishing a message

`yarn publisher`

## Consuming the message

`yarn consumer`

## Useful Links

1. https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/index.html
1. https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/sqs-examples.html
1. https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html
