declare interface CLLocation {
  latitude: string | number | null;
  longitude: string | number | null;
}

declare interface CoreLocationModule {
  requestWhenInUseAuthorization(): void;
  startUpdatingLocation(): void;
  location: CLLocation;
  stopUpdatingLocation(): void;
}
