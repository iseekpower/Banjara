import requests
import sys
import json
from datetime import datetime, timedelta

class BanjaraBarracksAPITester:
    def __init__(self, base_url="https://mountain-retreats-2.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json() if response.content else {}
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'test': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'test': name,
                'error': str(e)
            })
            return False, {}

    def test_admin_login(self):
        """Test admin login functionality"""
        print("\n=== Testing Admin Login ===")
        
        # Test with correct password
        success, response = self.run_test(
            "Admin Login - Correct Password",
            "POST",
            "admin/login",
            200,
            data={"password": "banjara-core-admin-2024"}
        )
        
        if success and response.get('success'):
            print("✅ Admin login successful")
        else:
            print("❌ Admin login failed")
            return False
            
        # Test with wrong password
        success, response = self.run_test(
            "Admin Login - Wrong Password",
            "POST", 
            "admin/login",
            401,
            data={"password": "wrong-password"}
        )
        
        return True

    def test_trek_bookings(self):
        """Test trek booking functionality"""
        print("\n=== Testing Trek Bookings ===")
        
        # Create a trek booking
        tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        trek_data = {
            "trek_name": "Bhunbhuni Trek",
            "person_count": 2,
            "date": tomorrow,
            "full_name": "Test User",
            "email": "test@example.com",
            "phone": "+91 9876543210"
        }
        
        success, response = self.run_test(
            "Create Trek Booking",
            "POST",
            "bookings/trek",
            200,
            data=trek_data
        )
        
        trek_id = None
        if success and response.get('id'):
            trek_id = response['id']
            print(f"✅ Trek booking created with ID: {trek_id}")
            print(f"   Cost calculated: ₹{response.get('cost', 'N/A')}")
        
        # Get all trek bookings
        success, response = self.run_test(
            "Get Trek Bookings",
            "GET",
            "bookings/trek",
            200
        )
        
        if success and isinstance(response, list):
            print(f"✅ Retrieved {len(response)} trek bookings")
        
        return trek_id is not None

    def test_bbq_bookings(self):
        """Test BBQ booking functionality"""
        print("\n=== Testing BBQ Bookings ===")
        
        # Create a BBQ booking
        tomorrow = (datetime.now() + timedelta(days=2)).strftime('%Y-%m-%d')
        bbq_data = {
            "date": tomorrow,
            "person_count": 4,
            "full_name": "Test BBQ User",
            "email": "bbq@example.com",
            "phone": "+91 9876543211",
            "special_requests": "Vegetarian options please"
        }
        
        success, response = self.run_test(
            "Create BBQ Booking",
            "POST",
            "bookings/bbq",
            200,
            data=bbq_data
        )
        
        bbq_id = None
        if success and response.get('id'):
            bbq_id = response['id']
            print(f"✅ BBQ booking created with ID: {bbq_id}")
        
        # Get all BBQ bookings
        success, response = self.run_test(
            "Get BBQ Bookings",
            "GET",
            "bookings/bbq",
            200
        )
        
        if success and isinstance(response, list):
            print(f"✅ Retrieved {len(response)} BBQ bookings")
        
        return bbq_id is not None

    def test_room_inquiries(self):
        """Test room inquiry functionality"""
        print("\n=== Testing Room Inquiries ===")
        
        # Create a room inquiry
        checkin = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
        checkout = (datetime.now() + timedelta(days=10)).strftime('%Y-%m-%d')
        room_data = {
            "check_in": checkin,
            "check_out": checkout,
            "guest_count": 2,
            "room_type": "Valley view",
            "full_name": "Test Room User",
            "email": "room@example.com",
            "phone": "+91 9876543212",
            "message": "Looking for a peaceful stay"
        }
        
        success, response = self.run_test(
            "Create Room Inquiry",
            "POST",
            "inquiries/room",
            200,
            data=room_data
        )
        
        room_id = None
        if success and response.get('id'):
            room_id = response['id']
            print(f"✅ Room inquiry created with ID: {room_id}")
        
        # Get all room inquiries
        success, response = self.run_test(
            "Get Room Inquiries",
            "GET",
            "inquiries/room",
            200
        )
        
        if success and isinstance(response, list):
            print(f"✅ Retrieved {len(response)} room inquiries")
        
        return room_id is not None

    def test_menu_management(self):
        """Test menu CRUD operations"""
        print("\n=== Testing Menu Management ===")
        
        # Get existing menu items
        success, response = self.run_test(
            "Get Menu Items",
            "GET",
            "menu",
            200
        )
        
        initial_count = 0
        if success and isinstance(response, list):
            initial_count = len(response)
            print(f"✅ Retrieved {initial_count} existing menu items")
        
        # Create a new menu item
        menu_data = {
            "name": "Test Dish",
            "description": "A delicious test dish",
            "price": 250,
            "category": "Test Category",
            "available": True
        }
        
        success, response = self.run_test(
            "Create Menu Item",
            "POST",
            "menu",
            200,
            data=menu_data
        )
        
        menu_id = None
        if success and response.get('id'):
            menu_id = response['id']
            print(f"✅ Menu item created with ID: {menu_id}")
        
        # Update the menu item
        if menu_id:
            update_data = {
                "name": "Updated Test Dish",
                "price": 300
            }
            
            success, response = self.run_test(
                "Update Menu Item",
                "PUT",
                f"menu/{menu_id}",
                200,
                data=update_data
            )
            
            if success:
                print(f"✅ Menu item updated successfully")
        
        # Delete the menu item
        if menu_id:
            success, response = self.run_test(
                "Delete Menu Item",
                "DELETE",
                f"menu/{menu_id}",
                200
            )
            
            if success:
                print(f"✅ Menu item deleted successfully")
        
        return menu_id is not None

    def test_faq_management(self):
        """Test FAQ CRUD operations"""
        print("\n=== Testing FAQ Management ===")
        
        # Get existing FAQs
        success, response = self.run_test(
            "Get FAQs",
            "GET",
            "faqs",
            200
        )
        
        initial_count = 0
        if success and isinstance(response, list):
            initial_count = len(response)
            print(f"✅ Retrieved {initial_count} existing FAQs")
        
        # Create a new FAQ
        faq_data = {
            "question": "What is the test question?",
            "answer": "This is a test answer for testing purposes.",
            "order": 999
        }
        
        success, response = self.run_test(
            "Create FAQ",
            "POST",
            "faqs",
            200,
            data=faq_data
        )
        
        faq_id = None
        if success and response.get('id'):
            faq_id = response['id']
            print(f"✅ FAQ created with ID: {faq_id}")
        
        # Update the FAQ
        if faq_id:
            update_data = {
                "answer": "This is an updated test answer."
            }
            
            success, response = self.run_test(
                "Update FAQ",
                "PUT",
                f"faqs/{faq_id}",
                200,
                data=update_data
            )
            
            if success:
                print(f"✅ FAQ updated successfully")
        
        # Delete the FAQ
        if faq_id:
            success, response = self.run_test(
                "Delete FAQ",
                "DELETE",
                f"faqs/{faq_id}",
                200
            )
            
            if success:
                print(f"✅ FAQ deleted successfully")
        
        return faq_id is not None

    def test_house_rules_management(self):
        """Test house rules CRUD operations"""
        print("\n=== Testing House Rules Management ===")
        
        # Get existing rules
        success, response = self.run_test(
            "Get House Rules",
            "GET",
            "rules",
            200
        )
        
        initial_count = 0
        if success and isinstance(response, list):
            initial_count = len(response)
            print(f"✅ Retrieved {initial_count} existing house rules")
        
        # Create a new rule
        rule_data = {
            "rule": "This is a test house rule for testing purposes.",
            "order": 999
        }
        
        success, response = self.run_test(
            "Create House Rule",
            "POST",
            "rules",
            200,
            data=rule_data
        )
        
        rule_id = None
        if success and response.get('id'):
            rule_id = response['id']
            print(f"✅ House rule created with ID: {rule_id}")
        
        # Update the rule
        if rule_id:
            update_data = {
                "rule": "This is an updated test house rule."
            }
            
            success, response = self.run_test(
                "Update House Rule",
                "PUT",
                f"rules/{rule_id}",
                200,
                data=update_data
            )
            
            if success:
                print(f"✅ House rule updated successfully")
        
        # Delete the rule
        if rule_id:
            success, response = self.run_test(
                "Delete House Rule",
                "DELETE",
                f"rules/{rule_id}",
                200
            )
            
            if success:
                print(f"✅ House rule deleted successfully")
        
        return rule_id is not None

    def test_ai_chat(self):
        """Test AI chat functionality"""
        print("\n=== Testing AI Chat Assistant ===")
        
        session_id = f"test_session_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        chat_data = {
            "session_id": session_id,
            "message": "What treks are available at Banjara Barracks?"
        }
        
        success, response = self.run_test(
            "AI Chat Assistant",
            "POST",
            "chat/ai-assistant",
            200,
            data=chat_data
        )
        
        if success and response.get('response'):
            print(f"✅ AI responded: {response['response'][:100]}...")
            return True
        else:
            print("❌ AI chat failed to respond")
            return False

    def test_trek_crud_apis(self):
        """Test V4 Trek CRUD API endpoints"""
        print("\n=== Testing V4 Trek CRUD APIs ===")
        
        # Test GET /api/treks - should return seeded treks
        success, response = self.run_test(
            "Get All Treks",
            "GET",
            "treks",
            200
        )
        
        trek_count = 0
        sample_trek_id = None
        if success and isinstance(response, list):
            trek_count = len(response)
            print(f"✅ Retrieved {trek_count} treks (expected: 5 seeded treks)")
            
            # Verify trek data structure
            if response:
                sample_trek = response[0]
                sample_trek_id = sample_trek.get('id')
                required_fields = ['name', 'duration', 'difficulty', 'description', 'highlights', 
                                 'best_season', 'what_to_carry', 'images', 'altitude', 'distance', 'featured', 'active']
                
                missing_fields = [field for field in required_fields if field not in sample_trek]
                if not missing_fields:
                    print("✅ Trek data structure is correct")
                    
                    # Check if price is ₹5,000
                    if sample_trek.get('price') == 5000:
                        print("✅ Trek price is correctly set to ₹5,000")
                    else:
                        print(f"❌ Trek price is {sample_trek.get('price')}, expected ₹5,000")
                        
                    # Check for featured treks
                    featured_treks = [t for t in response if t.get('featured', False)]
                    if featured_treks:
                        print(f"✅ Found {len(featured_treks)} featured treks")
                    else:
                        print("⚠️ No featured treks found")
                else:
                    print(f"❌ Missing required fields in trek data: {missing_fields}")
        
        # Test GET /api/treks/{trek_id} - get single trek
        if sample_trek_id:
            success, response = self.run_test(
                "Get Single Trek",
                "GET",
                f"treks/{sample_trek_id}",
                200
            )
            
            if success and response.get('id') == sample_trek_id:
                print(f"✅ Successfully retrieved single trek: {response.get('name', 'Unknown')}")
        
        # Test POST /api/treks - create new trek (admin functionality)
        new_trek_data = {
            "name": "Test Trek V4",
            "duration": "6-7 hours",
            "difficulty": "Moderate",
            "price": 5000,
            "description": "A test trek for V4 testing purposes",
            "highlights": ["Beautiful views", "Test experience"],
            "best_season": "March to June",
            "what_to_carry": ["Water bottle", "Comfortable shoes"],
            "images": ["https://example.com/test-image.jpg"],
            "altitude": "3000m",
            "distance": "8km",
            "featured": False,
            "active": True,
            "order": 999
        }
        
        success, response = self.run_test(
            "Create New Trek",
            "POST",
            "treks",
            200,
            data=new_trek_data
        )
        
        created_trek_id = None
        if success and response.get('id'):
            created_trek_id = response['id']
            print(f"✅ Trek created successfully with ID: {created_trek_id}")
        
        # Test PUT /api/treks/{trek_id} - update trek
        if created_trek_id:
            update_data = {
                "name": "Updated Test Trek V4",
                "featured": True
            }
            
            success, response = self.run_test(
                "Update Trek",
                "PUT",
                f"treks/{created_trek_id}",
                200,
                data=update_data
            )
            
            if success and response.get('name') == "Updated Test Trek V4":
                print("✅ Trek updated successfully")
        
        # Test DELETE /api/treks/{trek_id} - delete trek
        if created_trek_id:
            success, response = self.run_test(
                "Delete Trek",
                "DELETE",
                f"treks/{created_trek_id}",
                200
            )
            
            if success:
                print("✅ Trek deleted successfully")
        
        return trek_count >= 1

    def test_gallery_crud_apis(self):
        """Test V4 Gallery CRUD API endpoints"""
        print("\n=== Testing V4 Gallery CRUD APIs ===")
        
        # Test GET /api/gallery - should return seeded gallery images
        success, response = self.run_test(
            "Get All Gallery Images",
            "GET",
            "gallery",
            200
        )
        
        gallery_count = 0
        if success and isinstance(response, list):
            gallery_count = len(response)
            print(f"✅ Retrieved {gallery_count} gallery images (expected: 6 seeded images)")
            
            # Verify gallery data structure
            if response:
                sample_image = response[0]
                required_fields = ['title', 'description', 'image_url', 'category', 'order', 'active']
                
                missing_fields = [field for field in required_fields if field not in sample_image]
                if not missing_fields:
                    print("✅ Gallery data structure is correct")
                    print(f"   Sample image: {sample_image.get('title', 'Unknown')} - {sample_image.get('category', 'Unknown')}")
                else:
                    print(f"❌ Missing required fields in gallery data: {missing_fields}")
        
        # Test POST /api/gallery - add new gallery image (admin functionality)
        new_image_data = {
            "title": "Test Gallery Image V4",
            "description": "A test image for V4 gallery testing",
            "image_url": "https://example.com/test-gallery-image.jpg",
            "category": "test",
            "order": 999,
            "active": True
        }
        
        success, response = self.run_test(
            "Add Gallery Image",
            "POST",
            "gallery",
            200,
            data=new_image_data
        )
        
        created_image_id = None
        if success and response.get('id'):
            created_image_id = response['id']
            print(f"✅ Gallery image added successfully with ID: {created_image_id}")
        
        # Test DELETE /api/gallery/{image_id} - delete gallery image
        if created_image_id:
            success, response = self.run_test(
                "Delete Gallery Image",
                "DELETE",
                f"gallery/{created_image_id}",
                200
            )
            
            if success:
                print("✅ Gallery image deleted successfully")
        
        return gallery_count >= 1

    def test_v4_trek_booking_with_upi(self):
        """Test V4 Trek booking with UPI payment"""
        print("\n=== Testing V4 Trek Booking with UPI ===")
        
        # Create a trek booking with UPI payment
        tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        trek_booking_data = {
            "trek_id": "sample-trek-id",
            "trek_name": "Bhunbhuni Trek",
            "person_count": 3,
            "date": tomorrow,
            "full_name": "Rajesh Kumar",
            "email": "rajesh.kumar@example.com",
            "phone": "+91 9876543210",
            "payment_method": "upi",
            "payment_status": "pending"
        }
        
        success, response = self.run_test(
            "Create Trek Booking with UPI",
            "POST",
            "bookings/trek",
            200,
            data=trek_booking_data
        )
        
        booking_id = None
        if success and response.get('id'):
            booking_id = response['id']
            print(f"✅ Trek booking created with ID: {booking_id}")
            
            # Verify UPI payment details
            if response.get('status') == 'pending':
                print("✅ Payment status correctly set to 'pending'")
            else:
                print(f"❌ Payment status is {response.get('status')}, expected 'pending'")
            
            # Verify cost calculation (₹5,000 per person)
            expected_cost = 5000 * trek_booking_data['person_count']
            if response.get('cost') == expected_cost:
                print(f"✅ Cost correctly calculated: ₹{response.get('cost')} for {trek_booking_data['person_count']} persons")
            else:
                print(f"❌ Cost calculation error: got ₹{response.get('cost')}, expected ₹{expected_cost}")
        
        # Test GET /api/bookings/trek - verify booking is stored
        success, response = self.run_test(
            "Get All Trek Bookings",
            "GET",
            "bookings/trek",
            200
        )
        
        if success and isinstance(response, list):
            # Find our booking
            our_booking = None
            for booking in response:
                if booking.get('id') == booking_id:
                    our_booking = booking
                    break
            
            if our_booking:
                print(f"✅ Trek booking found in database")
                print(f"   UPI ID should be used: sadhya0794@okhdfcbank")
            else:
                print("❌ Trek booking not found in database")
        
        return booking_id is not None

    def test_error_handling(self):
        """Test error handling for invalid IDs"""
        print("\n=== Testing Error Handling ===")
        
        # Test invalid trek ID
        success, response = self.run_test(
            "Get Trek with Invalid ID",
            "GET",
            "treks/invalid-trek-id-12345",
            404
        )
        
        if success:
            print("✅ Proper 404 error for invalid trek ID")
        
        # Test invalid gallery image ID
        success, response = self.run_test(
            "Delete Gallery Image with Invalid ID",
            "DELETE",
            "gallery/invalid-image-id-12345",
            404
        )
        
        if success:
            print("✅ Proper 404 error for invalid gallery image ID")
        
        return True

def main():
    print("🏔️  Starting Banjara Barracks API Testing")
    print("=" * 50)
    
    tester = BanjaraBarracksAPITester()
    
    # Run all tests - prioritizing V4 redesign tests
    tests = [
        tester.test_admin_login,
        tester.test_trek_crud_apis,  # V4 Priority: HIGH
        tester.test_gallery_crud_apis,  # V4 Priority: HIGH  
        tester.test_v4_trek_booking_with_upi,  # V4 Priority: HIGH
        tester.test_error_handling,  # V4 Error handling
        tester.test_trek_bookings,
        tester.test_bbq_bookings,
        tester.test_room_inquiries,
        tester.test_menu_management,
        tester.test_faq_management,
        tester.test_house_rules_management,
        tester.test_ai_chat
    ]
    
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test failed with exception: {str(e)}")
            tester.failed_tests.append({
                'test': test.__name__,
                'error': str(e)
            })
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failure in tester.failed_tests:
            print(f"   - {failure.get('test', 'Unknown')}: {failure.get('error', failure.get('response', 'Unknown error'))}")
    
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"📈 Success Rate: {success_rate:.1f}%")
    
    return 0 if success_rate >= 80 else 1

if __name__ == "__main__":
    sys.exit(main())