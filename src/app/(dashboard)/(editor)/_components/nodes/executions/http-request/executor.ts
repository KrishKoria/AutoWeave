import type { NodeExecutor } from "@/inngest/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

type HttpRequestData = {
  method?: "GET" | "PUT" | "POST" | "PATCH" | "DELETE";
  body?: string;
  endpoint?: string;
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
    return {
      ...context,
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        body: responseData,
      },
    };
  });
  return result;
};
