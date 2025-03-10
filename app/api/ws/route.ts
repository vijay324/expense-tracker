import { NextRequest } from "next/server";
import { WebSocketEventType } from "@/lib/websocket-service";
import { auth } from "@clerk/nextjs/server";

// Store active connections
const activeConnections = new Map<string, any>();

// Function to broadcast to all connections except sender
export function broadcast(
  type: WebSocketEventType,
  payload: any,
  excludeUserId?: string
) {
  const message = JSON.stringify({ type, payload });

  activeConnections.forEach((socket, userId) => {
    if (userId !== excludeUserId && socket.readyState === 1) {
      // 1 = OPEN
      socket.send(message);
    }
  });
}

export async function GET(req: NextRequest) {
  // Next.js doesn't natively support WebSockets in API routes
  // This is a placeholder for WebSocket functionality
  // In a real implementation, you would use a dedicated WebSocket server
  // or a service like Pusher, Socket.io, or a serverless WebSocket service

  return new Response(
    JSON.stringify({
      message: "WebSocket connections should be handled by a dedicated service",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

// For a production implementation, consider using:
// 1. Pusher (https://pusher.com)
// 2. Socket.io with a custom server
// 3. AWS API Gateway WebSockets
// 4. Vercel's integration with Pusher

export const dynamic = "force-dynamic";
export const runtime = "edge";
