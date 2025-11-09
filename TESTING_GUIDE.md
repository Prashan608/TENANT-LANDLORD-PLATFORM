# Testing Guide - Registration & Login System

## 🧪 How to Test the New Registration Feature

### Test 1: New User Registration (Tenant)
1. Open browser to `http://localhost:5173/`
2. Click "Register" link at the bottom
3. Fill in the form:
   ```
   Role: Tenant
   Full Name: John Doe
   Email: john@tenant.com
   Phone: 1234567890
   Address: 123 Main St, City
   Password: password123
   Confirm Password: password123
   ```
4. Click "Create Account"
5. ✅ Should see success message: "Registration successful! Welcome John Doe!"
6. ✅ Should redirect to login page

### Test 2: Login with Registered Account
1. On login page, enter:
   ```
   Email: john@tenant.com
   Password: password123
   ```
2. Click "Login"
3. ✅ Should see welcome message: "Welcome back, John Doe! 👋"
4. ✅ Should redirect to Tenant Dashboard at `/tenant`
5. ✅ Should see personalized content with user name

### Test 3: New User Registration (Landlord)
1. Go to registration page
2. Fill in the form:
   ```
   Role: Landlord
   Full Name: Jane Smith
   Email: jane@landlord.com
   Phone: 9876543210
   Address: 456 Oak Ave, Town
   Password: secure456
   Confirm Password: secure456
   ```
3. Click "Create Account"
4. ✅ Should register successfully
5. Login with landlord credentials
6. ✅ Should redirect to Landlord Dashboard at `/landlord`

### Test 4: Form Validation
1. Try to register with empty fields
   - ✅ Should show "Name is required" error
2. Try invalid email (e.g., "notanemail")
   - ✅ Should show "Email is invalid" error
3. Try short password (less than 6 chars)
   - ✅ Should show "Password must be at least 6 characters" error
4. Try mismatched passwords
   - ✅ Should show "Passwords do not match" error
5. Try invalid phone (e.g., "123")
   - ✅ Should show "Phone number must be 10 digits" error

### Test 5: Duplicate Email Prevention
1. Register a new user with email: `test@example.com`
2. Try to register another user with same email
3. ✅ Should show error: "User with this email already exists"

### Test 6: Login Validation
1. Try to login with unregistered email
   - ✅ Should show: "Invalid email or password. Please try again or register."
2. Try to login with wrong password
   - ✅ Should show: "Invalid email or password. Please try again or register."
3. Try to login with empty fields
   - ✅ Should show: "Please fill in all fields!"

### Test 7: Navigation
1. On login page, click "Register"
   - ✅ Should navigate to `/register`
2. On register page, click "Login here"
   - ✅ Should navigate back to `/` (login page)

### Test 8: Data Persistence
1. Register a new user
2. Close browser
3. Reopen and navigate to login
4. Login with registered credentials
5. ✅ User should still exist (stored in localStorage)
6. Open browser DevTools → Application → Local Storage
7. ✅ Should see `users` key with registered users array

### Test 9: Profile Integration
1. Login as registered user
2. Navigate to Profile page (`/profile`)
3. ✅ Should show user information from registration
4. ✅ Name, email, phone, address should match registration data

### Test 10: Multi-User System
1. Register multiple users (2 tenants, 2 landlords)
2. Login/logout with different accounts
3. ✅ Each user should see their own dashboard
4. ✅ Data should be isolated per user session

## 🔍 Checking Data in Browser

Open DevTools (F12) → Application → Local Storage → `http://localhost:5173`

### Check Registered Users:
```javascript
JSON.parse(localStorage.getItem('users'))
```

Expected format:
```json
[
  {
    "id": 1699876543210,
    "name": "John Doe",
    "email": "john@tenant.com",
    "phone": "1234567890",
    "password": "password123",
    "role": "tenant",
    "address": "123 Main St, City",
    "avatar": "",
    "communicationPreferences": {
      "email": true,
      "sms": false
    },
    "createdAt": "2025-11-09T10:30:00.000Z"
  }
]
```

### Check Logged In User:
```javascript
JSON.parse(localStorage.getItem('loggedInUser'))
```

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot read property of null"
**Solution**: Clear localStorage and refresh
```javascript
localStorage.clear()
location.reload()
```

### Issue 2: Login not working after registration
**Solution**: Check that:
- Password entered matches exactly
- Email is correct (case-sensitive)
- User was successfully added to `users` array

### Issue 3: Registration page not loading
**Solution**: 
- Check console for errors
- Verify Register component is imported in App.jsx
- Verify `/register` route exists

## ✅ Expected Outcomes

After all tests:
- ✅ Registration form validates all fields
- ✅ Users are stored in localStorage
- ✅ Login validates credentials correctly
- ✅ Role-based routing works (tenant → /tenant, landlord → /landlord)
- ✅ User data persists across sessions
- ✅ Duplicate emails are prevented
- ✅ Error messages are clear and helpful
- ✅ Navigation between login/register works
- ✅ Profile page shows registered user data

## 🚀 Quick Test Script

Run this in browser console to create test users:
```javascript
const testUsers = [
  {
    id: Date.now(),
    name: "Test Tenant",
    email: "tenant@test.com",
    phone: "1234567890",
    password: "test123",
    role: "tenant",
    address: "123 Test St",
    avatar: "",
    communicationPreferences: { email: true, sms: false },
    createdAt: new Date().toISOString()
  },
  {
    id: Date.now() + 1,
    name: "Test Landlord",
    email: "landlord@test.com",
    phone: "0987654321",
    password: "test123",
    role: "landlord",
    address: "456 Admin Ave",
    avatar: "",
    communicationPreferences: { email: true, sms: false },
    createdAt: new Date().toISOString()
  }
];

localStorage.setItem('users', JSON.stringify(testUsers));
console.log('✅ Test users created! Try logging in with:');
console.log('Tenant: tenant@test.com / test123');
console.log('Landlord: landlord@test.com / test123');
```

---

**Happy Testing! 🎉**
