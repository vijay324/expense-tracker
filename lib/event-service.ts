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

// Function to add a client to the set
export function addClient(
  userId: string,
  controller: ReadableStreamDefaultController
) {
  const client = { userId, controller };
  clients.add(client);
  return client;
}

// Function to remove a client from the set
export function removeClient(client: {
  userId: string;
  controller: ReadableStreamDefaultController;
}) {
  clients.delete(client);
}
