import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import { NodeExecutor } from "@/features/executions/types";
import ky, { Options as KyOptions } from "ky";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { Realtime } from "@inngest/realtime";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

type HttpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: string;
};

const emitStatus = async (
  publish: Realtime.PublishFn,
  nodeId: string,
  status: "loading" | "success" | "error"
) => {
  await publish(
    httpRequestChannel().status({
      nodeId,
      status,
    })
  );
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  context,
  nodeId,
  step,
  publish,
}) => {
  // Emit 'loading' state for http request
  await emitStatus(publish, nodeId, "loading");

  try {
    const result = await step.run("http-request", async () => {
      if (!data.endpoint) {
        emitStatus(publish, nodeId, "error");
        throw new NonRetriableError("HTTP Request node: Endpoint is required");
      }

      if (!data.method) {
        await emitStatus(publish, nodeId, "error");
        throw new NonRetriableError("HTTP Request node: Method is required");
      }

      if (
        !data.variableName ||
        !/^[A-Za-z_$][A-Za-z0-9_]*$/.test(data.variableName)
      ) {
        await emitStatus(publish, nodeId, "error");
        throw new NonRetriableError(
          "HTTP Request node: Variable name not configured"
        );
      }
      // The context is the previous node data. Handlebars will interpolate the variables in the endpoint.
      const endpoint = Handlebars.compile(data.endpoint)(context);
      const method = data.method;
      const options: KyOptions = { method };
      if (["POST", "PUT", "PATCH"].includes(method)) {
        const resolvedBody = Handlebars.compile(data.body)(context);
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
          data: responseData,
        },
      };

      await emitStatus(publish, nodeId, "success");

      return {
        ...context,
        [data.variableName]: responsePayload,
      };
    });

    // Publish "success" state for http request
    return result;
  } catch (error) {
    await emitStatus(publish, nodeId, "error");
    throw error;
  }
};
