import { toast } from "react-hot-toast";

// Define event types for type safety
export type FinancialEventType =
  | "EXPENSE_CREATED"
  | "EXPENSE_UPDATED"
  | "EXPENSE_DELETED"
  | "INCOME_CREATED"
  | "INCOME_UPDATED"
  | "INCOME_DELETED";

export interface FinancialEvent {
  type: FinancialEventType;
  payload: any;
}

// Define callback types
type EventCallback = (data: any) => void;

class RealtimeService {
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private eventListeners: Map<FinancialEventType, Set<EventCallback>> =
    new Map();
  private isConnecting = false;
  private pollingInterval: NodeJS.Timeout | null = null;
  private pollingEnabled = true;

  // Initialize connection
  public connect(): void {
    if (typeof window === "undefined") return; // Only run on client

    if (this.eventSource || this.isConnecting) return;

    this.isConnecting = true;

    // Try to use SSE if supported
    if (typeof EventSource !== "undefined") {
      try {
        this.eventSource = new EventSource("/api/events");

        this.eventSource.onopen = this.handleOpen.bind(this);
        this.eventSource.onmessage = this.handleMessage.bind(this);
        this.eventSource.onerror = this.handleError.bind(this);

        // Add event listeners for specific event types
        this.setupEventListeners();
      } catch (error) {
        console.error("SSE connection error:", error);
        this.isConnecting = false;
        this.fallbackToPolling();
      }
    } else {
      // Fallback to polling for browsers that don't support SSE
      this.fallbackToPolling();
    }
  }

  // Set up event listeners for specific event types
  private setupEventListeners(): void {
    if (!this.eventSource) return;

    const eventTypes: FinancialEventType[] = [
      "EXPENSE_CREATED",
      "EXPENSE_UPDATED",
      "EXPENSE_DELETED",
      "INCOME_CREATED",
      "INCOME_UPDATED",
      "INCOME_DELETED",
    ];

    eventTypes.forEach((eventType) => {
      this.eventSource?.addEventListener(eventType, ((event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          this.notifyListeners(eventType, data);
        } catch (error) {
          console.error(`Error parsing ${eventType} event:`, error);
        }
      }) as EventListener);
    });
  }

  // Fallback to polling when SSE is not available
  private fallbackToPolling(): void {
    console.log("Falling back to polling for real-time updates");
    this.startPolling();
  }

  // Start polling for updates
  private startPolling(): void {
    if (this.pollingInterval) return;

    // Poll every 3 seconds
    this.pollingInterval = setInterval(async () => {
      if (!this.pollingEnabled) return;

      try {
        // Fetch expenses
        const expensesResponse = await fetch("/api/expenses");
        if (expensesResponse.ok) {
          const expenses = await expensesResponse.json();
          this.notifyListeners("EXPENSE_UPDATED", expenses);
        }

        // Fetch incomes
        const incomesResponse = await fetch("/api/income");
        if (incomesResponse.ok) {
          const incomes = await incomesResponse.json();
          this.notifyListeners("INCOME_UPDATED", incomes);
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 3000);
  }

  // Handle successful connection
  private handleOpen(): void {
    console.log("Real-time connection established");
    this.reconnectAttempts = 0;
    this.isConnecting = false;
    toast.success("Real-time updates connected", { id: "realtime-connection" });
  }

  // Process incoming messages
  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      // Generic message handler for non-specific events
      console.log("Received event:", data);
    } catch (error) {
      console.error("Error parsing event message:", error);
    }
  }

  // Handle errors
  private handleError(event: Event): void {
    console.error("Real-time connection error:", event);
    this.isConnecting = false;

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    this.attemptReconnect();
  }

  // Attempt to reconnect with exponential backoff
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("Maximum reconnection attempts reached");
      toast.error("Could not establish real-time connection", {
        id: "realtime-reconnect-failed",
      });
      this.fallbackToPolling();
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    console.log(`Attempting to reconnect in ${delay}ms`);

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  // Notify all listeners for a specific event type
  private notifyListeners(eventType: FinancialEventType, data: any): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.forEach((callback) => callback(data));
    }
  }

  // Subscribe to specific event types
  public subscribe(
    eventType: FinancialEventType,
    callback: EventCallback
  ): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }

    const listeners = this.eventListeners.get(eventType)!;
    listeners.add(callback);

    // If this is the first subscription, ensure we're connected
    if (!this.eventSource && !this.pollingInterval) {
      this.connect();
    }

    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(eventType);
      if (listeners) {
        listeners.delete(callback);

        // If this event type has no more listeners, remove it
        if (listeners.size === 0) {
          this.eventListeners.delete(eventType);

          // If no more event listeners at all, close the connection
          if (this.eventListeners.size === 0) {
            this.disconnect();
          }
        }
      }
    };
  }

  // Disconnect
  public disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  // Pause polling (useful when app is in background)
  public pausePolling(): void {
    this.pollingEnabled = false;
  }

  // Resume polling
  public resumePolling(): void {
    this.pollingEnabled = true;
  }
}

// Create a singleton instance
export const realtimeService = new RealtimeService();

export default realtimeService;
