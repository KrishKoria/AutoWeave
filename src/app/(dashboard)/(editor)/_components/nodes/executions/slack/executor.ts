import Handlebars from "handlebars";
import type { NodeExecutor } from "@/inngest/types";
import { NonRetriableError } from "inngest";
import ky from "ky";
import { slackChannel } from "@/inngest/channels";

type SlackData = {
  webhookUrl?: string;
  message?: string;
  channel?: string;
  username?: string;
  variable?: string;
};

// Register json helper for {{json variable}} syntax
Handlebars.registerHelper("json", function (context) {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

export const SlackExecutor: NodeExecutor<SlackData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    slackChannel().status({
      nodeId: nodeId,
      status: "loading",
    })
  );

  try {
    const result = await step.run("Send Slack Message", async () => {
      // Validate required fields
      if (!data.webhookUrl) {
        throw new NonRetriableError("Slack Node: No webhook URL configured");
      }
      if (!data.message) {
        throw new NonRetriableError("Slack Node: No message content provided");
      }
      if (!data.variable) {
        throw new NonRetriableError("Slack Node: No variable name provided");
      }

      // Compile Handlebars templates with workflow context
      const webhookUrl = Handlebars.compile(data.webhookUrl)(context);
      const messageContent = Handlebars.compile(data.message)(context);

      // Build Slack webhook payload (uses "text" instead of "content")
      const payload: { text: string; channel?: string; username?: string } = {
        text: messageContent,
      };

      // Optionally compile channel if provided
      if (data.channel) {
        payload.channel = Handlebars.compile(data.channel)(context);
      }

      // Optionally compile username if provided
      if (data.username) {
        payload.username = Handlebars.compile(data.username)(context);
      }

      // Send to Slack webhook
      const response = await ky.post(webhookUrl, {
        json: payload,
      });

      // Return response info in context
      return {
        ...context,
        [data.variable]: {
          status: response.status,
          statusText: response.statusText,
          success: response.ok,
        },
      };
    });

    await publish(
      slackChannel().status({
        nodeId: nodeId,
        status: "success",
      })
    );

    return result;
  } catch (error) {
    await publish(
      slackChannel().status({
        nodeId: nodeId,
        status: "error",
      })
    );
    throw error;
  }
};
