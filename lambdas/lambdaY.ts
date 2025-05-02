import { Handler } from "aws-lambda";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const client = new SQSClient({ region: process.env.REGION });

export const handler: Handler = async (event, context) => {
  try {
    console.log("Event: ", JSON.stringify(event));

    for (const record of event.Records) {
      const message = JSON.parse(record.Sns.Message);

     
      if (!message.email) {
        console.log("Message missing email, sending to QueueB");

        const command = new SendMessageCommand({
          QueueUrl: process.env.QUEUE_B_URL,
          MessageBody: JSON.stringify(message),
        });

        await client.send(command);
      } else {
        console.log("Message has email, no action taken");
      }
    }

  } catch (error: any) {
    console.error("Error processing LambdaY:", error);
    throw new Error(JSON.stringify(error));
  }
};

