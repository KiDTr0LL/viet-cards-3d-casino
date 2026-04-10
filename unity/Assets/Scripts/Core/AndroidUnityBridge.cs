using UnityEngine;
using System;

namespace VietnameseCasino.Core
{
    /// <summary>
    /// Android-specific bridge implementation
    /// Handles communication between Unity and React Native on Android
    /// </summary>
    public class AndroidUnityBridge : MonoBehaviour
    {
        private static AndroidUnityBridge _instance;
        public static AndroidUnityBridge Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = FindObjectOfType<AndroidUnityBridge>();
                    if (_instance == null)
                    {
                        GameObject bridgeObj = new GameObject("AndroidUnityBridge");
                        _instance = bridgeObj.AddComponent<AndroidUnityBridge>();
                    }
                }
                return _instance;
            }
        }

        private AndroidJavaObject currentActivity;
        private AndroidJavaClass unityPlayerClass;

        void Awake()
        {
            if (_instance == null)
            {
                _instance = this;
                DontDestroyOnLoad(gameObject);
                InitializeAndroid();
            }
            else
            {
                Destroy(gameObject);
            }
        }

        void InitializeAndroid()
        {
            try
            {
                unityPlayerClass = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
                currentActivity = unityPlayerClass.GetStatic<AndroidJavaObject>("currentActivity");
                Debug.Log("[AndroidUnityBridge] Initialized");
            }
            catch (Exception e)
            {
                Debug.LogError($"[AndroidUnityBridge] Init error: {e.Message}");
            }
        }

        /// <summary>
        /// Called from React Native to send message to Unity
        /// </summary>
        public void OnMessageFromRN(string message)
        {
            Debug.Log($"[AndroidUnityBridge] Received from RN: {message}");

            // Route to UnityBridge
            var bridge = UnityBridge.Instance;
            if (bridge != null)
            {
                bridge.OnMessageFromReactNative(message);
            }
        }

        /// <summary>
        /// Send message from Unity to React Native
        /// </summary>
        public void SendToRN(string message)
        {
            if (currentActivity != null)
            {
                try
                {
                    // Call back into React Native
                    // The React Native side needs to implement this handler
                    currentActivity.Call("runOnUnityThread", message);
                    Debug.Log($"[AndroidUnityBridge] Sent to RN: {message}");
                }
                catch (Exception e)
                {
                    Debug.LogError($"[AndroidUnityBridge] Send error: {e.Message}");
                }
            }
        }

        /// <summary>
        /// Register a callback for Unity to RN messages
        /// Should be called from React Native side
        /// </summary>
        public void RegisterRNCallback(AndroidJavaObject callback)
        {
            // Store callback for later use
            // This is optional - can use event system instead
        }

        void OnDestroy()
        {
            if (unityPlayerClass != null)
            {
                unityPlayerClass.Dispose();
            }
            if (currentActivity != null)
            {
                currentActivity.Dispose();
            }
        }
    }
}
