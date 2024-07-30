import { View, Text, Button, StyleSheet } from 'react-native';
import { useCoreLocation } from 'react-native-core-location';

export default function App() {
  const { location, startUpdatingLocation, stopUpdatingLocation } =
    useCoreLocation();

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
