import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
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

export const startUpdatingLocation = () => {
  return CoreLocation.startUpdatingLocation();
};

export const stopUpdatingLocation = () => {
  return CoreLocation.stopUpdatingLocation();
};

export const getCurrentLocation = () => {
  return CoreLocation.getCurrentLocation();
};

export const useCoreLocation = (defaultLocation?: Location) => {
  const [location, setLocation] = useState<Location>(
    defaultLocation ?? {
      latitude: null,
      longitude: null,
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
    getCurrentLocation().then((loc: Location) => setLocation(loc));
  }, []);

  return {
    startUpdatingLocation,
    stopUpdatingLocation,
    getCurrentLocation,
    location,
  };
};
