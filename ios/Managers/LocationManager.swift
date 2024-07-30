import CoreLocation

final class LocationManager: NSObject {
    private var locationManager: CLLocationManager
    weak var delegate: LocationManagerDelegate?
    static let shared = LocationManager()

    private override init() {
        locationManager = CLLocationManager()
        super.init()
        setupCLLocationManager()
    }

    func requestWhenInUseAuthorization() {
        locationManager.requestWhenInUseAuthorization()
    }

    func startUpdatingLocation() {
        locationManager.startUpdatingLocation()
    }

    func stopUpdatingLocation() {
        locationManager.stopUpdatingLocation()
    }

    func getCurrentLocation() -> CLLocationCoordinate2D? {
        return locationManager.location?.coordinate
    }
}

extension LocationManager {
    private func setupCLLocationManager() {
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.distanceFilter = kCLDistanceFilterNone


        locationManager.allowsBackgroundLocationUpdates = true
        locationManager.showsBackgroundLocationIndicator = true
    }
}

extension LocationManager: CLLocationManagerDelegate {
    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        switch CLLocationManager.authorizationStatus() {
        case .notDetermined:
            print("Location permission is not determined yet. !Granted !Rejected")
        case .restricted:
            print("Location restricted by parental control")
        case .denied:
            print("Location permission is not allowed by user or it's rejected by default")
        case .authorizedWhenInUse:
            print("Location permission is granted only when app is in usage")
        case .authorizedAlways:
            print("Location permission is granted always")

        @unknown default:
            print("Unknown case")
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else { return }
        delegate?.didUpdateLocation(location)
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        locationManager.stopUpdatingLocation()

        if let clError = error as? CLError {
            print("Location request failed with error: \(clError.localizedDescription)")
        } else {
            print("Unknown error occurred while handling location manager error: \(error.localizedDescription)")
        }
    }
}

protocol LocationManagerDelegate: AnyObject {
    func didUpdateLocation(_ location: CLLocation)
}
