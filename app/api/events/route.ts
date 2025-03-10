import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Store active connections
const clients = new Set<{
  userId: string;
  controller: ReadableStreamDefaultController;
}>();

// Function to send event to a specific client
export function sendEventToUser(userId: string, event: string, data: any) {
  for (const client of clients) {
    if (client.userId === userId) {
      const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
      client.controller.enqueue(new TextEncoder().encode(message));
    }
  }
}

// Function to broadcast event to all clients
export function broadcastEvent(
  event: string,
  data: any,
  excludeUserId?: string
) {
  for (const client of clients) {
    if (!excludeUserId || client.userId !== excludeUserId) {
      const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
      client.controller.enqueue(new TextEncoder().encode(message));
    }
  }
}

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
      const client = { userId, controller };
      clients.add(client);

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
        clients.delete(client);
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
