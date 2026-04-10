using UnityEngine;
using UnityEngine.SceneManagement;

namespace VietnameseCasino
{
    /// <summary>
    /// Main entry point - initializes all managers
    /// </summary>
    public class Main : MonoBehaviour
    {
        void Awake()
        {
            // Ensure all singletons are initialized
            Debug.Log("[Main] Initializing Vietnamese Casino...");

            var unityBridge = UnityBridge.Instance;
            var gameManager = GameManager.Instance;
            var skinManager = SkinManager.Instance;
            var currencyDisplay = UI.CurrencyDisplay.Instance;
            var particleSystem = Effects.ParticleSystemManager.Instance;

            Debug.Log("[Main] All managers initialized");
        }

        void Start()
        {
            // Load initial scene if not already loaded
            if (SceneManager.GetActiveScene().name == "Bootstrap")
            {
                SceneManager.LoadScene("CasinoLobby", LoadSceneMode.Single);
            }
        }
    }
}
