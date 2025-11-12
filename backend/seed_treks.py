import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import uuid
from datetime import datetime, timezone

load_dotenv()

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

treks = [
    {
        "id": str(uuid.uuid4()),
        "name": "Kheerganga Trek",
        "duration": "4-6 hours",
        "difficulty": "Moderate",
        "price": 5000,
        "description": "One of the most popular treks in Parvati Valley, Kheerganga offers stunning views, natural hot springs, and an unforgettable Himalayan experience. The trek takes you through dense pine forests, over wooden bridges, and past beautiful waterfalls.",
        "highlights": [
            "Natural hot water springs at the summit",
            "Breathtaking views of Parvati Valley",
            "Dense pine and deodar forests",
            "Rudranag waterfall enroute",
            "Camping under starlit sky"
        ],
        "best_season": "April to June, September to November",
        "what_to_carry": [
            "Comfortable trekking shoes",
            "Water bottle (2L)",
            "Energy snacks",
            "Light jacket",
            "Towel for hot springs",
            "Sunscreen and cap",
            "Basic first-aid kit"
        ],
        "images": [
            "https://images.unsplash.com/photo-1611875371292-a2bbee7c496b?w=800&q=80",
            "https://images.unsplash.com/photo-1638801428412-cadc850fbd8e?w=800&q=80"
        ],
        "altitude": "2,960 meters",
        "distance": "12-13 km",
        "featured": True,
        "active": True,
        "order": 1,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Bunbuni Pass Trek",
        "duration": "5-6 hours",
        "difficulty": "Moderate",
        "price": 5000,
        "description": "Starting right from Kalga, Bunbuni Pass trek offers spectacular 360-degree views of the Parvati Valley and surrounding Himalayan peaks. Less crowded than Kheerganga, this trek provides a more authentic mountain experience.",
        "highlights": [
            "Panoramic valley views",
            "Dense rhododendron forests",
            "Alpine meadows",
            "Bird watching opportunities",
            "Can be combined with Kheerganga"
        ],
        "best_season": "May to June (rhododendrons bloom), September to October",
        "what_to_carry": [
            "Trekking shoes",
            "Water and snacks",
            "Camera for stunning views",
            "Warm layers",
            "Sun protection"
        ],
        "images": [
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
            "https://images.unsplash.com/photo-1544442069-97dded965a9f?w=800&q=80"
        ],
        "altitude": "3,000 meters",
        "distance": "10 km",
        "featured": True,
        "active": True,
        "order": 2,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Bhandak Trek",
        "duration": "5-6 hours",
        "difficulty": "Moderate",
        "price": 5000,
        "description": "Bhandak trek takes you through pristine forests and offers stunning views of snow-capped peaks. The trail is less commercialized, providing a peaceful trekking experience away from crowds.",
        "highlights": [
            "Serene mountain landscapes",
            "Traditional village culture",
            "Wildlife spotting",
            "Crystal clear mountain streams",
            "Off-beat trail experience"
        ],
        "best_season": "April to June, September to November",
        "what_to_carry": [
            "Good trekking boots",
            "Adequate water supply",
            "Trail snacks",
            "Rain jacket",
            "Personal medication"
        ],
        "images": [
            "https://images.unsplash.com/photo-1481340101608-cb5f45cb1f99?w=800&q=80"
        ],
        "altitude": "2,800 meters",
        "distance": "11 km",
        "featured": False,
        "active": True,
        "order": 3
    },
    {
        "name": "Bishkeri Trek",
        "duration": "6-7 hours",
        "difficulty": "Challenging",
        "price": 5000,
        "description": "Bishkeri is a challenging trek that rewards trekkers with pristine alpine meadows and spectacular mountain vistas. This high-altitude trek is perfect for experienced trekkers seeking adventure.",
        "highlights": [
            "High altitude alpine meadows",
            "Spectacular mountain panoramas",
            "Remote wilderness experience",
            "Challenging trail sections",
            "Unique flora and fauna"
        ],
        "best_season": "May to October",
        "what_to_carry": [
            "Quality trekking gear",
            "Extra warm clothing",
            "High-energy food",
            "Walking stick recommended",
            "Emergency supplies"
        ],
        "images": [
            "https://images.unsplash.com/photo-1638801428412-cadc850fbd8e?w=800&q=80"
        ],
        "altitude": "3,200 meters",
        "distance": "14 km",
        "featured": False,
        "active": True,
        "order": 4
    },
    {
        "name": "Tevla Trek",
        "duration": "3-4 hours",
        "difficulty": "Easy",
        "price": 5000,
        "description": "Perfect for beginners and families, Tevla trek is a short, easy walk through beautiful forests to a scenic viewpoint. Great for acclimatization before longer treks.",
        "highlights": [
            "Beginner-friendly trail",
            "Beautiful forest walk",
            "Scenic viewpoints",
            "Perfect for families",
            "Half-day activity"
        ],
        "best_season": "Year-round (except heavy snow)",
        "what_to_carry": [
            "Comfortable walking shoes",
            "Water bottle",
            "Light snacks",
            "Camera",
            "Light backpack"
        ],
        "images": [
            "https://images.unsplash.com/photo-1611875371292-a2bbee7c496b?w=800&q=80"
        ],
        "altitude": "2,500 meters",
        "distance": "6 km",
        "featured": False,
        "active": True,
        "order": 5
    }
]

async def seed_treks():
    # Clear existing treks
    await db.treks.delete_many({})
    print("Cleared existing treks")
    
    # Insert new treks
    result = await db.treks.insert_many(treks)
    print(f"Inserted {len(result.inserted_ids)} treks")
    print("Treks seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_treks())
