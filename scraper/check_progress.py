import os
from astrapy import DataAPIClient
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env.local")

astra_client = DataAPIClient(os.environ.get('ASTRA_DB_APPLICATION_TOKEN'))
db = astra_client.get_database(
    os.environ.get('ASTRA_DB_API_ENDPOINT'), 
    keyspace=os.environ.get('ASTRA_DB_NAMESPACE', 'default_keyspace')
)
col = db.get_collection('laws_vectors')

# Because count_documents() on vector databases can take a while on massive datasets,
# we fetch a paginated list up to a limit (like 20,000 for 1200 acts) for a quick count.
chunks = list(col.find({}, limit=50000))
print(f"\n✅ Total laws chunks ingested into Astra DB so far: {len(chunks)}\n")
