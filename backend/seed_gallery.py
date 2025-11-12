import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def seed_gallery():
    # MongoDB connection
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    # Clear existing gallery
    await db.gallery.delete_many({})
    print("Cleared existing gallery images")
    
    # Gallery images from Airbnb listing and travel-themed stock photos
    gallery_images = [
        {
            "id": str(uuid.uuid4()),
            "title": "Mountain View Balcony",
            "description": "Enjoy your morning coffee with breathtaking Himalayan views",
            "image_url": "https://a0.muscache.com/im/pictures/miso/Hosting-51261620/original/f60a8ab7-fea0-44cd-b119-18460ca3de38.jpeg",
            "category": "rooms",
            "order": 0,
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Cozy Room Interior",
            "description": "Warm and comfortable rooms with valley views",
            "image_url": "https://a0.muscache.com/im/pictures/miso/Hosting-51261620/original/10a98b24-1a16-42c9-b063-d60992c041ec.jpeg",
            "category": "rooms",
            "order": 1,
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Sunset Over Mountains",
            "description": "Spectacular sunset views from the homestay",
            "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
            "category": "nature",
            "order": 2,
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Bonfire Nights",
            "description": "Cozy bonfire evenings under the stars",
            "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
            "category": "events",
            "order": 3,
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Fresh Local Cuisine",
            "description": "Delicious home-cooked meals from Hemu's kitchen",
            "image_url": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80",
            "category": "food",
            "order": 4,
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Apple Orchards",
            "description": "Walk through scenic apple orchards",
            "image_url": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=1200&q=80",
            "category": "nature",
            "order": 5,
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    # Insert gallery images
    await db.gallery.insert_many(gallery_images)
    print(f"Inserted {len(gallery_images)} gallery images")
    
    client.close()
    print("Gallery seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_gallery())
