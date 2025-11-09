# Debug Guide - Payment & Messages Not Working

## 🔍 Quick Diagnosis

### Step 1: Check if you're logged in

1. Open browser DevTools (Press F12)
2. Go to **Console** tab
3. Type this and press Enter:
```javascript
localStorage.getItem('loggedInUser')
```

**Expected Result**: You should see a JSON string with user data
```json
"{\"id\":123,\"name\":\"John Doe\",\"email\":\"john@test.com\",\"role\":\"tenant\",...}"
```

**If you see `null`**: You're NOT logged in! 
- **Solution**: Go to login page and log in first

### Step 2: Verify you're logged in as tenant

In the console, type:
```javascript
JSON.parse(localStorage.getItem('loggedInUser'))
```

**Check the `role` field**: 
- ✅ Should be `"tenant"` for PaymentTracker
- ✅ Messages works for both tenant and landlord

**If role is landlord**: PaymentTracker will redirect you to login
- **Solution**: Login as a tenant or update PaymentTracker to allow landlords

### Step 3: Test navigation manually

In console, type:
```javascript
window.location.href = '/payment-tracker'
```

**What happens?**
- ✅ **Loads payment page**: Navigation works, authentication issue
- ❌ **Redirects to login**: You're not logged in OR not a tenant
- ❌ **Blank page**: Component has an error

### Step 4: Check for errors

1. In DevTools, go to **Console** tab
2. Look for red error messages
3. Common errors:
   - `Cannot read property 'role' of null` - Not logged in
   - `Component is not defined` - Import error
   - `undefined is not a function` - Missing function

## 🔧 Common Issues & Fixes

### Issue 1: Not Logged In
**Symptom**: Clicking Payments/Messages redirects to login page

**Fix**: 
1. Register a new account at `/register`
2. Login at `/`
3. Try accessing Payments/Messages again

### Issue 2: Logged in as Landlord
**Symptom**: PaymentTracker redirects to login (has tenant-only check)

**Fix Option A** - Login as Tenant:
```javascript
// In console, create a test tenant account
localStorage.clear();
// Then register as tenant
```

**Fix Option B** - Allow landlords to see payments:
Edit `src/pages/PaymentTracker.jsx` line 87:
```javascript
// Change this:
if (!user || user.role !== "tenant") {
// To this:
if (!user) {
```

### Issue 3: Sidebar Links Not Working
**Symptom**: Clicking links does nothing

**Check**:
1. Are you inside a dashboard page? (TenantDashboard has Sidebar)
2. Are you on login/register page? (These don't have Sidebar)

**Fix**: Navigate to `/tenant` first, THEN use sidebar links

### Issue 4: Blank Page
**Symptom**: Page loads but shows nothing

**Fix**:
1. Check console for errors
2. Try hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Clear localStorage and re-login:
```javascript
localStorage.clear()
location.reload()
```

### Issue 5: Messages Page Empty
**Symptom**: Messages page loads but no messages

**Fix**: Messages auto-generate on first visit. If empty:
```javascript
// In console, reset messages:
localStorage.removeItem('messages')
location.reload()
```

## 📱 Step-by-Step Testing

### Test Payments Feature:

1. **Login as tenant**:
   ```
   Email: tenant@test.com
   Password: test123
   ```
   (If account doesn't exist, register first)

2. **From Tenant Dashboard** (`/tenant`):
   - Look for sidebar on left
   - Click "Payments"
   - Should navigate to `/payment-tracker`

3. **What you should see**:
   - Payment history table
   - Upcoming payment card
   - Calendar with highlighted dates
   - "Mark as Paid" button

4. **If it doesn't work**:
   ```javascript
   // Check authentication
   console.log(JSON.parse(localStorage.getItem('loggedInUser')))
   
   // Force navigate
   window.location.href = '/payment-tracker'
   ```

### Test Messages Feature:

1. **Login** (works for both tenant and landlord)

2. **From Dashboard**:
   - Click "Messages" in sidebar
   - Should navigate to `/messages`

3. **What you should see**:
   - Chat interface
   - 6 mock messages
   - Input box to send new message
   - Status indicators (✓ sent, ✓✓ delivered, ✓✓ read)

4. **If it doesn't work**:
   ```javascript
   // Check authentication
   console.log(JSON.parse(localStorage.getItem('loggedInUser')))
   
   // Check messages
   console.log(JSON.parse(localStorage.getItem('messages')))
   
   // Force navigate
   window.location.href = '/messages'
   ```

## 🛠️ Advanced Debugging

### Check if components are loaded:

In console:
```javascript
// Check if routes are registered
console.log('Current path:', window.location.pathname)

// Force navigate to each page
window.location.href = '/payment-tracker'
// Wait, then:
window.location.href = '/messages'
```

### Check localStorage data:

```javascript
// List all localStorage keys
Object.keys(localStorage).forEach(key => {
  console.log(key, ':', localStorage.getItem(key))
})
```

### Reset everything and start fresh:

```javascript
// CAUTION: This deletes all data!
localStorage.clear()
alert('All data cleared! Please register again.')
location.href = '/register'
```

## 🎯 Quick Fix Script

If you want to quickly test with a pre-configured user:

```javascript
// Run this in console to create and login as test tenant
const testUser = {
  id: Date.now(),
  name: "Test User",
  email: "test@tenant.com",
  phone: "1234567890",
  password: "test123",
  role: "tenant",
  address: "123 Test St",
  avatar: "",
  communicationPreferences: { email: true, sms: false },
  createdAt: new Date().toISOString()
};

// Add to users
const users = JSON.parse(localStorage.getItem('users')) || [];
users.push(testUser);
localStorage.setItem('users', JSON.stringify(users));

// Login
localStorage.setItem('loggedInUser', JSON.stringify(testUser));

alert('Test user created and logged in! Refresh the page.');
location.reload();
```

## 📞 Still Not Working?

If none of these work, check:

1. **Browser Console Errors**: Any red errors?
2. **Network Tab**: Any failed requests?
3. **React DevTools**: Components rendering?
4. **Dev Server**: Is `npm run dev` still running?

### Restart Dev Server:
```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

### Clear Browser Cache:
1. Open DevTools
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

---

## ✅ Expected Behavior

**Payments Page** (`/payment-tracker`):
- Shows payment history table
- Shows upcoming payment (Nov 15, 2025 - $1,200)
- Calendar with highlighted payment dates
- "Mark as Paid" button works
- Total paid this year: $7,500

**Messages Page** (`/messages`):
- Chat interface loads
- 6 mock messages display
- Can send new messages
- Status changes: sent → delivered → read
- Messages persist in localStorage

---

If you're still having issues, please share:
1. What error messages you see in console
2. What happens when you click Payment/Messages
3. Result of `localStorage.getItem('loggedInUser')`
