import os
import time
import requests
import warnings
import csv
import io
import google.generativeai as genai
from astrapy import DataAPIClient
from astrapy.info import CollectionDefinition
from astrapy.constants import VectorMetric
from dotenv import load_dotenv

warnings.filterwarnings("ignore")
load_dotenv(dotenv_path="../.env.local")

# Config
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
ASTRA_TOKEN = os.environ.get("ASTRA_DB_APPLICATION_TOKEN")
ASTRA_ENDPOINT = os.environ.get("ASTRA_DB_API_ENDPOINT")
ASTRA_NAMESPACE = os.environ.get("ASTRA_DB_NAMESPACE", "default_keyspace")
COLLECTION_NAME = "laws_vectors"

genai.configure(api_key=GEMINI_API_KEY)

astra_client = DataAPIClient(ASTRA_TOKEN)
db = astra_client.get_database(ASTRA_ENDPOINT, keyspace=ASTRA_NAMESPACE)

def setup_collection():
    collections = db.list_collection_names()
    if COLLECTION_NAME not in collections:
        print(f"Creating '{COLLECTION_NAME}' collection...")
        collection_definition = (
            CollectionDefinition.builder()
            .set_vector_dimension(3072)
            .set_vector_metric(VectorMetric.COSINE)
            .build()
        )
        db.create_collection(COLLECTION_NAME, definition=collection_definition)
        print("Vector collection initialized.")

def embed_text(text):
    try:
        result = genai.embed_content(
            model="models/gemini-embedding-001",
            content=text,
            task_type="retrieval_document"
        )
        return result['embedding']
    except Exception as e:
        print(f"Embedding error: {e}")
        return None

def chunk_text(text, chunk_size=1000):
    """Splits raw act text into logical chunks of roughly 1000 characters."""
    paragraphs = text.split('\n\n')
    chunks = []
    current_chunk = ""
    for p in paragraphs:
        if len(current_chunk) + len(p) > chunk_size and current_chunk:
            chunks.append(current_chunk.strip())
            current_chunk = p
        else:
            current_chunk += "\n\n" + p
    if current_chunk:
        chunks.append(current_chunk.strip())
    return chunks

def scrape_github_laws():
    print("Fetching index of all Sri Lankan laws from open-source GitHub datasets...")
    tsv_url = "https://raw.githubusercontent.com/nuuuwan/lk_legal_docs/data_lk_acts/data/lk_acts/docs_all.tsv"
    res = requests.get(tsv_url)
    res.raise_for_status()
    
    # Parse TSV
    reader = csv.DictReader(io.StringIO(res.text), delimiter='\t')
    english_acts = [row for row in reader if row.get('lang') == 'en']
    
    print(f"Found {len(english_acts)} English acts.")
    
    # For demonstration, limit to the 5 most recent acts.
    # Set LIMIT = None to ingest all 1,300+ English acts.
    LIMIT = None
    acts_to_process = english_acts[:LIMIT] if LIMIT else english_acts
    
    collection = db.get_collection(COLLECTION_NAME)
    
    for i, act in enumerate(acts_to_process):
        doc_id = act['doc_id']
        title = act['description']
        year = act['date_str'][:4]
        decade = f"{year[:3]}0s"
        
        print(f"\n[{i+1}/{len(acts_to_process)}] Processing Act: {title} ({year})")
        
        # Construct raw txt URL based on repo structure
        txt_url = f"https://raw.githubusercontent.com/nuuuwan/lk_legal_docs/data_lk_acts/data/lk_acts/{decade}/{year}/{doc_id}/doc.txt"
        
        try:
            txt_res = requests.get(txt_url)
            if txt_res.status_code != 200:
                print(f"  -> Failed to fetch text (Status {txt_res.status_code})")
                continue
                
            raw_text = txt_res.text
            if len(raw_text) < 50:
                print("  -> Text too short to process. Skipping.")
                continue
                
            chunks = chunk_text(raw_text)
            print(f"  -> Split into {len(chunks)} chunks.")
            
            for chunk_idx, chunk in enumerate(chunks):
                # 1. Embed chunk
                vector = embed_text(chunk)
                if not vector:
                    time.sleep(1) # Wait if rate limited
                    continue
                
                # 2. Prepare DB mapping
                chunk_id = f"{doc_id}_chunk_{chunk_idx}"
                doc = {
                    "_id": chunk_id,
                    "act_title": title,
                    "act_year": year,
                    "section": f"Part {chunk_idx + 1}",
                    "content": chunk,
                    "$vector": vector
                }
                
                # 3. Insert into Astra
                collection.find_one_and_replace({"_id": chunk_id}, doc, upsert=True)
                time.sleep(0.5) # Gentle rate limiting for Gemini
                
            print(f"  -> Successfully ingested all chunks for {title}")
            
        except Exception as e:
            print(f"  -> Error processing {title}: {e}")

if __name__ == "__main__":
    setup_collection()
    scrape_github_laws()
    print("\nData pipeline extraction and vector ingestion complete!")
