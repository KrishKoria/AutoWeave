import Handlebars from "handlebars";
import type { NodeExecutor } from "@/inngest/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

type HttpRequestData = {
  method: "GET" | "PUT" | "POST" | "PATCH" | "DELETE";
  body?: string;
  endpoint: string;
  variable: string;
};

Handlebars.registerHelper("json", function (context) {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

export const HttpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  if (!data.endpoint) {
    throw new NonRetriableError("HTTPRequest Node: No endpoint available ");
  }

  if (!data.variable) {
    throw new NonRetriableError(
      "HTTPRequest Node: No variable name provided. "
    );
  }
  if (!data.method) {
    throw new NonRetriableError("HTTPRequest Node: No method configured. ");
  }

  const result = await step.run("HTTP Request", async () => {
    const method = data.method;
    const endpoint = Handlebars.compile(data.endpoint)(context);
    const options: KyOptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      const resolvedBody = Handlebars.compile(data.body || "{}")(context);
      JSON.parse(resolvedBody);
      options.body = resolvedBody;
      options.headers = {
        "Content-Type": "application/json",
      };
    }
    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        body: responseData,
      },
    };
    return {
      ...context,
      [data.variable]: responsePayload,
    };
  });

  return result;
};
