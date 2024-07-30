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
    
    @objc
    func getCurrentLocation(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        if let coordinate = LocationManager.shared.getCurrentLocation() {
            resolve([
                           "latitude": coordinate.latitude,
                           "longitude": coordinate.longitude
                       ])
        } else {
            let error = NSError(domain: "", code: 500, userInfo: nil)
            reject("no_location", "Unable to detect location", error)
        }
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
