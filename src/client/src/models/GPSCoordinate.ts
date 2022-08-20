export default class GPSCoordinate {
  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  latitude!: number;
  longitude!: number;
}
