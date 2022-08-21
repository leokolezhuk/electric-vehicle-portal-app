import GPSCoordinate from "./GPSCoordinate";

export default class VehicleData {
  constructor(
    time: Date,
    energyKWh: number,
    coordinate: GPSCoordinate,
    odometerKm: number,
    speedKmh: number,
    batteryCharge: number
  ) {
    this.time = time;
    this.energykWh = energyKWh;
    this.coordinate = coordinate;
    this.odometerKm = odometerKm;
    this.speedKmh = speedKmh;
    this.batteryCharge = batteryCharge;
  }

  time!: Date;
  energykWh!: number;
  coordinate!: GPSCoordinate;
  odometerKm!: number;
  speedKmh!: number;
  batteryCharge!: number;

  public static parseJSON(jsonData: string): VehicleData | null {
    try {
      const rawData = JSON.parse(jsonData);

      this.validateData(rawData);
      const gpsData = rawData.gps.split("|", 2);

      return new VehicleData(
        new Date(rawData.time),
        parseFloat(rawData.energy),
        new GPSCoordinate(parseFloat(gpsData[0]), parseFloat(gpsData[1])),
        parseFloat(rawData.odo),
        parseFloat(rawData.speed),
        parseFloat(rawData.soc)
      );
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  private static validateData(rawDataObj: { [x: string]: unknown }) {
    const expectedProps = ["time", "energy", "gps", "odo", "speed", "soc"];
    expectedProps.forEach((propName: string) => {
      const propValue = rawDataObj[propName];
      if (propValue === null || propValue === undefined || propValue === "") {
        throw new Error(`Invalid vehicle data: property ${propName} not set.`);
      }
    });
  }
}
