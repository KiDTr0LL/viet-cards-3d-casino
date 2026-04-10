using UnityEngine;
using TMPro;

namespace VietnameseCasino.UI
{
    /// <summary>
    /// Displays gold and diamond balance in Unity UI
    /// Receives real-time updates from React Native
    /// </summary>
    public class CurrencyDisplay : MonoBehaviour
    {
        private static CurrencyDisplay _instance;
        public static CurrencyDisplay Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = FindObjectOfType<CurrencyDisplay>();
                }
                return _instance;
            }
        }

        [Header("UI References")]
        public TextMeshProUGUI goldText;
        public TextMeshProUGUI diamondText;
        public GameObject goldContainer;
        public GameObject diamondContainer;

        private int currentGold = 0;
        private int currentDiamonds = 0;
        private bool isAnimating = false;

        void Awake()
        {
            if (_instance == null)
            {
                _instance = this;
            }
        }

        void Start()
        {
            UpdateDisplay(currentGold, currentDiamonds);
        }

        /// <summary>
        /// Called from UnityBridge when balance changes
        /// Animates from old value to new value
        /// </summary>
        public void UpdateBalance(int newGold, int newDiamonds)
        {
            Debug.Log($"[CurrencyDisplay] Balance update: Gold {currentGold} → {newGold}, Diamonds {currentDiamonds} → {newDiamonds}");

            StartCoroutine(AnimateBalance(newGold, newDiamonds));
        }

        System.Collections.IEnumerator AnimateBalance(int newGold, int newDiamonds)
        {
            if (isAnimating) yield break;
            isAnimating = true;

            int startGold = currentGold;
            int startDiamonds = currentDiamonds;
            float duration = 0.5f;
            float elapsed = 0f;

            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = Mathf.Clamp01(elapsed / duration);
                t = Mathf.SmoothStep(0f, 1f, t);

                currentGold = Mathf.RoundToInt Mathf.Lerp(startGold, newGold, t));
                currentDiamonds = Mathf.RoundToInt Mathf.Lerp(startDiamonds, newDiamonds, t));

                UpdateDisplay(currentGold, currentDiamonds);
                yield return null;
            }

            currentGold = newGold;
            currentDiamonds = newDiamonds;
            UpdateDisplay(currentGold, currentDiamonds);
            isAnimating = false;
        }

        void UpdateDisplay(int gold, int diamonds)
        {
            if (goldText != null)
            {
                goldText.text = FormatAmount(gold);
            }
            if (diamondText != null)
            {
                diamondText.text = FormatAmount(diamonds);
            }
        }

        string FormatAmount(int amount)
        {
            if (amount >= 1000000)
                return (amount / 1000000f).ToString("0.0") + "M";
            if (amount >= 1000)
                return (amount / 1000f).ToString("0.0") + "K";
            return amount.ToString();
        }
    }
}
