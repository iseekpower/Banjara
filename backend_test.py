import requests
import sys
import json
from datetime import datetime, timedelta

class BanjaraBarracksAPITester:
    def __init__(self, base_url="https://mountain-retreat-6.preview.emergentagent.com"):
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

def main():
    print("🏔️  Starting Banjara Barracks API Testing")
    print("=" * 50)
    
    tester = BanjaraBarracksAPITester()
    
    # Run all tests
    tests = [
        tester.test_admin_login,
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