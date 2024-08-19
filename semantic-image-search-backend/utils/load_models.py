import logging
from functools import lru_cache

from sentence_transformers import SentenceTransformer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@lru_cache()
def load_transformers_models():
    logging.info("Loading image and text models...")
    img_model = SentenceTransformer('clip-ViT-B-32')
    logging.info("img model loaded!")
    text_model = SentenceTransformer('sentence-transformers/clip-ViT-B-32-multilingual-v1')
    logging.info("text model loaded!")

    return img_model, text_model
