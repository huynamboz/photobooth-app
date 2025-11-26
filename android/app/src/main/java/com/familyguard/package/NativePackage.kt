package com.familyguard.package

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.onekey.module.BiometricModules

class NativePackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        val nativeModules = mutableListOf<NativeModule>()

        nativeModules.add(BiometricModules(reactContext))

        return nativeModules
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList() 
    }
}
