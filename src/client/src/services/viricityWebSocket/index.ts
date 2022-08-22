import { WEBSOCKET_CONSUMER_UPDATE_EVERY_MS } from "@/config";
import EventBus from "@/helpers/EventBus";
import VehicleData from "@/models/VehicleData";

const MESSAGE_EVENT = "message-received";

/**
 * Connects to the Viriciti websocket and receives message updates.
 * Updates consumers with a constant frequency regardless of the frequency of the messages
 * sent by the socket. This allows to control the frequency of UI updates.
 */
class ViricityWebSocket {
  private socket: WebSocket;
  private eventBus: EventBus;
  private messageQueue: Array<VehicleData>;
  private isFirstMessage = true;

  /**
   * @param url URL of the websocket endpoint.
   */
  constructor(url: string) {
    this.socket = new WebSocket(url);
    this.messageQueue = new Array<VehicleData>();
    this.socket.onmessage = ({ data }) => {
      this.handleSocketMessage(data);
    };
    this.socket.onerror = (error) => {
      console.error(`Error on WebSocket connection: ${error}`);
    };
    this.eventBus = new EventBus();
  }

  /** Listen on new data batches from the web socket. */
  public onUpdate(handler: (data: Array<VehicleData>) => void) {
    this.eventBus.on(MESSAGE_EVENT, handler);
  }

  private handleSocketMessage(data: string) {
    const vehicleData = VehicleData.parseJSON(data);
    if (vehicleData === null) return;

    this.messageQueue.push(vehicleData);

    if (this.isFirstMessage) {
      // When the first message is received,
      // start periodic notifications.
      this.notifyEventBusWithInterval(WEBSOCKET_CONSUMER_UPDATE_EVERY_MS);
      this.isFirstMessage = false;
    }
  }

  private notifyEventBusWithInterval(intervalMs: number) {
    setInterval(() => {
      this.eventBus.emit(MESSAGE_EVENT, this.messageQueue);
      this.messageQueue = new Array<VehicleData>();
    }, intervalMs);
  }
}

export default new ViricityWebSocket("ws://localhost:3000");
