import GPSCoordinate from "./GPSCoordinate";

const isValidDate = function (date: string | number): boolean {
  try {
    new Date(date).toISOString();
    return true;
  } catch {
    return false;
  }
};

export default class VehicleData {
  time: Date;
  energykW: number;
  coordinate: GPSCoordinate;
  odometerKm: number;
  speedKmh: number;
  batteryCharge: number;

  constructor(
    time: Date,
    energykW: number,
    coordinate: GPSCoordinate,
    odometerKm: number,
    speedKmh: number,
    batteryCharge: number
  ) {
    this.time = time;
    this.energykW = energykW;
    this.coordinate = coordinate;
    this.odometerKm = odometerKm;
    this.speedKmh = speedKmh;
    this.batteryCharge = batteryCharge;
  }

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

  private static validateData(rawDataObj: { [x: string]: any }) {
    const expectedProps = ["time", "energy", "gps", "odo", "speed", "soc"];
    expectedProps.forEach((propName: string) => {
      const propValue = rawDataObj[propName];
      if (propValue === null || propValue === undefined || propValue === "") {
        throw new Error(`Invalid vehicle data: property ${propName} not set.`);
      }
    });

    if (!isValidDate(rawDataObj["time"])) {
      throw new Error(
        `Invalid vehicle data: invalid date ${rawDataObj["time"]}`
      );
    }
  }
}
