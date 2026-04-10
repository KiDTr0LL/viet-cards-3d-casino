using UnityEngine;
using UnityEngine.UI;

namespace VietnameseCasino.Cards
{
    /// <summary>
    /// 3D Card renderer with flip animation and skin support
    /// </summary>
    public class CardRenderer : MonoBehaviour
    {
        [Header("References")]
        public Image frontImage;
        public Image backImage;
        public Transform cardFront;
        public Transform cardBack;

        [Header("Animation")]
        public float flipDuration = 0.3f;
        private bool isFaceUp = true;

        [Header("Card Data")]
        public string rank;
        public string suit;
        private Texture2D currentSkinTexture;

        void Start()
        {
            if (frontImage == null) frontImage = GetComponent<Image>();
            if (backImage == null) backImage = GetComponent<Image>();
        }

        /// <summary>
        /// Apply skin texture to card
        /// </summary>
        public void ApplySkin(SkinManager.SkinConfig skin)
        {
            if (skin.texture != null)
            {
                currentSkinTexture = skin.texture;
                if (frontImage != null)
                {
                    frontImage.texture = skin.texture;
                }
            }
        }

        /// <summary>
        /// Set card rank and suit display
        /// </summary>
        public void SetCardData(string rank, string suit)
        {
            this.rank = rank;
            this.suit = suit;
            UpdateCardVisuals();
        }

        void UpdateCardVisuals()
        {
            // Update text or sprite based on rank/suit
            // This would typically load the appropriate card sprite
        }

        /// <summary>
        /// Flip card animation
        /// </summary>
        public void FlipFaceDown()
        {
            if (!isFaceUp) return;
            isFaceUp = false;

            StartCoroutine(FlipAnimation(false));
        }

        public void FlipFaceUp()
        {
            if (isFaceUp) return;
            isFaceUp = true;

            StartCoroutine(FlipAnimation(true));
        }

        System.Collections.IEnumerator FlipAnimation(bool faceUp)
        {
            float elapsed = 0f;
            Vector3 startRotation = transform.localRotation.eulerAngles;
            Vector3 endRotation = startRotation;
            endRotation.y += faceUp ? 180f : -180f;

            while (elapsed < flipDuration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = Mathf.Clamp01(elapsed / flipDuration);
                t = Mathf.SmoothStep(0f, 1f, t);

                transform.localRotation = Quaternion.Euler(
                    Vector3.Lerp(startRotation, endRotation, t)
                );

                yield return null;
            }

            transform.localRotation = Quaternion.Euler(endRotation);
        }

        /// <summary>
        /// Select card (highlight effect)
        /// </summary>
        public void Select()
        {
            transform.localPosition = new Vector3(0, 20f, 0);
        }

        public void Deselect()
        {
            transform.localPosition = Vector3.zero;
        }
    }
}
