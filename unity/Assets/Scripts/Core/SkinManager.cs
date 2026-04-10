using UnityEngine;
using System.Collections.Generic;

namespace VietnameseCasino.Core
{
    /// <summary>
    /// Manages card and table skin application
    /// Loads textures/materials based on skin IDs from React Native
    /// </summary>
    public class SkinManager : MonoBehaviour
    {
        private static SkinManager _instance;
        public static SkinManager Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = FindObjectOfType<SkinManager>();
                    if (_instance == null)
                    {
                        GameObject manager = new GameObject("SkinManager");
                        _instance = manager.AddComponent<SkinManager>();
                    }
                }
                return _instance;
            }
        }

        [System.Serializable]
        public class SkinConfig
        {
            public string skinId;
            public string name;
            public Texture2D texture;
            public Material material;
        }

        public List<SkinConfig> cardSkins = new List<SkinConfig>();
        public List<SkinConfig> tableSkins = new List<SkinConfig>();

        private string currentCardSkinId = "";
        private string currentTableSkinId = "";

        void Awake()
        {
            if (_instance == null)
            {
                _instance = this;
                DontDestroyOnLoad(gameObject);
            }
            InitializeDefaultSkins();
        }

        /// <summary>
        /// Load default skin configurations
        /// </summary>
        void InitializeDefaultSkins()
        {
            // Vietnamese Silk Collection (Common)
            cardSkins.Add(new SkinConfig { skinId = "card_viet_silk_red", name = "Vietnamese Silk - Red" });
            cardSkins.Add(new SkinConfig { skinId = "card_viet_silk_gold", name = "Vietnamese Silk - Gold" });

            // Premium Gold Collection
            cardSkins.Add(new SkinConfig { skinId = "card_royal_gold", name = "Royal Gold" });
            cardSkins.Add(new SkinConfig { skinId = "card_diamond_elite", name = "Diamond Elite" });

            // Legendary
            cardSkins.Add(new SkinConfig { skinId = "card_dragon_emperor", name = "Dragon Emperor" });

            // Table skins
            tableSkins.Add(new SkinConfig { skinId = "table_trad_green", name = "Traditional Green" });
            tableSkins.Add(new SkinConfig { skinId = "table_bamboo", name = "Bamboo Pattern" });
            tableSkins.Add(new SkinConfig { skinId = "table_mahogany", name = "Mahogany Wood" });
            tableSkins.Add(new SkinConfig { skinId = "table_golden_lotus", name = "Golden Lotus" });
            tableSkins.Add(new SkinConfig { skinId = "table_imperial", name = "Imperial Palace" });

            Debug.Log($"[SkinManager] Initialized with {cardSkins.Count} card skins and {tableSkins.Count} table skins");
        }

        /// <summary>
        /// Apply card skin by ID
        /// </summary>
        public void ApplyCardSkin(string skinId)
        {
            if (string.IsNullOrEmpty(skinId)) return;

            currentCardSkinId = skinId;
            Debug.Log($"[SkinManager] Applying card skin: {skinId}");

            var skin = cardSkins.Find(s => s.skinId == skinId);
            if (skin != null)
            {
                ApplySkinToCards(skin);
            }
            else
            {
                Debug.LogWarning($"[SkinManager] Card skin not found: {skinId}");
            }
        }

        /// <summary>
        /// Apply table skin by ID
        /// </summary>
        public void ApplyTableSkin(string skinId)
        {
            if (string.IsNullOrEmpty(skinId)) return;

            currentTableSkinId = skinId;
            Debug.Log($"[SkinManager] Applying table skin: {skinId}");

            var skin = tableSkins.Find(s => s.skinId == skinId);
            if (skin != null)
            {
                ApplySkinToTable(skin);
            }
            else
            {
                Debug.LogWarning($"[SkinManager] Table skin not found: {skinId}");
            }
        }

        /// <summary>
        /// Find and update all card renderers with new skin
        /// </summary>
        void ApplySkinToCards(SkinConfig skin)
        {
            var cardRenderers = FindObjectsOfType<CardRenderer>();
            foreach (var card in cardRenderers)
            {
                card.ApplySkin(skin);
            }
        }

        /// <summary>
        /// Find and update table renderer with new skin
        /// </summary>
        void ApplySkinToTable(SkinConfig skin)
        {
            var table = FindObjectOfType<TableRenderer>();
            if (table != null)
            {
                table.ApplySkin(skin);
            }
        }

        public string GetCurrentCardSkinId() => currentCardSkinId;
        public string GetCurrentTableSkinId() => currentTableSkinId;
    }
}
