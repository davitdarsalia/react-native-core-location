# react-native-core-location

`react-native-core-location` is a React Native library for accessing Core Location services on iOS and Android. It provides an easy way to get the current location of the device by latitude and longitude, and supports starting and stopping location updates.

## Installation

### Versions:
**Minimum deployment target: iOS 13+, Android 8**
**React Native supported versions: 0.68+**

1. ***Install core location package via yarn, npm or pnpm:***

**React Native 0.65+**

```bash
yarn add react-native-core-location
```

```bash
npm install react-native-core-location
```

```bash
pnpm install react-native-core-location
```
**Don't forget to install Native Dependencies**

**Update your Info.plist**
```xml
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>We need your location to provide better services.</string>

<key>NSLocationAlwaysUsageDescription</key>
<string>We need your location to provide better services.</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to provide better services.</string>
```

**Configure Android permissions**
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

```bash
cd ios && pod install && cd ..
```

## Hook Usage (Recommended)

```javascript
import { View, Text, Button, StyleSheet } from 'react-native';
import { useCoreLocation } from 'react-native-core-location';

export default function App() {
  const { location, startUpdatingLocation, stopUpdatingLocation } = useCoreLocation();

  return (
    <View style={styles.wrapper}>
      <Text>Latitude: {location.latitude}</Text>
      <Text>Longitude: {location.longitude}</Text>

      <Button title={'Start'} onPress={startUpdatingLocation} />
      <Button title={'Stop'} onPress={stopUpdatingLocation} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

## Direct function usage
```javascript
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, NativeEventEmitter, NativeModules } from 'react-native';
import { startUpdatingLocation, stopUpdatingLocation, requestWhenInUseAuthorization } from 'react-native-core-location';

export default function App() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    requestWhenInUseAuthorization();

    const handleLocationUpdate = (locationObj) => {
      setLocation(locationObj);
    };

    const locationEmitter = new NativeEventEmitter(NativeModules.CoreLocation);
    const subscription = locationEmitter.addListener('onLocationUpdate', handleLocationUpdate);

    startUpdatingLocation();

    return () => {
      stopUpdatingLocation();
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.wrapper}>
      <Text>Latitude: {location.latitude}</Text>
      <Text>Longitude: {location.longitude}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
