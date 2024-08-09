package com.corelocation

import com.google.android.gms.location.FusedLocationProviderClient
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactApplicationContext
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Arguments
import androidx.core.content.ContextCompat
import android.content.pm.PackageManager
import com.facebook.react.bridge.Promise
import androidx.core.app.ActivityCompat


class CoreLocationModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private val locationPermissionCode = 101
  private lateinit var fusedLocationClient: FusedLocationProviderClient
  private lateinit var locationCallback: LocationCallback

  init {
    fusedLocationClient = LocationServices.getFusedLocationProviderClient(reactContext)
    initializeLocationCallback()
  }

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  fun requestWhenInUseAuthorization(promise: Promise) {
    val activity = currentActivity ?: run {
      promise.reject("Activity not found")
      return
    }

    if (ContextCompat.checkSelfPermission(activity, android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
      ContextCompat.checkSelfPermission(activity, android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {

      ActivityCompat.requestPermissions(activity, arrayOf(android.Manifest.permission.ACCESS_FINE_LOCATION), locationPermissionCode)
      promise.resolve("Permission requested")
    } else {
      promise.resolve("Permission already granted")
    }
  }

  @ReactMethod
  fun startUpdatingLocation(promise: Promise) {
    if (ActivityCompat.checkSelfPermission(reactApplicationContext, android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
      ActivityCompat.checkSelfPermission(reactApplicationContext, android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
      promise.reject("Permission not granted")
      return
    }

    val locationRequest = LocationRequest.create().apply {
      interval = 5000
      fastestInterval = 2000
      priority = LocationRequest.PRIORITY_HIGH_ACCURACY
      smallestDisplacement = 50f
    }

    fusedLocationClient.requestLocationUpdates(locationRequest, locationCallback, reactApplicationContext.mainLooper)
    promise.resolve("Location updates started")
  }

  @ReactMethod
  fun stopUpdatingLocation(promise: Promise) {
    fusedLocationClient.removeLocationUpdates(locationCallback)
    promise.resolve("Location updates stopped")
  }

  @ReactMethod
  fun getCurrentLocation(promise: Promise) {
    if (ActivityCompat.checkSelfPermission(reactApplicationContext, android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
      ActivityCompat.checkSelfPermission(reactApplicationContext, android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
      promise.reject("Permission not granted")
      return
    }

    fusedLocationClient.lastLocation.addOnSuccessListener { location: android.location.Location? ->
      if (location != null) {
        val locationModel = LocationModel(location.latitude, location.longitude)

        promise.resolve(Arguments.createMap().apply {
          putDouble("latitude", location.latitude)
          putDouble("longitude", location.longitude)
        })
      } else {
        promise.reject("Location not available")
      }
    }.addOnFailureListener { e ->
      promise.reject("Failed to get location", e)
    }
  }

  private fun initializeLocationCallback() {
    locationCallback = object : LocationCallback() {
      override fun onLocationResult(locationResult: LocationResult) {
        locationResult.locations.forEach { location ->
          // Here location updates can be handled
        }
      }
    }
  }

  @ReactMethod
  fun addListener(eventName: String?) {
  }

  @ReactMethod
  fun removeListeners(count: Int?) {
  }

  companion object {
    const val NAME = "CoreLocation"
  }
}
