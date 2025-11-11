import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { Options as KyOptions } from "ky";

type HttpRequestData = {
  endpoint?: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: string;
};
export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  context,
  nodeId,
  step,
}) => {
  // Publish 'loading' state for http request

  console.log("HTTP Request: Executing", data);

  if (!data.endpoint) {
    throw new NonRetriableError("HTTP Request: Endpoint is required");
  }
  const result = await step.run("http-request", async () => {
    const endpoint = data.endpoint!;
    const method = data.method ?? "GET";
    const options: KyOptions = { method };
    if (["POST", "PUT", "PATCH"].includes(method)) {
      options.json = data.body;
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
        data: responseData,
      },
    };
  });

  // Publish "success" state for http request
  return result;
};
