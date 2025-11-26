#import <React/RCTBridgeModule.h>
#import <LocalAuthentication/LocalAuthentication.h>

@interface BiometricModule : NSObject <RCTBridgeModule>
@end

@implementation BiometricModule

// Đảm bảo module được xuất khẩu
RCT_EXPORT_MODULE(BiometricModule);

NSString *const serviceName = @"com.danaexperts.onekey.biometric";

RCT_EXPORT_METHOD(generateBiometricKey:(NSString *)keyName resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    LAContext *context = [[LAContext alloc] init];
    NSError *error = nil;
    SecAccessControlRef access = SecAccessControlCreateWithFlags(
          kCFAllocatorDefault,
          kSecAttrAccessibleWhenPasscodeSetThisDeviceOnly,
          kSecAccessControlBiometryCurrentSet,
          NULL
      );
    NSData *keyData = [self randomKeyData];
    NSDictionary *query = @{(__bridge id)kSecClass: (__bridge id)kSecClassGenericPassword,
                             (__bridge id)kSecAttrService: serviceName,
                             (__bridge id)kSecAttrAccount: keyName,
                             (__bridge id)kSecValueData: keyData,
                             (__bridge id)kSecAttrAccessControl: (__bridge id)access,};
    
    if (error) {
        reject(@"SEC_ERROR", error.localizedDescription, error);
        return;
    }
    
    SecItemDelete((__bridge CFDictionaryRef)query);
    OSStatus status = SecItemAdd((__bridge CFDictionaryRef)query, NULL);
    if (status == errSecSuccess) {
        resolve(@"GENERATE_SUCCESS");
    } else {
        reject(@"STORE_FAILED", @"Failed to store biometric key", nil);
    }
}

RCT_EXPORT_METHOD(useBiometricKeyToEncrypt:(NSString *)keyName resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  
  LAContext *context = [[LAContext alloc] init];
  context.interactionNotAllowed = YES;

  NSDictionary *query = @{
      (__bridge id)kSecClass: (__bridge id)kSecClassGenericPassword,
      (__bridge id)kSecAttrService: serviceName,
      (__bridge id)kSecAttrAccount: keyName,
      (__bridge id)kSecUseAuthenticationContext: context,
  };


  OSStatus status = SecItemCopyMatching((__bridge CFDictionaryRef)query, NULL);

    if (status == errSecItemNotFound) {
        resolve(@"ENROLLMENT_CHANGE"); // Khóa sinh trắc học vẫn còn
    } else if (status == errSecAuthFailed) {
        resolve(@"ENROLLMENT_CHANGE"); // Khóa đã bị thay đổi hoặc xóa
    } else if (status == errSecParam){
        reject(@"ERROR", [NSString stringWithFormat:@"SecItemCopyMatching failed with status: %d", (int)status], nil);
    } else {
      resolve(@"ENROLLMENT_VALID");
    }
}

RCT_EXPORT_METHOD(removeBiometricKey:(NSString *)keyName resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    NSDictionary *query = @{(__bridge id)kSecClass: (__bridge id)kSecClassGenericPassword,
                             (__bridge id)kSecAttrService: serviceName,
                             (__bridge id)kSecAttrAccount: keyName};
    
    OSStatus status = SecItemDelete((__bridge CFDictionaryRef)query);
    if (status == errSecSuccess) {
        resolve(@"REMOVE_SUCCESS");
    } else {
        resolve(@"KEY_NOT_FOUND");
    }
}

- (NSData *)randomKeyData {
    uint8_t buffer[32];
    SecRandomCopyBytes(kSecRandomDefault, 32, buffer);
    return [NSData dataWithBytes:buffer length:32];
}
RCT_EXPORT_METHOD(getSupportedBiometricType:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    LAContext *context = [[LAContext alloc] init];
    NSError *error = nil;
    
    [context canEvaluatePolicy:LAPolicyDeviceOwnerAuthentication error:&error];
    
    if (@available(iOS 11.0, *)) {
        if (context.biometryType == LABiometryTypeFaceID) {
            resolve(@"FaceID");
            return;
        } else if (context.biometryType == LABiometryTypeTouchID) {
            resolve(@"TouchID");
            return;
        }
    }

    resolve(@"None");
}
@end
