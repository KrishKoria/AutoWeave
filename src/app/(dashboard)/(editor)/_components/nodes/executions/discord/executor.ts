import Handlebars from "handlebars";
import type { NodeExecutor } from "@/inngest/types";
import { NonRetriableError } from "inngest";
import ky from "ky";
import { discordChannel } from "@/inngest/channels";

type DiscordData = {
  webhookUrl?: string;
  message?: string;
  username?: string;
  variable?: string;
};

// Register json helper for {{json variable}} syntax
Handlebars.registerHelper("json", function (context) {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

export const DiscordExecutor: NodeExecutor<DiscordData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    discordChannel().status({
      nodeId: nodeId,
      status: "loading",
    })
  );

  try {
    const result = await step.run("Send Discord Message", async () => {
      // Validate required fields
      if (!data.webhookUrl) {
        throw new NonRetriableError("Discord Node: No webhook URL configured");
      }
      if (!data.message) {
        throw new NonRetriableError(
          "Discord Node: No message content provided"
        );
      }
      if (!data.variable) {
        throw new NonRetriableError("Discord Node: No variable name provided");
      }

      // Compile Handlebars templates with workflow context
      const webhookUrl = Handlebars.compile(data.webhookUrl)(context);
      const messageContent = Handlebars.compile(data.message)(context);

      // Build Discord webhook payload
      const payload: { content: string; username?: string } = {
        content: messageContent,
      };

      // Optionally compile username if provided
      if (data.username) {
        payload.username = Handlebars.compile(data.username)(context);
      }

      // Send to Discord webhook
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
      discordChannel().status({
        nodeId: nodeId,
        status: "success",
      })
    );

    return result;
  } catch (error) {
    await publish(
      discordChannel().status({
        nodeId: nodeId,
        status: "error",
      })
    );
    throw error;
  }
};
