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

  public static parseJSON(jsonData: string): VehicleData {
    const rawData = JSON.parse(jsonData);

    const gpsData = rawData.gps.split("|", 2);

    return new VehicleData(
      new Date(rawData.time),
      parseFloat(rawData.energy),
      new GPSCoordinate(parseFloat(gpsData[0]), parseFloat(gpsData[1])),
      parseFloat(rawData.odo),
      parseFloat(rawData.speed),
      parseFloat(rawData.soc)
    );
  }
}
