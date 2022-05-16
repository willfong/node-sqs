import * as SQS from "./sqs.mjs";

const delay = (time) => {
	return new Promise((resolve) => setTimeout(resolve, time));
};

// Business Logic
const processMessage = async (body, attributes) => {
	console.log("Processing message...(3 minute sleep)");
	await delay(3 * 60 * 1000);
	const payload = JSON.parse(body);
	console.log(attributes);
	console.log(payload);
	return true;
};

const run = async () => {
	const messages = await SQS.getMessages();

	for (const message of messages) {
		console.log(`MessageID: ${message.id}`);
		SQS.heartbeatStart(message.receiptHandle);
		const result = await processMessage(message.body, message.attributes);
		SQS.heartbeatStop();
		if (result) {
			await SQS.deleteMessage(message.receiptHandle);
		}
	}
};
run();
