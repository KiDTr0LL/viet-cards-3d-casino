using UnityEngine;
using System;
using System.Collections;

namespace VietnameseCasino.Core
{
    /// <summary>
    /// Main bridge between React Native and Unity
    /// Handles all communication in both directions
    /// </summary>
    public class UnityBridge : MonoBehaviour
    {
        private static UnityBridge _instance;
        public static UnityBridge Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = FindObjectOfType<UnityBridge>();
                    if (_instance == null)
                    {
                        GameObject bridgeObj = new GameObject("UnityBridge");
                        _instance = bridgeObj.AddComponent<UnityBridge>();
                    }
                }
                return _instance;
            }
        }

        // Event system for decoupled communication
        public event Action<string> OnMessageFromRN;
        public event Action<string> OnMessageToRN;

        // Message queues
        private Queue<MessageData> sendQueue = new Queue<MessageData>();
        private bool isProcessing = false;

        void Awake()
        {
            if (_instance == null)
            {
                _instance = this;
                DontDestroyOnLoad(gameObject);
            }
            else if (_instance != this)
            {
                Destroy(gameObject);
            }
        }

        void Start()
        {
            // Initialize bridge
            Debug.Log("[UnityBridge] Initialized");
        }

        // Called from React Native via UnitySendMessage
        [MonoPInvokeCallback(typeof(Action<string>))]
        public void OnMessageFromReactNative(string message)
        {
            Debug.Log($"[UnityBridge] Received: {message}");

            try
            {
                var data = JsonUtility.FromJson<MessageData>(message);
                OnMessageFromRN?.Invoke(message);

                // Route to appropriate handler
                switch (data.type)
                {
                    case "GAME_STATE":
                        HandleGameStateChanged(data.payload);
                        break;
                    case "SKIN_APPLIED":
                        HandleSkinChanged(data.payload);
                        break;
                    case "EFFECT_TRIGGER":
                        HandleEffectTrigger(data.payload);
                        break;
                    case "BALANCE_UPDATE":
                        HandleBalanceUpdate(data.payload);
                        break;
                }
            }
            catch (Exception e)
            {
                Debug.LogError($"[UnityBridge] Error processing message: {e.Message}");
            }
        }

        // Send message to React Native
        public void SendMessageToRN(string messageType, object payload)
        {
            var message = new MessageData
            {
                type = messageType,
                payload = JsonUtility.ToJson(payload),
                timestamp = DateTime.UtcNow.Ticks
            };

            string json = JsonUtility.ToJson(message);

            #if UNITY_ANDROID
            // Android: Use AndroidJavaObject to call back
            using (var unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer"))
            {
                using (var currentActivity = unityPlayer.GetStatic<AndroidJavaObject>("currentActivity"))
                {
                    // Store message for callback
                    PlayerPrefs.SetString("UnityToRN", json);
                    currentActivity.Call("runOnUnityThread", json);
                }
            }
            #elif UNITY_IOS
            // iOS: Use Marshal for native call
            // Implementation depends on iOS bridge setup
            #endif

            Debug.Log($"[UnityBridge] Sent to RN: {json}");
        }

        // Message handlers
        private void HandleGameStateChanged(string payloadJson)
        {
            var payload = JsonUtility.FromJson<GameModePayload>(payloadJson);
            Debug.Log($"[UnityBridge] Game mode changed to: {payload.mode}");

            // Switch to appropriate scene
            GameManager.Instance.SetGameMode(payload.mode);
        }

        private void HandleSkinChanged(string payloadJson)
        {
            var payload = JsonUtility.FromJson<SkinPayload>(payloadJson);
            Debug.Log($"[UnityBridge] Applying skins - Card: {payload.cardSkinId}, Table: {payload.tableSkinId}");

            SkinManager.Instance.ApplyCardSkin(payload.cardSkinId);
            SkinManager.Instance.ApplyTableSkin(payload.tableSkinId);
        }

        private void HandleEffectTrigger(string payloadJson)
        {
            var payload = JsonUtility.FromJson<EffectPayload>(payloadJson);
            Debug.Log($"[UnityBridge] Triggering effect: {payload.effect}");

            ParticleSystemManager.Instance.TriggerEffect(payload.effect);
        }

        private void HandleBalanceUpdate(string payloadJson)
        {
            var payload = JsonUtility.FromJson<BalancePayload>(payloadJson);
            Debug.Log($"[UnityBridge] Balance update - Gold: {payload.gold}, Diamonds: {payload.diamonds}");

            CurrencyDisplay.Instance.UpdateBalance(payload.gold, payload.diamonds);
        }

        // Payload classes
        [System.Serializable]
        public class MessageData
        {
            public string type;
            public string payload;
            public long timestamp;
        }

        [System.Serializable]
        public class GameModePayload
        {
            public string mode;
        }

        [System.Serializable]
        public class SkinPayload
        {
            public string cardSkinId;
            public string tableSkinId;
        }

        [System.Serializable]
        public class EffectPayload
        {
            public string effect;
        }

        [System.Serializable]
        public class BalancePayload
        {
            public int gold;
            public int diamonds;
        }
    }
}
