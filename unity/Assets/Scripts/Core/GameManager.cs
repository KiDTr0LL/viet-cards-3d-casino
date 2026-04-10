using UnityEngine;
using UnityEngine.SceneManagement;

namespace VietnameseCasino.Core
{
    /// <summary>
    /// Manages game state transitions between lobby and game tables
    /// </summary>
    public class GameManager : MonoBehaviour
    {
        private static GameManager _instance;
        public static GameManager Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = FindObjectOfType<GameManager>();
                    if (_instance == null)
                    {
                        GameObject manager = new GameObject("GameManager");
                        _instance = manager.AddComponent<GameManager>();
                    }
                }
                return _instance;
            }
        }

        public enum GameMode
        {
            LOBBY,
            TIENLEN,
            MAUBINH
        }

        private GameMode currentMode = GameMode.LOBBY;
        private bool isInitialized = false;

        void Awake()
        {
            if (_instance == null)
            {
                _instance = this;
                DontDestroyOnLoad(gameObject);
            }
            else
            {
                Destroy(gameObject);
            }
        }

        void Start()
        {
            isInitialized = true;
            Debug.Log("[GameManager] Initialized in LOBBY mode");
        }

        /// <summary>
        /// Called from UnityBridge when game mode changes
        /// </summary>
        public void SetGameMode(string mode)
        {
            Debug.Log($"[GameManager] Setting mode to: {mode}");

            switch (mode)
            {
                case "LOBBY":
                    currentMode = GameMode.LOBBY;
                    LoadScene("CasinoLobby");
                    break;
                case "TIENLEN":
                case "TIENLEN_QUICKPLAY":
                case "TIENLEN_ROOM":
                    currentMode = GameMode.TIENLEN;
                    LoadScene("GameTable_TienLen");
                    break;
                case "MAUBINH":
                case "MAUBINH_QUICKPLAY":
                case "MAUBINH_ROOM":
                    currentMode = GameMode.MAUBINH;
                    LoadScene("GameTable_MauBinh");
                    break;
                default:
                    Debug.LogWarning($"[GameManager] Unknown mode: {mode}");
                    break;
            }
        }

        public GameMode GetCurrentMode()
        {
            return currentMode;
        }

        private void LoadScene(string sceneName)
        {
            if (SceneManager.GetActiveScene().name != sceneName)
            {
                Debug.Log($"[GameManager] Loading scene: {sceneName}");
                SceneManager.LoadScene(sceneName);
            }
        }

        /// <summary>
        /// Signal game end to React Native
        /// </summary>
        public void SignalGameEnd(object results)
        {
            var bridge = UnityBridge.Instance;
            if (bridge != null)
            {
                bridge.SendMessageToRN("GAME_END", results);
            }
        }
    }
}
