using UnityEngine;
using UnityEngine.UI;

namespace VietnameseCasino.Tables
{
    /// <summary>
    /// Table surface renderer with skin support
    /// </summary>
    public class TableRenderer : MonoBehaviour
    {
        [Header("References")]
        public RawImage tableSurface;
        public Material tableMaterial;

        [Header("Table Settings")]
        public Color feltColor = new Color(0.05f, 0.36f, 0.23f); // Emerald green
        public float feltScale = 1f;

        private Texture2D currentSkinTexture;
        private Material currentMaterial;

        void Start()
        {
            if (tableSurface == null)
            {
                var renderer = GetComponent<Renderer>();
                if (renderer != null)
                {
                    currentMaterial = renderer.material;
                }
            }
        }

        /// <summary>
        /// Apply table skin
        /// </summary>
        public void ApplySkin(SkinManager.SkinConfig skin)
        {
            Debug.Log($"[TableRenderer] Applying skin: {skin.name}");

            if (skin.texture != null)
            {
                currentSkinTexture = skin.texture;

                if (tableSurface != null)
                {
                    tableSurface.texture = skin.texture;
                }

                if (currentMaterial != null && skin.material != null)
                {
                    currentMaterial.mainTexture = skin.texture;
                }
            }
        }

        /// <summary>
        /// Set felt color (for basic tables without textures)
        /// </summary>
        public void SetFeltColor(Color color)
        {
            feltColor = color;
            if (currentMaterial != null)
            {
                currentMaterial.color = color;
            }
        }

        /// <summary>
        /// Add chip/bet markers to table
        /// </summary>
        public void AddChipMarker(Vector3 position, int amount)
        {
            // Spawn chip prefab at position
            Debug.Log($"[TableRenderer] Adding chip marker at {position} for {amount}");
        }

        /// <summary>
        /// Clear all markers from table
        /// </summary>
        public void ClearMarkers()
        {
            // Remove all chip markers
        }
    }
}
