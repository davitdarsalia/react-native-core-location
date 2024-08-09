import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import type { CLLocation, CoreLocationConfig } from './globalTypes';
import { useEffect, useState } from 'react';

const LINKING_ERROR =
  `The package 'react-native-core-location' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const CoreLocation = NativeModules.CoreLocation
  ? NativeModules.CoreLocation
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export const LocationListener = 'onLocationUpdate';
export type Location = CLLocation;

export const requestWhenInUseAuthorization = (): void => {
  return CoreLocation.requestWhenInUseAuthorization();
};

export const startUpdatingLocation = (): void => {
  return CoreLocation.startUpdatingLocation();
};

export const stopUpdatingLocation = (): void => {
  return CoreLocation.stopUpdatingLocation();
};

export const fetchCurrentLocation = () => {
  return CoreLocation.getCurrentLocation();
};

export const useCoreLocation = (config: CoreLocationConfig) => {
  const [location, setLocation] = useState<Location>(
    config.defaultLocation ?? {
      latitude: 45.412,
      longitude: 32.123,
    }
  );

  useEffect(() => {
    requestWhenInUseAuthorization();

    const locationEmitter = new NativeEventEmitter(NativeModules.CoreLocation);

    const locationUpdateHandler = (locationObj: Location) => {
      setLocation(locationObj);
    };

    locationEmitter.addListener(LocationListener, locationUpdateHandler);

    return () => {
      locationEmitter.removeAllListeners(LocationListener);
    };
  }, []);

  useEffect(() => {
    fetchCurrentLocation().then((loc: Location) => setLocation(loc));
  }, []);

  const getCurrentLocation = () => {
    fetchCurrentLocation().then((loc: Location) => {
      setLocation(loc);
    });
  };

  const multiply = () => {
    CoreLocation.multiply(1, 10).then((r) => console.log(r));
  };

  return {
    startUpdatingLocation,
    stopUpdatingLocation,
    getCurrentLocation,
    multiply,
    location,
  };
};
