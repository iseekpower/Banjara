from fastapi import FastAPI, APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage
import qrcode
from io import BytesIO


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class TrekBooking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    trek_name: str
    person_count: int
    date: str
    full_name: str
    email: EmailStr
    phone: str
    cost: int = 5000
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TrekBookingCreate(BaseModel):
    trek_id: Optional[str] = None
    trek_name: str
    person_count: int
    date: str
    full_name: str
    email: EmailStr
    phone: str
    payment_method: str = "upi"  # upi, cash, online
    payment_status: str = "pending"  # pending, paid, failed


class BBQBooking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: str
    person_count: int
    full_name: str
    email: EmailStr
    phone: str
    special_requests: Optional[str] = None
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BBQBookingCreate(BaseModel):
    date: str
    person_count: int
    full_name: str
    email: EmailStr
    phone: str
    special_requests: Optional[str] = None


class RoomInquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    check_in: str
    check_out: str
    guest_count: int
    room_type: Optional[str] = None
    full_name: str
    email: EmailStr
    phone: str
    message: Optional[str] = None
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class RoomInquiryCreate(BaseModel):
    check_in: str
    check_out: str
    guest_count: int
    room_type: Optional[str] = None
    full_name: str
    email: EmailStr
    phone: str
    message: Optional[str] = None


class MenuItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    price: Optional[int] = None
    category: str
    available: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MenuItemCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: Optional[int] = None
    category: str
    available: bool = True

class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    category: Optional[str] = None
    available: Optional[bool] = None


class FAQ(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question: str
    answer: str
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class FAQCreate(BaseModel):
    question: str
    answer: str
    order: int = 0

class FAQUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    order: Optional[int] = None


class HouseRule(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    rule: str
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class HouseRuleCreate(BaseModel):
    rule: str
    order: int = 0

class HouseRuleUpdate(BaseModel):
    rule: Optional[str] = None
    order: Optional[int] = None


class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    role: str
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    response: str
    session_id: str


class AdminLogin(BaseModel):
    password: str

class AdminLoginResponse(BaseModel):
    success: bool
    message: str


# Trek Booking Endpoints
@api_router.post("/bookings/trek", response_model=TrekBooking)
async def create_trek_booking(booking: TrekBookingCreate):
    booking_dict = booking.model_dump()
    booking_obj = TrekBooking(**booking_dict, cost=5000 * booking.person_count)
    
    doc = booking_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.trek_bookings.insert_one(doc)
    return booking_obj

@api_router.get("/bookings/trek", response_model=List[TrekBooking])
async def get_trek_bookings():
    bookings = await db.trek_bookings.find({}, {"_id": 0}).to_list(1000)
    
    for booking in bookings:
        if isinstance(booking['created_at'], str):
            booking['created_at'] = datetime.fromisoformat(booking['created_at'])
    
    return bookings


# BBQ Booking Endpoints
@api_router.post("/bookings/bbq", response_model=BBQBooking)
async def create_bbq_booking(booking: BBQBookingCreate):
    booking_dict = booking.model_dump()
    booking_obj = BBQBooking(**booking_dict)
    
    doc = booking_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.bbq_bookings.insert_one(doc)
    return booking_obj

@api_router.get("/bookings/bbq", response_model=List[BBQBooking])
async def get_bbq_bookings():
    bookings = await db.bbq_bookings.find({}, {"_id": 0}).to_list(1000)
    
    for booking in bookings:
        if isinstance(booking['created_at'], str):
            booking['created_at'] = datetime.fromisoformat(booking['created_at'])
    
    return bookings


# Room Inquiry Endpoints
@api_router.post("/inquiries/room", response_model=RoomInquiry)
async def create_room_inquiry(inquiry: RoomInquiryCreate):
    inquiry_dict = inquiry.model_dump()
    inquiry_obj = RoomInquiry(**inquiry_dict)
    
    doc = inquiry_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.room_inquiries.insert_one(doc)
    return inquiry_obj

@api_router.get("/inquiries/room", response_model=List[RoomInquiry])
async def get_room_inquiries():
    inquiries = await db.room_inquiries.find({}, {"_id": 0}).to_list(1000)
    
    for inquiry in inquiries:
        if isinstance(inquiry['created_at'], str):
            inquiry['created_at'] = datetime.fromisoformat(inquiry['created_at'])
    
    return inquiries


# Menu Endpoints
@api_router.get("/menu", response_model=List[MenuItem])
async def get_menu():
    items = await db.menu_items.find({}, {"_id": 0}).to_list(1000)
    
    for item in items:
        if isinstance(item.get('created_at'), str):
            item['created_at'] = datetime.fromisoformat(item['created_at'])
    
    return items

@api_router.post("/menu", response_model=MenuItem)
async def create_menu_item(item: MenuItemCreate):
    item_dict = item.model_dump()
    item_obj = MenuItem(**item_dict)
    
    doc = item_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.menu_items.insert_one(doc)
    return item_obj

@api_router.put("/menu/{item_id}", response_model=MenuItem)
async def update_menu_item(item_id: str, item: MenuItemUpdate):
    existing = await db.menu_items.find_one({"id": item_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    update_data = {k: v for k, v in item.model_dump().items() if v is not None}
    
    await db.menu_items.update_one({"id": item_id}, {"$set": update_data})
    
    updated = await db.menu_items.find_one({"id": item_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    
    return MenuItem(**updated)

@api_router.delete("/menu/{item_id}")
async def delete_menu_item(item_id: str):
    result = await db.menu_items.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return {"message": "Menu item deleted successfully"}


# FAQ Endpoints
@api_router.get("/faqs", response_model=List[FAQ])
async def get_faqs():
    faqs = await db.faqs.find({}, {"_id": 0}).to_list(1000)
    
    for faq in faqs:
        if isinstance(faq.get('created_at'), str):
            faq['created_at'] = datetime.fromisoformat(faq['created_at'])
    
    return sorted(faqs, key=lambda x: x.get('order', 0))

@api_router.post("/faqs", response_model=FAQ)
async def create_faq(faq: FAQCreate):
    faq_dict = faq.model_dump()
    faq_obj = FAQ(**faq_dict)
    
    doc = faq_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.faqs.insert_one(doc)
    return faq_obj

@api_router.put("/faqs/{faq_id}", response_model=FAQ)
async def update_faq(faq_id: str, faq: FAQUpdate):
    existing = await db.faqs.find_one({"id": faq_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="FAQ not found")
    
    update_data = {k: v for k, v in faq.model_dump().items() if v is not None}
    
    await db.faqs.update_one({"id": faq_id}, {"$set": update_data})
    
    updated = await db.faqs.find_one({"id": faq_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    
    return FAQ(**updated)

@api_router.delete("/faqs/{faq_id}")
async def delete_faq(faq_id: str):
    result = await db.faqs.delete_one({"id": faq_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return {"message": "FAQ deleted successfully"}


# House Rules Endpoints
@api_router.get("/rules", response_model=List[HouseRule])
async def get_rules():
    rules = await db.house_rules.find({}, {"_id": 0}).to_list(1000)
    
    for rule in rules:
        if isinstance(rule.get('created_at'), str):
            rule['created_at'] = datetime.fromisoformat(rule['created_at'])
    
    return sorted(rules, key=lambda x: x.get('order', 0))

@api_router.post("/rules", response_model=HouseRule)
async def create_rule(rule: HouseRuleCreate):
    rule_dict = rule.model_dump()
    rule_obj = HouseRule(**rule_dict)
    
    doc = rule_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.house_rules.insert_one(doc)
    return rule_obj

@api_router.put("/rules/{rule_id}", response_model=HouseRule)
async def update_rule(rule_id: str, rule: HouseRuleUpdate):
    existing = await db.house_rules.find_one({"id": rule_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="House rule not found")
    
    update_data = {k: v for k, v in rule.model_dump().items() if v is not None}
    
    await db.house_rules.update_one({"id": rule_id}, {"$set": update_data})
    
    updated = await db.house_rules.find_one({"id": rule_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    
    return HouseRule(**updated)

@api_router.delete("/rules/{rule_id}")
async def delete_rule(rule_id: str):
    result = await db.house_rules.delete_one({"id": rule_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="House rule not found")
    return {"message": "House rule deleted successfully"}


# AI Chat Assistant Endpoint
@api_router.post("/chat/ai-assistant", response_model=ChatResponse)
async def chat_with_assistant(chat_request: ChatRequest):
    # Store user message
    user_msg = ChatMessage(
        session_id=chat_request.session_id,
        role="user",
        content=chat_request.message
    )
    user_doc = user_msg.model_dump()
    user_doc['created_at'] = user_doc['created_at'].isoformat()
    await db.chat_messages.insert_one(user_doc)
    
    # Get chat history for context
    history = await db.chat_messages.find(
        {"session_id": chat_request.session_id},
        {"_id": 0}
    ).sort("created_at", 1).to_list(100)
    
    # Initialize LLM Chat
    system_message = """You are a helpful travel assistant for Banjara Barracks, a cozy homestay in Kalga, Himachal Pradesh. 
    
    Key Information:
    - Location: Start of Kalgha village, with breathtaking Himalayan views
    - Atmosphere: Peaceful retreat away from city hustle-bustle
    - Views: Sunset views, cloud shows, apple orchards, snow-covered mountains
    - Amenities: Clean bathrooms, comfortable bedrooms, valley views
    - Food: Continental to local cuisine
    - Activities: Treks (₹5000/person flat), BBQ nights, day walks, small picnics
    - Available Treks: Bhunbhuni Trek, Bhandak, Bishkeri, Tevla trek
    
    Your role is to:
    1. Ask about their trip duration, type (leisure/workation), weather preferences
    2. Suggest activities and treks based on their interests
    3. Provide tentative costing (rooms vary, treks ₹5000/person)
    4. Suggest what to carry based on season and activities
    5. Create personalized itineraries
    
    Be warm, informative, and help them plan an amazing Himalayan experience!"""
    
    try:
        chat = LlmChat(
            api_key=os.environ['EMERGENT_LLM_KEY'],
            session_id=chat_request.session_id,
            system_message=system_message
        ).with_model("openai", "gpt-4o")
        
        user_message = UserMessage(text=chat_request.message)
        response = await chat.send_message(user_message)
        
        # Store assistant response
        assistant_msg = ChatMessage(
            session_id=chat_request.session_id,
            role="assistant",
            content=response
        )
        assistant_doc = assistant_msg.model_dump()
        assistant_doc['created_at'] = assistant_doc['created_at'].isoformat()
        await db.chat_messages.insert_one(assistant_doc)
        
        return ChatResponse(response=response, session_id=chat_request.session_id)
    
    except Exception as e:
        logger.error(f"Error in AI chat: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")


# Admin Login Endpoint
@api_router.post("/admin/login", response_model=AdminLoginResponse)
async def admin_login(login: AdminLogin):
    admin_password = os.environ.get('ADMIN_PASSWORD', 'banjara-core-admin-2024')
    
    if login.password == admin_password:
        return AdminLoginResponse(success=True, message="Login successful")
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid password"
        )


# Food Ordering Models
class FoodOrder(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_type: str  # "guest" or "village"
    customer_name: str
    phone: str
    room_number: Optional[str] = None  # For guest orders
    delivery_address: Optional[str] = None  # For village orders
    items: List[dict]  # [{menu_item_id, name, quantity, price}]
    total_amount: int
    estimated_time: int  # minutes
    special_instructions: Optional[str] = None
    status: str = "pending"  # pending, preparing, ready, delivered, cancelled
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class FoodOrderCreate(BaseModel):
    order_type: str
    customer_name: str
    phone: str
    room_number: Optional[str] = None
    delivery_address: Optional[str] = None
    items: List[dict]
    total_amount: int
    estimated_time: int
    special_instructions: Optional[str] = None

class Subscription(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    phone: str
    address: str
    plan_type: str  # "daily", "weekly", "monthly"
    meal_preferences: List[str]  # ["breakfast", "lunch", "dinner"]
    start_date: str
    end_date: Optional[str] = None
    price_per_day: int
    total_paid: int
    status: str = "active"  # active, paused, cancelled
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SubscriptionCreate(BaseModel):
    customer_name: str
    phone: str
    address: str
    plan_type: str
    meal_preferences: List[str]
    start_date: str
    end_date: Optional[str] = None
    price_per_day: int
    total_paid: int

class Announcement(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    event_type: str  # "jam_night", "pizza_night", "bbq", "bonfire", "other"
    event_date: Optional[str] = None
    image_url: Optional[str] = None
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AnnouncementCreate(BaseModel):
    title: str
    description: str
    event_type: str
    event_date: Optional[str] = None
    image_url: Optional[str] = None
    active: bool = True


# Trek Models
class Trek(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    duration: str  # e.g., "4-5 hours"
    difficulty: str  # Easy, Moderate, Challenging
    price: int = 5000
    description: str
    highlights: List[str]
    best_season: str
    what_to_carry: List[str]
    images: List[str]  # URLs of trek images
    altitude: Optional[str] = None
    distance: Optional[str] = None
    featured: bool = False
    active: bool = True
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TrekCreate(BaseModel):
    name: str
    duration: str
    difficulty: str
    price: int = 5000
    description: str
    highlights: List[str]
    best_season: str
    what_to_carry: List[str]
    images: List[str]
    altitude: Optional[str] = None
    distance: Optional[str] = None
    featured: bool = False
    active: bool = True
    order: int = 0

class TrekUpdate(BaseModel):
    name: Optional[str] = None
    duration: Optional[str] = None
    difficulty: Optional[str] = None
    price: Optional[int] = None
    description: Optional[str] = None
    highlights: Optional[List[str]] = None
    best_season: Optional[str] = None
    what_to_carry: Optional[List[str]] = None
    images: Optional[List[str]] = None
    altitude: Optional[str] = None
    distance: Optional[str] = None
    featured: Optional[bool] = None
    active: Optional[bool] = None
    order: Optional[int] = None


# Gallery Models (Life at Barracks)
class GalleryImage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: Optional[str] = None
    image_url: str
    category: str  # e.g., "events", "nature", "people", "food", "rooms"
    order: int = 0
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GalleryImageCreate(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: str
    category: str
    order: int = 0
    active: bool = True


# Food Ordering Endpoints
@api_router.get("/menu/food", response_model=List[dict])
async def get_food_menu():
    """Get complete food menu from Hemu's kitchen"""
    items = await db.menu_items.find({}, {"_id": 0}).to_list(1000)
    return items

@api_router.post("/orders/food", response_model=FoodOrder)
async def create_food_order(order: FoodOrderCreate):
    """Create new food order"""
    order_dict = order.model_dump()
    order_obj = FoodOrder(**order_dict)
    
    doc = order_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.food_orders.insert_one(doc)
    return order_obj

@api_router.get("/orders/food", response_model=List[FoodOrder])
async def get_food_orders():
    """Get all food orders (admin)"""
    orders = await db.food_orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for order in orders:
        if isinstance(order['created_at'], str):
            order['created_at'] = datetime.fromisoformat(order['created_at'])
    
    return orders

@api_router.put("/orders/food/{order_id}/status")
async def update_order_status(order_id: str, status: str):
    """Update food order status"""
    result = await db.food_orders.update_one(
        {"id": order_id},
        {"$set": {"status": status}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {"message": "Order status updated", "status": status}


# Subscription Endpoints
@api_router.post("/subscriptions", response_model=Subscription)
async def create_subscription(subscription: SubscriptionCreate):
    """Create meal subscription"""
    sub_dict = subscription.model_dump()
    sub_obj = Subscription(**sub_dict)
    
    doc = sub_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.subscriptions.insert_one(doc)
    return sub_obj

@api_router.get("/subscriptions", response_model=List[Subscription])
async def get_subscriptions():
    """Get all subscriptions (admin)"""
    subs = await db.subscriptions.find({}, {"_id": 0}).to_list(1000)
    
    for sub in subs:
        if isinstance(sub['created_at'], str):
            sub['created_at'] = datetime.fromisoformat(sub['created_at'])
    
    return subs

@api_router.put("/subscriptions/{sub_id}/status")
async def update_subscription_status(sub_id: str, status: str):
    """Update subscription status"""
    result = await db.subscriptions.update_one(
        {"id": sub_id},
        {"$set": {"status": status}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    return {"message": "Subscription status updated", "status": status}


# Announcements Endpoints
@api_router.get("/announcements", response_model=List[Announcement])
async def get_announcements():
    """Get all active announcements"""
    announcements = await db.announcements.find({"active": True}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for announcement in announcements:
        if isinstance(announcement['created_at'], str):
            announcement['created_at'] = datetime.fromisoformat(announcement['created_at'])
    
    return announcements

@api_router.post("/announcements", response_model=Announcement)
async def create_announcement(announcement: AnnouncementCreate):
    """Create new announcement (admin)"""
    ann_dict = announcement.model_dump()
    ann_obj = Announcement(**ann_dict)
    
    doc = ann_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.announcements.insert_one(doc)
    return ann_obj

@api_router.delete("/announcements/{announcement_id}")
async def delete_announcement(announcement_id: str):
    """Delete announcement"""
    result = await db.announcements.delete_one({"id": announcement_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Announcement not found")
    
    return {"message": "Announcement deleted successfully"}


# Trek Management Endpoints
@api_router.get("/treks", response_model=List[Trek])
async def get_treks():
    """Get all active treks"""
    treks = await db.treks.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(1000)
    
    for trek in treks:
        if isinstance(trek.get('created_at'), str):
            trek['created_at'] = datetime.fromisoformat(trek['created_at'])
    
    return treks

@api_router.get("/treks/{trek_id}", response_model=Trek)
async def get_trek(trek_id: str):
    """Get single trek details"""
    trek = await db.treks.find_one({"id": trek_id}, {"_id": 0})
    
    if not trek:
        raise HTTPException(status_code=404, detail="Trek not found")
    
    if isinstance(trek.get('created_at'), str):
        trek['created_at'] = datetime.fromisoformat(trek['created_at'])
    
    return Trek(**trek)

@api_router.post("/treks", response_model=Trek)
async def create_trek(trek: TrekCreate):
    """Create new trek (admin)"""
    trek_dict = trek.model_dump()
    trek_obj = Trek(**trek_dict)
    
    doc = trek_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.treks.insert_one(doc)
    return trek_obj

@api_router.put("/treks/{trek_id}", response_model=Trek)
async def update_trek(trek_id: str, trek: TrekUpdate):
    """Update trek (admin)"""
    existing = await db.treks.find_one({"id": trek_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Trek not found")
    
    update_data = {k: v for k, v in trek.model_dump().items() if v is not None}
    
    await db.treks.update_one({"id": trek_id}, {"$set": update_data})
    
    updated = await db.treks.find_one({"id": trek_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    
    return Trek(**updated)

@api_router.delete("/treks/{trek_id}")
async def delete_trek(trek_id: str):
    """Delete trek (admin)"""
    result = await db.treks.delete_one({"id": trek_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Trek not found")
    return {"message": "Trek deleted successfully"}


# Gallery Management Endpoints
@api_router.get("/gallery", response_model=List[GalleryImage])
async def get_gallery():
    """Get all active gallery images"""
    images = await db.gallery.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(1000)
    
    for img in images:
        if isinstance(img.get('created_at'), str):
            img['created_at'] = datetime.fromisoformat(img['created_at'])
    
    return images

@api_router.post("/gallery", response_model=GalleryImage)
async def create_gallery_image(image: GalleryImageCreate):
    """Add image to gallery (admin)"""
    img_dict = image.model_dump()
    img_obj = GalleryImage(**img_dict)
    
    doc = img_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.gallery.insert_one(doc)
    return img_obj

@api_router.delete("/gallery/{image_id}")
async def delete_gallery_image(image_id: str):
    """Delete gallery image (admin)"""
    result = await db.gallery.delete_one({"id": image_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    return {"message": "Image deleted successfully"}


# QR Code Generation
@api_router.get("/qr/food-menu")
async def generate_food_menu_qr():
    """Generate QR code for food menu"""
    # Get the base URL from environment or use default
    base_url = os.environ.get('FRONTEND_URL', 'https://mountain-retreat-6.preview.emergentagent.com')
    food_url = f"{base_url}/food"
    
    # Create QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(food_url)
    qr.make(fit=True)
    
    # Create image
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Save to bytes
    img_io = BytesIO()
    img.save(img_io, 'PNG')
    img_io.seek(0)
    
    return StreamingResponse(img_io, media_type="image/png")


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
