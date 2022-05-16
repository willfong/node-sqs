import * as SQS from "./sqs.mjs";

const run = async () => {
	let r = (Math.random() + 1).toString(36).substring(7);
	const payload = { name: r, email: `${r}@example.com` };
	await SQS.sendTask("createNewUser", payload);
};
run();
