import EventBus from "@/helpers/EventBus";
import VehicleData from "@/models/VehicleData";

const MESSAGE_EVENT = "message-received";

class ViricityWebSocket {
  private url!: string;
  private socket!: WebSocket;
  private stream!: EventBus;

  constructor(url: string) {
    this.url = url;
    this.socket = new WebSocket(url);
    this.socket.onopen = () => {
      console.log("Connection to WebSocket Succesful");
    };
    this.socket.onmessage = ({ data }) => {
      this.handleSocketMessage(data);
    };
    this.socket.onerror = (error) => {
      console.log(`Error on WebSocket connection: ${error}`);
    };

    this.stream = new EventBus();
  }

  private handleSocketMessage(data: string) {
    console.log("Received message");
    const vehicleData = VehicleData.parseJSON(data);

    this.stream.emit(MESSAGE_EVENT, vehicleData);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public onMessage(handler: Function) {
    this.stream.on(MESSAGE_EVENT, handler);
  }
}

export default new ViricityWebSocket("ws://localhost:3000");
