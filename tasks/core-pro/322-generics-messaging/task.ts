type MessageType = "orderCreated" | "orderCancelled"

interface Message {
  type: MessageType;
}

interface Subscription {
  type: Message["type"];
  subscriber: (arg: any) => void;
}

interface OrderCreatedPayload {
  orderId: string;
  items: { productId: string; quantity: number }[];
}

interface OrderCancelledPayload {
  orderId: string
}

export interface OrderCreatedMessage {
  type: 'orderCreated';
  payload: OrderCreatedPayload;
}

export interface OrderCancelledMessage {
  type: 'orderCancelled';
  payload: OrderCancelledPayload;
}

type Stock = Record<string, number>

export class MessageBus {
  private subscriptions: Subscription[] = [];


  subscribe<T extends OrderCreatedMessage | OrderCancelledMessage>(type: T["type"], subscriber: (message: T) => void): void {
    this.subscriptions.push({ type, subscriber });
  }

  publish<T extends OrderCreatedMessage | OrderCancelledMessage>(message: T): void {
    const subscriptionToFullfill = this.subscriptions.filter((subscription) => subscription.type === message.type)
    subscriptionToFullfill.forEach(subscription => subscription.subscriber(message))
  }
}

export class InventoryStockTracker {
  private bus: MessageBus
  private stock: Stock
  private orders: OrderCreatedPayload[] = []

  constructor(bus: MessageBus, stock: Stock) {
    this.bus = bus
    this.stock = stock
  }

  subscribeToMessages(): void {
    this.bus.subscribe<OrderCreatedMessage>("orderCreated", (message) => {
      this.orders.push(message.payload)

      message.payload.items.forEach(item => {
        this.stock = { ...this.stock, [item.productId]: this.stock[item.productId] - item.quantity }
      })
    })

    this.bus.subscribe<OrderCancelledMessage>("orderCancelled", (message) => {
      const currentlyHandledOrderId = message.payload.orderId
      const currentOrder = this.orders.find(order => order.orderId === currentlyHandledOrderId)

      currentOrder?.items.forEach(item => {
        this.stock = { ...this.stock, [item.productId]: this.stock[item.productId] + item.quantity }
      })
    })
  }

  getStock(productId: string): number {
    return this.stock[productId] || 0;
  }
}

