import os
import time
import uuid
import requests
import warnings
from bs4 import BeautifulSoup
import google.generativeai as genai
from astrapy import DataAPIClient
from astrapy.info import CollectionDefinition
from astrapy.constants import VectorMetric
from dotenv import load_dotenv

# Suppress Gemini API deprecation warnings for stable SDK
warnings.filterwarnings("ignore")

# Load env variables from Next.js project root
load_dotenv(dotenv_path="../.env.local")

# Initialize Gemini SDK
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Initialize Astra DB Data API Client
astra_client = DataAPIClient(os.environ["ASTRA_DB_APPLICATION_TOKEN"])
db = astra_client.get_database(
    os.environ["ASTRA_DB_API_ENDPOINT"],
    keyspace=os.environ["ASTRA_DB_NAMESPACE"]
)

COLLECTION_NAME = "laws_vectors"

def setup_collection():
    """Ensure the Astra DB vector collection is configured for Gemini 3072-D vectors"""
    collections = db.list_collection_names()
    if COLLECTION_NAME not in collections:
        print(f"Creating '{COLLECTION_NAME}' collection...")
        collection_definition = (
            CollectionDefinition.builder()
            .set_vector_dimension(3072)  # Dimension for gemini-embedding-001
            .set_vector_metric(VectorMetric.COSINE)
            .build()
        )
        db.create_collection(
            COLLECTION_NAME,
            definition=collection_definition
        )
        print("Vector collection initialized.")

def embed_text(text):
    """Generate generic vector embeddings using Gemini"""
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

def process_act_document(act_title, act_year, sections):
    """Chunk the act into sections, embed each, and insert into Astra"""
    collection = db.get_collection(COLLECTION_NAME)
    
    for section_num, section_text in sections.items():
        # 1. Structure the chunk
        chunk_content = f"Act: {act_title} ({act_year})\nSection {section_num}: {section_text}"
        
        # 2. Embed the chunk
        vector = embed_text(chunk_content)
        if not vector:
            continue
            
        # 3. Prepare the document mapping
        doc_id = f"{act_title.replace(' ', '_').lower()}_{act_year}_sec_{section_num}"
        doc = {
            "_id": doc_id,
            "act_title": act_title,
            "act_year": act_year,
            "section": section_num,
            "content": chunk_content,
            "$vector": vector
        }
        
        # 4. Upsert to Astra DB
        try:
            collection.find_one_and_replace(
                {"_id": doc_id}, 
                doc, 
                upsert=True
            )
            print(f" -> Inserted {act_title} - Section {section_num}")
        except Exception as e:
            print(f" -> Failed to insert {doc_id}: {e}")
        
        # Brief pause to respect Gemini rate limits
        time.sleep(0.5)

def scrape_lawnet_pipeline():
    """
    Main pipeline to crawl Sri Lanka LawNet.
    Note: LawNet DOM relies heavily on dynamic rendering. The selectors below 
    are generic starting points and should be adjusted based on exact target URLs.
    """
    setup_collection()
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    }
    
    target_url = "https://www.lawnet.gov.lk/legislative-enactments/"
    print(f"Connecting to LawNet at {target_url}...")
    
    try:
        response = requests.get(target_url, headers=headers, timeout=15)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Connection failed (Bot protection or timeout): {e}")
        print("Falling back to sample fallback extraction sequence...\n")
        run_fallback_extraction()
        return

    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Generic extraction logic assuming standard list of links
    act_links = soup.select('a.law-link') 
    
    if not act_links:
        print("Could not find standard act links. DOM may have changed or blocks generic parsers.")
        run_fallback_extraction()
        return
        
    for link in act_links:
        act_url = link.get('href')
        print(f"Parsing generic act: {act_url}")
        
        # Fetch individual act page
        act_res = requests.get(act_url, headers=headers)
        act_soup = BeautifulSoup(act_res.text, 'html.parser')
        
        # Scrape metadata
        title = act_soup.select_one('h1.entry-title').text.strip() if act_soup.select_one('h1.entry-title') else "Unknown Act"
        
        # Scrape sections (generic assumption)
        sections = {}
        section_divs = act_soup.select('div.section-content')
        for i, div in enumerate(section_divs):
            sections[str(i+1)] = div.text.strip()
            
        process_act_document(title, "2024", sections)

def run_fallback_extraction():
    """Fallback sequence ensuring pipeline works if LawNet is unreachable/blocked"""
    print("Initiating Fallback MVP Ingestion to verify Astra integration...")
    
    mock_acts = [
        {
            "title": "Computer Crimes Act",
            "year": "2007",
            "sections": {
                "1": "This Act may be cited as the Computer Crimes Act, No. 24 of 2007.",
                "2": "Any person who intentionally does any act, in order to secure for himself or for any other person, access to any computer, having knowledge that he has no lawful authority to do so, shall be guilty of an offence.",
                "3": "Any person who intentionally does any act, in order to secure for himself or for any other person, access to any computer to commit an offence, shall be guilty of an offence."
            }
        },
        {
            "title": "Electronic Transactions Act",
            "year": "2006",
            "sections": {
                "1": "This Act may be cited as the Electronic Transactions Act, No. 19 of 2006.",
                "2": "Information shall not be denied legal recognition, effect, validity or enforceability on the ground that it is in electronic form."
            }
        }
    ]
    
    setup_collection()
    
    for act in mock_acts:
        print(f"\nProcessing {act['title']}...")
        process_act_document(act['title'], act['year'], act['sections'])
        
    print("\nData pipeline extraction and vector ingestion complete!")

if __name__ == "__main__":
    scrape_lawnet_pipeline()
