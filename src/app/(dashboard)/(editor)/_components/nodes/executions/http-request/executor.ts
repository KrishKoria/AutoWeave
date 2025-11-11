import type { NodeExecutor } from "@/inngest/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

type HttpRequestData = {
  method?: "GET" | "PUT" | "POST" | "PATCH" | "DELETE";
  body?: string;
  endpoint?: string;
  variable?: string;
};
export const HttpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  if (!data.endpoint) {
    throw new NonRetriableError("HTTPRequest Node: no endpoint available ");
  }
  if (!data.variable) {
    throw new NonRetriableError(
      "HTTPRequest Node: no variable name provided. "
    );
  }
  const result = await step.run("HTTP Request", async () => {
    const method = data.method || "GET";
    const endpoint = data.endpoint!;
    const options: KyOptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      options.body = data.body;
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
    if (data.variable) {
      return {
        ...context,
        [data.variable]: responsePayload,
      };
    }
    return {
      ...context,
      ...responsePayload,
    };
  });

  return result;
};
