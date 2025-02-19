type MessageType = "orderCreated" | "orderCancelled"

interface Message {
  type: MessageType;
}

type OrderMessage = OrderCreatedMessage

interface Subscription {
  type: MessageType;
  subscriber: (arg: OrderMessage) => void;
}

interface Order {
  orderId: string;
  items: { productId: string; quantity: number }[];
}

export interface OrderCreatedMessage {
  type: 'orderCreated';
  payload: Order;
}

export interface OrderCancelledMessage {
  type: 'orderCancelled';
  payload: { orderId: string };
}

type Stock = Record<string, number>

export class MessageBus {
  private subscriptions: Subscription[] = [];


  subscribe(type: MessageType, subscriber: (message: OrderMessage) => void): void {
    this.subscriptions.push({ type, subscriber });
  }

  publish(message: OrderMessage): void {
    const subscriptionToFullfill = this.subscriptions.filter((subscription) => subscription.type === message.type)
    subscriptionToFullfill.forEach(subscription => subscription.subscriber(message))
  }
}

export class InventoryStockTracker {
  private bus: MessageBus
  private stock: Stock
  private orders: Order[] = []

  constructor(bus: MessageBus, stock: Stock) {
    this.bus = bus
    this.stock = stock
  }

  subscribeToMessages(): void {
    this.bus.subscribe("orderCreated", (message) => {
      this.orders.push(message.payload)

      message.payload.items.forEach(item => {
        this.stock = { ...this.stock, [item.productId]: this.stock[item.productId] - item.quantity }
      })


    })
    this.bus.subscribe("orderCancelled", (message) => {
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

