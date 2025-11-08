import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

menu_items = [
    # Quick Bites & Breakfast
    {"name": "Maggi Plain", "category": "Quick Bites", "cooking_time": 15, "price": 70, "vegetarian": True, "available": True, "meal_time": ["breakfast", "snack"], "parent": "Maggi", "variation": "Plain"},
    {"name": "Maggi Veg", "category": "Quick Bites", "cooking_time": 15, "price": 120, "vegetarian": True, "available": True, "meal_time": ["breakfast", "snack"], "parent": "Maggi", "variation": "Veg"},
    {"name": "Maggi Egg", "category": "Quick Bites", "cooking_time": 15, "price": 120, "vegetarian": False, "available": True, "meal_time": ["breakfast", "snack"], "parent": "Maggi", "variation": "Egg"},
    {"name": "Maggi Tadka", "category": "Quick Bites", "cooking_time": 15, "price": 120, "vegetarian": True, "available": True, "meal_time": ["breakfast", "snack"], "parent": "Maggi", "variation": "Tadka"},
    
    {"name": "Sandwich Veg", "category": "Quick Bites", "cooking_time": 15, "price": 150, "vegetarian": True, "available": True, "meal_time": ["breakfast", "snack"], "parent": "Sandwich", "variation": "Veg"},
    {"name": "Sandwich Fried Egg", "category": "Quick Bites", "cooking_time": 15, "price": 180, "vegetarian": False, "available": True, "meal_time": ["breakfast", "snack"], "parent": "Sandwich", "variation": "Fried Egg"},
    {"name": "Sandwich Chicken", "category": "Quick Bites", "cooking_time": 15, "price": 200, "vegetarian": False, "available": True, "meal_time": ["breakfast", "snack"], "parent": "Sandwich", "variation": "Chicken"},
    
    {"name": "Omelette Plain", "category": "Breakfast", "cooking_time": 15, "price": 60, "vegetarian": False, "available": True, "meal_time": ["breakfast"], "parent": "Omelette", "variation": "Plain"},
    {"name": "Omelette Masala", "category": "Breakfast", "cooking_time": 15, "price": 75, "vegetarian": False, "available": True, "meal_time": ["breakfast"], "parent": "Omelette", "variation": "Masala"},
    {"name": "Bread Omelette", "category": "Breakfast", "cooking_time": 15, "price": 80, "vegetarian": False, "available": True, "meal_time": ["breakfast"], "parent": "Omelette", "variation": "Bread Omelette"},
    {"name": "Cheese Omelette", "category": "Breakfast", "cooking_time": 15, "price": 120, "vegetarian": False, "available": True, "meal_time": ["breakfast"], "parent": "Omelette", "variation": "Cheese"},
    {"name": "Mushroom Omelette", "category": "Breakfast", "cooking_time": 15, "price": 150, "vegetarian": False, "available": True, "meal_time": ["breakfast"], "parent": "Omelette", "variation": "Mushroom"},
    
    {"name": "Parantha Plain", "category": "Breakfast", "cooking_time": 15, "price": 50, "vegetarian": True, "available": True, "meal_time": ["breakfast"], "parent": "Parantha", "variation": "Plain"},
    {"name": "Parantha Paneer", "category": "Breakfast", "cooking_time": 15, "price": 120, "vegetarian": True, "available": True, "meal_time": ["breakfast"], "parent": "Parantha", "variation": "Paneer"},
    {"name": "Parantha Egg", "category": "Breakfast", "cooking_time": 15, "price": 100, "vegetarian": False, "available": True, "meal_time": ["breakfast"], "parent": "Parantha", "variation": "Egg"},
    
    # Fast Cooking Main Items (20-45 mins)
    {"name": "Malai Pyaaz", "category": "Main Course", "cooking_time": 20, "price": 150, "vegetarian": True, "available": True, "meal_time": ["lunch", "dinner"], "description": "Creamy onion curry"},
    {"name": "Baigan ka Bharta", "category": "Main Course", "cooking_time": 25, "price": 180, "vegetarian": True, "available": True, "meal_time": ["lunch", "dinner"], "description": "Smoky roasted eggplant"},
    {"name": "Aloo Tamatar", "category": "Main Course", "cooking_time": 30, "price": 150, "vegetarian": True, "available": True, "meal_time": ["lunch", "dinner"], "description": "Potato and tomato curry"},
    {"name": "Aloo Beans", "category": "Main Course", "cooking_time": 30, "price": 180, "vegetarian": True, "available": True, "meal_time": ["lunch", "dinner"], "description": "Potato and beans sabzi"},
    {"name": "Aloo Jeera", "category": "Main Course", "cooking_time": 30, "price": 120, "vegetarian": True, "available": True, "meal_time": ["lunch", "dinner"], "description": "Cumin flavored potatoes"},
    {"name": "Burger Veg", "category": "Snacks", "cooking_time": 30, "price": 300, "vegetarian": True, "available": True, "meal_time": ["snack", "lunch"], "parent": "Burger", "variation": "Veg"},
    {"name": "Burger Chicken", "category": "Snacks", "cooking_time": 30, "price": 350, "vegetarian": False, "available": True, "meal_time": ["snack", "lunch"], "parent": "Burger", "variation": "Chicken"},
    {"name": "Bhindi", "category": "Main Course", "cooking_time": 35, "price": 180, "vegetarian": True, "available": True, "meal_time": ["lunch", "dinner"], "description": "Okra stir fry"},
    {"name": "Gobi Aloo", "category": "Main Course", "cooking_time": 40, "price": 150, "vegetarian": True, "available": True, "meal_time": ["lunch", "dinner"], "description": "Cauliflower and potato"},
    {"name": "Mix Veg", "category": "Main Course", "cooking_time": 40, "price": 200, "vegetarian": True, "available": True, "meal_time": ["lunch", "dinner"], "description": "Mixed vegetable curry"},
    {"name": "Dal Fry", "category": "Main Course", "cooking_time": 40, "price": 150, "vegetarian": True, "available": True, "meal_time": ["lunch", "dinner"], "description": "Tempered lentils", "parent": "Dal", "variation": "Fry/Tadka"},
    {"name": "Vada Pav", "category": "Snacks", "cooking_time": 40, "price": 150, "vegetarian": True, "available": True, "meal_time": ["snack", "breakfast"], "description": "2 pieces with bread"},
    {"name": "Honey Chilli Potato", "category": "Snacks", "cooking_time": 40, "price": 250, "vegetarian": True, "available": True, "meal_time": ["snack"], "description": "Crispy potato tossed in honey chilli sauce"},
    {"name": "Pasta Red Sauce", "category": "Continental", "cooking_time": 40, "price": 250, "vegetarian": True, "available": True, "meal_time": ["lunch", "dinner"], "parent": "Pasta", "variation": "Red Sauce"},
    {"name": "Pasta White Sauce", "category": "Continental", "cooking_time": 40, "price": 300, "vegetarian": True, "available": True, "meal_time": ["lunch", "dinner"], "parent": "Pasta", "variation": "White Sauce"},
    {"name": "Pasta Aglio-e-Olio", "category": "Continental", "cooking_time": 45, "price": 200, "vegetarian": True, "available": True, "meal_time": ["lunch", "dinner"], "parent": "Pasta", "variation": "Aglio-e-Olio"},
    
    # Medium Cooking Time (45-90 mins)
    {"name": "Paneer Bhurji", "category": "Main Course", "cooking_time": 60, "price": 300, "vegetarian": True, "available": True, "meal_time": ["lunch", "dinner"], "description": "Scrambled cottage cheese"},
    {"name": "Pizza Veg", "category": "Continental", "cooking_time": 60, "price": 250, "vegetarian": True, "available": True, "meal_time": ["lunch", "dinner", "snack"], "parent": "Pizza", "variation": "Veg"},
    {"name": "Dal Makhni", "category": "Main Course", "cooking_time": 75, "price": 200, "vegetarian": True, "available": True, "meal_time": ["lunch", "dinner"], "description": "Creamy black lentils"},
    {"name": "Paneer Palak", "category": "Main Course", "cooking_time": 90, "price": 300, "vegetarian": True, "available": True, "meal_time": ["lunch", "dinner"], "parent": "Paneer Sabzi", "variation": "Palak"},
    {"name": "Paneer Kadai", "category": "Main Course", "cooking_time": 90, "price": 300, "vegetarian": True, "available": True, "meal_time": ["lunch", "dinner"], "parent": "Paneer Sabzi", "variation": "Kadai"},
    {"name": "Paneer Shahi", "category": "Main Course", "cooking_time": 90, "price": 300, "vegetarian": True, "available": True, "meal_time": ["lunch", "dinner"], "parent": "Paneer Sabzi", "variation": "Shahi"},
    {"name": "Paneer Matar", "category": "Main Course", "cooking_time": 90, "price": 300, "vegetarian": True, "available": True, "meal_time": ["lunch", "dinner"], "parent": "Paneer Sabzi", "variation": "Matar"},
    {"name": "Paneer Mushroom", "category": "Main Course", "cooking_time": 90, "price": 300, "vegetarian": True, "available": True, "meal_time": ["lunch", "dinner"], "parent": "Paneer Sabzi", "variation": "Mushroom"},
    {"name": "Paneer Butter Masala", "category": "Main Course", "cooking_time": 90, "price": 300, "vegetarian": True, "available": True, "meal_time": ["lunch", "dinner"], "parent": "Paneer Sabzi", "variation": "Butter Masala"},
    {"name": "Chicken Curry", "category": "Non-Veg", "cooking_time": 90, "price": 400, "vegetarian": False, "available": True, "meal_time": ["lunch", "dinner"], "description": "Traditional chicken curry"},
    {"name": "Butter Chicken", "category": "Non-Veg", "cooking_time": 90, "price": 450, "vegetarian": False, "available": True, "meal_time": ["lunch", "dinner"], "description": "Creamy tomato-based chicken"},
    {"name": "Chicken Shawarma", "category": "Non-Veg", "cooking_time": 90, "price": 350, "vegetarian": False, "available": True, "meal_time": ["lunch", "dinner", "snack"], "description": "Middle Eastern wrap"},
    {"name": "Pizza Chicken", "category": "Continental", "cooking_time": 90, "price": 400, "vegetarian": False, "available": True, "meal_time": ["lunch", "dinner", "snack"], "parent": "Pizza", "variation": "Chicken"},
    
    # Slow Cooking / Special Items
    {"name": "Litti Chokha", "category": "Special", "cooking_time": 100, "price": 350, "vegetarian": True, "available": True, "meal_time": ["lunch", "dinner"], "description": "Traditional Bihari dish"},
    {"name": "Rajma Chawal", "category": "Main Course", "cooking_time": 120, "price": 280, "vegetarian": True, "available": True, "meal_time": ["lunch", "dinner"], "description": "Kidney beans with rice", "hemu_special": True},
    {"name": "Chicken Biryani", "category": "Special", "cooking_time": 0, "price": 450, "vegetarian": False, "available": True, "meal_time": ["lunch", "dinner"], "description": "Pre-order required", "pre_order": True},
    
    # Salads
    {"name": "Salad Veg", "category": "Salads", "cooking_time": 10, "price": 150, "vegetarian": True, "available": True, "meal_time": ["lunch", "dinner", "snack"], "parent": "Salad", "variation": "Veg"},
    {"name": "Salad Paneer", "category": "Salads", "cooking_time": 10, "price": 200, "vegetarian": True, "available": True, "meal_time": ["lunch", "dinner", "snack"], "parent": "Salad", "variation": "Paneer"},
    {"name": "Salad Chicken", "category": "Salads", "cooking_time": 10, "price": 250, "vegetarian": False, "available": True, "meal_time": ["lunch", "dinner", "snack"], "parent": "Salad", "variation": "Chicken"},
]

async def seed_menu():
    # Clear existing menu
    await db.menu_items.delete_many({})
    print("Cleared existing menu items")
    
    # Insert new menu
    result = await db.menu_items.insert_many(menu_items)
    print(f"Inserted {len(result.inserted_ids)} menu items")
    print("Menu seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_menu())
