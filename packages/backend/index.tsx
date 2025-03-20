import { ExportedHandler, ExecutionContext } from "@cloudflare/workers-types";

interface Env {}
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = "https://jsonplaceholder.typicode.com/todos/1";

    // gatherResponse returns both content-type & response body as a string
    async function gatherResponse(
      response: Response
    ): Promise<{ contentType: string; result: string }> {
      const { headers } = response;
      const contentType = headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        return { contentType, result: JSON.stringify(await response.json()) };
      }
      return { contentType, result: await response.text() };
    }

    const response = await fetch(url);
    const { contentType, result } = await gatherResponse(response);

    const options = { headers: { "content-type": contentType } };
    return new Response(result, options);
  },
} satisfies ExportedHandler<Env>;
