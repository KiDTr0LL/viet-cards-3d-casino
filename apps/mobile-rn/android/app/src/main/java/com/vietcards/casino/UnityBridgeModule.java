package com.vietcards.casino;

import android.app.Activity;
import android.content.Intent;
import com.facebook.react.bridge.*;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

@ReactModule(name = UnityBridgeModule.NAME)
public class UnityBridgeModule extends ReactContextBaseJavaModule {
    public static final String NAME = "UnityBridge";
    private static UnityBridgeModule instance;
    private Activity currentActivity;

    public UnityBridgeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        instance = this;
        this.currentActivity = reactContext.getCurrentActivity();
    }

    @Override
    public String getName() {
        return NAME;
    }

    public static UnityBridgeModule getInstance() {
        return instance;
    }

    // Called from Unity via AndroidJavaObject
    public void runOnUnityThread(String message) {
        ReactContext reactContext = (ReactContext) getReactApplicationContext();

        // Send event to JavaScript
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("unityMessage", message);

        Log.d("UnityBridge", "Message from Unity: " + message);
    }

    // Send message to Unity
    @ReactMethod
    public void sendMessageToUnity(String message) {
        if (currentActivity != null) {
            currentActivity.runOnUiThread(() -> {
                try {
                    // Call Unity's OnMessageFromReactNative
                    // This assumes Unity has AndroidJavaObject set up
                    Log.d("UnityBridge", "Sending to Unity: " + message);
                } catch (Exception e) {
                    Log.e("UnityBridge", "Error sending to Unity", e);
                }
            });
        }
    }

    // Start Unity activity
    @ReactMethod
    public void startUnity() {
        if (currentActivity != null) {
            Intent intent = currentActivity.getPackageManager()
                .getLaunchIntentForPackage(currentActivity.getPackageName());
            if (intent != null) {
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                currentActivity.startActivity(intent);
            }
        }
    }

    @Override
    public void onCatalystInstanceDestroy() {
        instance = null;
    }
}
