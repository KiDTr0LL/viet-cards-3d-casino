# Building the Unity Project

## Prerequisites

1. **Unity 2022.3 LTS** (Long Term Support)
   - Download from: https://unity.com/download
   - Select: Unity Hub → Install Editor → 2022.3.x LTS

2. **Android Build Support** (in Unity Installer)
   - Unity Hub → Installs → Add Modules
   - Check: "Android Build Support", "Android SDK & NDK", "OpenJDK"

3. **Visual Studio** (for scripting)
   - Unity Hub → Preferences → External Tools
   - Select: Visual Studio Community

## Setup Steps

### 1. Import Project

```bash
cd unity
```

Open Unity Hub → Add → Select `unity` folder

### 2. Create Scenes

In Unity Editor:

1. **File → New Scene → 3D**
2. Save as `Assets/Scenes/CasinoLobby.unity`
3. Add UI elements (currency display, game selection buttons)
4. Add 3D table model
5. Add card prefabs

### 3. Configure Build Settings

1. **File → Build Settings**
2. Platform: **Android**
3. Scripting Backend: **IL2CPP**
4. Target Architectures: **ARM64**
5. **Player Settings**:
   - Company Name: `VietCards`
   - Product Name: `Vietnamese Card Games`
   - Bundle Identifier: `com.vietcards.casino`
   - Minimum API Level: `Android 7.0` (API 24)

### 4. Build APK

```bash
# Option A: Via Unity Editor
File → Build Settings → Android → Build → VietnameseCasino.apk

# Option B: Command line
Unity -batchmode -quit -projectPath unity -buildAndroidPlayer output.apk
```

### 5. Integrate with React Native

Copy the built APK/OBB to React Native assets:

```bash
cp unity/BuildOutput/Android/*.apk apps/mobile-rn/android/app/src/main/assets/
```

## React Native Integration

### Android (MainActivity.java)

Add Unity activity handler:

```java
public class MainActivity extends ReactActivity {
    @Override
    public void runOnUnityThread(String message) {
        // Handle message from Unity
        mReactInstanceManager.getCurrentReactContext()
            .runOnNativeModulesThread(new Runnable() {
                @Override
                public void run() {
                    // Process Unity message
                }
            });
    }
}
```

### iOS (AppDelegate.m)

```objc
- (void)unitySendMessage:(NSString*)objectName methodName:(NSString*)methodName args:(NSString*)args {
    // Forward to React Native
}
```

## Troubleshooting

### Issue: "UnitySendMessage not found"
- Ensure UnityBridge.cs is in the scene
- Check AndroidJavaObject initialization

### Issue: "Build fails with IL2CPP error"
- Switch to ARM64 only
- Increase memory limit in Player Settings

### Issue: "Messages not passing to RN"
- Check runOnUnityThread implementation
- Verify message format is JSON

## Next Steps

1. Build Unity project
2. Test bridge communication
3. Add card/table assets
4. Implement game logic
5. Build and test on device
