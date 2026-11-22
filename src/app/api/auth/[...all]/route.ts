import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export async function GET(req: Request) {
  try {
    return await handler.GET(req);
  } catch (err: any) {
    console.error("[Better-Auth GET Error]:", err?.message || err);
    return new Response(JSON.stringify({ error: err?.message || "Internal auth error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req: Request) {
  try {
    return await handler.POST(req);
  } catch (err: any) {
    console.error("[Better-Auth POST Error]:", err?.message || err);
    return new Response(JSON.stringify({ error: err?.message || "Internal auth error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
