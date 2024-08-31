import logging
from functools import lru_cache

from sentence_transformers import SentenceTransformer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@lru_cache()
def load_transformers_models():
    try:
        logging.info("Loading image and text models...")

        img_model = SentenceTransformer('clip-ViT-B-32')
        logging.info("Image model loaded successfully!")

        text_model = SentenceTransformer('sentence-transformers/clip-ViT-B-32-multilingual-v1')
        logging.info("Text model loaded successfully!")

    except Exception as e:
        logging.error(f"An error occurred while loading models: {e}")
        raise

    return img_model, text_model
