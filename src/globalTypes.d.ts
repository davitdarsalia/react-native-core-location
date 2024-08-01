import type { Location } from './index';

declare interface CLLocation {
  latitude: string | number | null;
  longitude: string | number | null;
}
declare interface CoreLocationModule {
  getCurrentLocation(): Promise<Location>;
  requestWhenInUseAuthorization(): void;
  startUpdatingLocation(): void;
  stopUpdatingLocation(): void;
  location: CLLocation;
}

declare interface CoreLocationConfig {
  desiredAccuracy: 'SystemPreciseLocation';
  pauseUpdatesOnBackground: boolean;
  distanceFilterInMeters: number;
  fetchLocationOnMount: boolean;
  defaultLocation: Location;
}
