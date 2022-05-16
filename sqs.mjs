// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/sqs-examples-send-receive-messages.html
import {
	SQSClient,
	SendMessageCommand,
	ReceiveMessageCommand,
	DeleteMessageCommand,
	ChangeMessageVisibilityCommand,
} from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({ region: process.env.AWS_REGION });

const queueURL = process.env.AWS_SQS_URL;

export const sendTask = async (taskName, payload) => {
	const params = {
		DelaySeconds: 10,
		MessageAttributes: {
			taskName: { DataType: "String", StringValue: taskName },
		},
		MessageBody: JSON.stringify(payload),
		QueueUrl: process.env.AWS_SQS_URL,
	};
	try {
		const data = await sqsClient.send(new SendMessageCommand(params));
		console.log("Success, message sent. MessageID:", data.MessageId);
		return data;
	} catch (err) {
		console.log("Error", err);
	}
};

export const deleteMessage = async (ReceiptHandle) => {
	var deleteParams = {
		QueueUrl: queueURL,
		ReceiptHandle,
	};
	try {
		const data = await sqsClient.send(new DeleteMessageCommand(deleteParams));
		console.log("Message deleted");
	} catch (err) {
		console.log("Error", err);
	}
};

const filterAttributes = (attributes) => {
	let ret = {};
	Object.keys(attributes).map((a) => {
		ret[a] = attributes[a].StringValue;
	});
	return ret;
};

export const getMessages = async () => {
	const params = {
		AttributeNames: ["SentTimestamp"],
		MaxNumberOfMessages: 1,
		MessageAttributeNames: ["All"],
		QueueUrl: queueURL,
		VisibilityTimeout: 20,
		WaitTimeSeconds: 0,
	};
	try {
		const data = await sqsClient.send(new ReceiveMessageCommand(params));
		if (data.Messages) {
			console.log(`Received messages: [${data.Messages.length}]`);
			return data.Messages.map((message) => {
				return {
					id: message.MessageId,
					receiptHandle: message.ReceiptHandle,
					body: message.Body,
					attributes: filterAttributes(message.MessageAttributes),
				};
			});
		} else {
			console.log("No messages to process");
			return [];
		}
	} catch (err) {
		console.log("Receive Error", err);
		return false;
	}
};

let hb;
let hbct = 0;

const HEARTBEAT_SECONDS = 60;
const EXTEND_VISIBILITY_SECONDS = 120;

// https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html
const heartbeat = async (ReceiptHandle) => {
	clearTimeout(hb);
	hbct = hbct + 1;
	console.log(`    Heartbeat: ${hbct}`);
	await extendVisibility(ReceiptHandle);
	hb = setTimeout(heartbeat.bind(this, ReceiptHandle), HEARTBEAT_SECONDS * 1000);
};

const extendVisibility = async (ReceiptHandle) => {
	var params = {
		QueueUrl: queueURL,
		ReceiptHandle,
		VisibilityTimeout: EXTEND_VISIBILITY_SECONDS,
	};
	await sqsClient.send(new ChangeMessageVisibilityCommand(params));
};

export const heartbeatStart = (ReceiptHandle) => {
	heartbeat(ReceiptHandle);
};

export const heartbeatStop = () => {
	clearTimeout(hb);
};
