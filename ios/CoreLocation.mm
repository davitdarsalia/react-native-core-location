#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(CoreLocation, RCTEventEmitter)

RCT_EXTERN_METHOD(getCurrentLocation:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(requestWhenInUseAuthorization)
RCT_EXTERN_METHOD(startUpdatingLocation)
RCT_EXTERN_METHOD(stopUpdatingLocation)

@end
