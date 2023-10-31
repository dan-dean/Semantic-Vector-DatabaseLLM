# Python script to load input data and text embedder model and index into the database.
from transformers import AutoTokenizer, AutoModel

model_dir = "./jina-embeddings-v2-base-en"

tokenizer = AutoTokenizer.from_pretrained(model_dir)
model = AutoModel.from_pretrained(model_dir)