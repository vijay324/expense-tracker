import { FinancialEventType } from "./websocket-service";

// Store active connections
const activeConnections = new Map<string, any>();

// Function to broadcast to all connections except sender
export function broadcast(
  type: FinancialEventType,
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

// Function to add a connection
export function addConnection(userId: string, socket: any) {
  activeConnections.set(userId, socket);
}

// Function to remove a connection
export function removeConnection(userId: string) {
  activeConnections.delete(userId);
}
