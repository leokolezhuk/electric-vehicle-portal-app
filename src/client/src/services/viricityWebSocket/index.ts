import EventBus from "@/helpers/EventBus";
import VehicleData from "@/models/VehicleData";
import { throttle } from "lodash";

const MESSAGE_EVENT = "message-received";

class ViricityWebSocket {
  private socket!: WebSocket;
  private stream!: EventBus;

  constructor(url: string) {
    this.socket = new WebSocket(url);
    this.socket.onmessage = throttle(({ data }) => {
      this.handleSocketMessage(data);
    }, 1000);
    this.socket.onerror = (error) => {
      console.error(`Error on WebSocket connection: ${error}`);
    };

    this.stream = new EventBus();
  }

  private handleSocketMessage(data: string) {
    const vehicleData = VehicleData.parseJSON(data);
    if (vehicleData === null) return;
    this.stream.emit(MESSAGE_EVENT, vehicleData);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public onMessage(handler: Function) {
    this.stream.on(MESSAGE_EVENT, handler);
  }
}

export default new ViricityWebSocket("ws://localhost:3000");
