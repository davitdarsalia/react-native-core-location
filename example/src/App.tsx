import { View, Text, Button, StyleSheet } from 'react-native';
import { useCoreLocation } from 'react-native-core-location';

export default function App() {
  const {
    location,
    startUpdatingLocation,
    stopUpdatingLocation,
    getCurrentLocation,
  } = useCoreLocation({
    desiredAccuracy: 'SystemPreciseLocation',
    pauseUpdatesOnBackground: true,
    distanceFilterInMeters: 100,
    fetchLocationOnMount: true,
    defaultLocation: {
      latitude: null,
      longitude: null,
    },
  });

  return (
    <View style={styles.wrapper}>
      <Text>Latitude: {location?.latitude ?? '33.22'}</Text>
      <Text>Longitude: {location?.longitude ?? '41.23'}</Text>

      <Button title={'Start'} onPress={startUpdatingLocation} />
      <Button title={'Stop'} onPress={stopUpdatingLocation} />
      <Button title={'GetCurrent'} onPress={getCurrentLocation} />
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
