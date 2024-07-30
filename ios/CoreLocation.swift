import CoreLocation
import Foundation
import React

@objc(CoreLocation)
class CoreLocation: RCTEventEmitter, LocationManagerDelegate {

    override init() {
        super.init()
        LocationManager.shared.delegate = self
    }

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    @objc
    func requestWhenInUseAuthorization() {
        LocationManager.shared.requestWhenInUseAuthorization()
    }

    @objc
    func startUpdatingLocation() {
        LocationManager.shared.startUpdatingLocation()
    }

    @objc
    func stopUpdatingLocation() {
        LocationManager.shared.stopUpdatingLocation()
    }

    func didUpdateLocation(_ location: CLLocation) {
        sendEvent(withName: "onLocationUpdate", body: [
            "latitude": location.coordinate.latitude,
            "longitude": location.coordinate.longitude
        ])
    }

    override func supportedEvents() -> [String]! {
        return ["onLocationUpdate"]
    }
}
