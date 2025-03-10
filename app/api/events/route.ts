import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { addClient, removeClient } from "@/lib/event-service";

export async function GET(req: NextRequest) {
  // Verify authentication
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Create a new stream
  const stream = new ReadableStream({
    start(controller) {
      // Store the client connection
      const client = addClient(userId, controller);

      // Send initial connection message
      controller.enqueue(
        new TextEncoder().encode(
          `event: connected\ndata: {"userId":"${userId}"}\n\n`
        )
      );

      // Keep the connection alive with a comment every 30 seconds
      const keepAliveInterval = setInterval(() => {
        controller.enqueue(new TextEncoder().encode(": keepalive\n\n"));
      }, 30000);

      // Remove the client when the connection is closed
      req.signal.addEventListener("abort", () => {
        removeClient(client);
        clearInterval(keepAliveInterval);
      });
    },
  });

  // Return the stream as a response
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export const dynamic = "force-dynamic";
