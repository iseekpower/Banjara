#!/usr/bin/env python3
"""
Focused Authentication Test for Banjara Barracks Universal Login System
Tests all the specific scenarios mentioned in the review request
"""

import requests
import json
import uuid
from datetime import datetime

class AuthenticationTester:
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
        if data:
            print(f"   Data: {json.dumps(data, indent=2)}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            print(f"   Response Status: {response.status_code}")
            print(f"   Response: {response.text[:300]}...")

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ PASSED - Status: {response.status_code}")
                try:
                    return True, response.json() if response.content else {}
                except:
                    return True, {}
            else:
                print(f"❌ FAILED - Expected {expected_status}, got {response.status_code}")
                self.failed_tests.append({
                    'test': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ FAILED - Error: {str(e)}")
            self.failed_tests.append({
                'test': name,
                'error': str(e)
            })
            return False, {}

    def test_complete_auth_flow(self):
        """Test the complete authentication flow as specified in review request"""
        print("🏔️  Testing Universal Login System - Complete Flow")
        print("=" * 60)
        
        # Generate unique phone number for this test
        unique_phone = f"98765{str(uuid.uuid4())[:5]}"
        print(f"📱 Using unique phone number: {unique_phone}")
        
        # Test Case 1: Customer Signup
        print(f"\n{'='*20} TEST CASE 1: Customer Signup {'='*20}")
        signup_data = {
            "name": "Test User",
            "phone": unique_phone,
            "password": "test123",
            "user_type": "guest",
            "room_number": "Attic Room 1"
        }
        
        success, response = self.run_test(
            "Customer Signup",
            "POST",
            "auth/signup",
            200,
            data=signup_data
        )
        
        if success:
            print("✅ Customer signup successful!")
            print(f"   User ID: {response.get('id')}")
            print(f"   Name: {response.get('name')}")
            print(f"   Phone: {response.get('phone')}")
            print(f"   User Type: {response.get('user_type')}")
            print(f"   Room: {response.get('room_number')}")
            
            # Verify password is hashed (not in response)
            if 'password' not in response and 'password_hash' not in response:
                print("✅ Password properly excluded from response")
            else:
                print("❌ Password data should not be in response")
        
        # Test Case 2: Customer Login
        print(f"\n{'='*20} TEST CASE 2: Customer Login {'='*20}")
        login_data = {
            "phone": unique_phone,
            "password": "test123"
        }
        
        success, response = self.run_test(
            "Customer Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success:
            print("✅ Customer login successful!")
            print(f"   User ID: {response.get('id')}")
            print(f"   Name: {response.get('name')}")
            print(f"   User Type: {response.get('user_type')}")
        
        # Test Case 3: Admin Login
        print(f"\n{'='*20} TEST CASE 3: Admin Login {'='*20}")
        admin_login_data = {
            "phone": "admin",
            "password": "banjara-core-admin-2024"
        }
        
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data=admin_login_data
        )
        
        if success and response.get('user_type') == 'admin':
            print("✅ Admin login successful!")
            print(f"   User ID: {response.get('id')}")
            print(f"   Name: {response.get('name')}")
            print(f"   User Type: {response.get('user_type')}")
        
        # Test Case 4: Hemu Login
        print(f"\n{'='*20} TEST CASE 4: Hemu Login {'='*20}")
        hemu_login_data = {
            "phone": "hemu",
            "password": "hemu-chef-2024"
        }
        
        success, response = self.run_test(
            "Hemu Login",
            "POST",
            "auth/login",
            200,
            data=hemu_login_data
        )
        
        if success and response.get('user_type') == 'hemu':
            print("✅ Hemu login successful!")
            print(f"   User ID: {response.get('id')}")
            print(f"   Name: {response.get('name')}")
            print(f"   User Type: {response.get('user_type')}")
        
        # Test Case 5: Invalid Password
        print(f"\n{'='*20} TEST CASE 5: Invalid Password {'='*20}")
        invalid_login_data = {
            "phone": unique_phone,
            "password": "wrongpass"
        }
        
        success, response = self.run_test(
            "Invalid Password",
            "POST",
            "auth/login",
            401,
            data=invalid_login_data
        )
        
        if success:
            print("✅ Invalid password properly rejected with 401 error!")
        
        # Test Case 6: Duplicate Signup
        print(f"\n{'='*20} TEST CASE 6: Duplicate Signup {'='*20}")
        duplicate_signup_data = {
            "name": "Another User",
            "phone": unique_phone,  # Same phone number
            "password": "different123",
            "user_type": "guest",
            "room_number": "Attic Room 2"
        }
        
        success, response = self.run_test(
            "Duplicate Signup",
            "POST",
            "auth/signup",
            400,
            data=duplicate_signup_data
        )
        
        if success:
            print("✅ Duplicate phone number properly rejected with 400 error!")
        
        # Additional Test: Non-existent User
        print(f"\n{'='*20} ADDITIONAL TEST: Non-existent User {'='*20}")
        nonexistent_login_data = {
            "phone": "9999999999",
            "password": "anypassword"
        }
        
        success, response = self.run_test(
            "Non-existent User Login",
            "POST",
            "auth/login",
            404,
            data=nonexistent_login_data
        )
        
        if success:
            print("✅ Non-existent user properly handled with 404 error!")

    def print_final_results(self):
        """Print final test results"""
        print("\n" + "=" * 60)
        print(f"📊 FINAL RESULTS: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for i, failure in enumerate(self.failed_tests, 1):
                print(f"   {i}. {failure.get('test', 'Unknown')}")
                if 'error' in failure:
                    print(f"      Error: {failure['error']}")
                else:
                    print(f"      Expected: {failure.get('expected')}, Got: {failure.get('actual')}")
                    print(f"      Response: {failure.get('response', 'N/A')}")
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"\n📈 SUCCESS RATE: {success_rate:.1f}%")
        
        if success_rate >= 85:
            print("🎉 AUTHENTICATION SYSTEM IS WORKING CORRECTLY!")
        else:
            print("⚠️  AUTHENTICATION SYSTEM NEEDS ATTENTION!")
        
        return success_rate >= 85

def main():
    tester = AuthenticationTester()
    tester.test_complete_auth_flow()
    return tester.print_final_results()

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)