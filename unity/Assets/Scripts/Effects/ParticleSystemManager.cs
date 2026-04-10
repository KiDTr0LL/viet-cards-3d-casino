using UnityEngine;

namespace VietnameseCasino.Effects
{
    /// <summary>
    /// Manages particle effects for wins, losses, purchases
    /// </summary>
    public class ParticleSystemManager : MonoBehaviour
    {
        private static ParticleSystemManager _instance;
        public static ParticleSystemManager Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = FindObjectOfType<ParticleSystemManager>();
                    if (_instance == null)
                    {
                        GameObject effectManager = new GameObject("ParticleSystemManager");
                        _instance = effectManager.AddComponent<ParticleSystemManager>();
                    }
                }
                return _instance;
            }
        }

        [Header("Particle Systems")]
        public ParticleSystem winEffect;
        public ParticleSystem lossEffect;
        public ParticleSystem purchaseEffect;
        public ParticleSystem dailyRefreshEffect;

        [Header("Coin Prefab")]
        public GameObject coinPrefab;
        public Transform effectSpawnPoint;

        void Awake()
        {
            if (_instance == null)
            {
                _instance = this;
            }
        }

        /// <summary>
        /// Trigger effect by name (called from UnityBridge)
        /// </summary>
        public void TriggerEffect(string effectType)
        {
            Debug.Log($"[ParticleSystemManager] Triggering effect: {effectType}");

            switch (effectType)
            {
                case "WIN":
                    PlayWinEffect();
                    break;
                case "LOSS":
                    PlayLossEffect();
                    break;
                case "PURCHASE":
                    PlayPurchaseEffect();
                    break;
                case "DAILY_REFRESH":
                    PlayDailyRefreshEffect();
                    break;
                default:
                    Debug.LogWarning($"[ParticleSystemManager] Unknown effect: {effectType}");
                    break;
            }
        }

        void PlayWinEffect()
        {
            if (winEffect != null)
            {
                winEffect.Play();
            }
            SpawnCoins(10);
        }

        void PlayLossEffect()
        {
            if (lossEffect != null)
            {
                lossEffect.Play();
            }
        }

        void PlayPurchaseEffect()
        {
            if (purchaseEffect != null)
            {
                purchaseEffect.Play();
            }
            SpawnDiamonds(5);
        }

        void PlayDailyRefreshEffect()
        {
            if (dailyRefreshEffect != null)
            {
                dailyRefreshEffect.Play();
            }
            SpawnCoins(20);
        }

        void SpawnCoins(int count)
        {
            if (coinPrefab == null || effectSpawnPoint == null) return;

            for (int i = 0; i < count; i++)
            {
                GameObject coin = Instantiate(coinPrefab, effectSpawnPoint.position, Quaternion.identity);

                // Add random spread
                coin.transform.localPosition += new Vector3(
                    Random.Range(-2f, 2f),
                    Random.Range(0f, 1f),
                    Random.Range(-2f, 2f)
                );

                // Animate coin fall
                StartCoroutine(FallAndDestroy(coin));
            }
        }

        void SpawnDiamonds(int count)
        {
            // Similar to coins but with diamond prefab
            SpawnCoins(count); // Placeholder
        }

        System.Collections.IEnumerator FallAndDestroy(GameObject obj)
        {
            float elapsed = 0f;
            Vector3 startPosition = obj.transform.localPosition;

            while (elapsed < 1f)
            {
                elapsed += Time.unscaledDeltaTime;
                obj.transform.localPosition = startPosition + new Vector3(0, -elapsed * 5f, 0);
                yield return null;
            }

            Destroy(obj, 0.1f);
        }
    }
}
