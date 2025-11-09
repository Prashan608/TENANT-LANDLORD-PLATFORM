# Payment Tracker Debug Guide

## 🔍 Quick Check - Run in Browser Console (F12)

### Step 1: Check if you're logged in
```javascript
const user = JSON.parse(localStorage.getItem('loggedInUser'));
console.log('User:', user);
console.log('Role:', user?.role);
```

**Expected:** Should show your user object with `role: "tenant"`

**If role is "landlord":** PaymentTracker is TENANT-ONLY. You need to:
- Logout
- Login as a tenant account
- OR register a new tenant account

---

### Step 2: Check if you're a tenant
```javascript
const user = JSON.parse(localStorage.getItem('loggedInUser'));
if (!user) {
  console.log('❌ NOT LOGGED IN - Please login first');
} else if (user.role !== 'tenant') {
  console.log('❌ You are logged in as:', user.role);
  console.log('⚠️ PaymentTracker only works for TENANTS');
  console.log('💡 Solution: Login as a tenant or register a tenant account');
} else {
  console.log('✅ You are a tenant - Payment tracker should work!');
}
```

---

### Step 3: Force navigate to payment tracker
```javascript
window.location.href = '/payment-tracker';
```

**What happens?**
- ✅ **Page loads with payment history** → It works!
- ❌ **Redirects back to login** → You're not a tenant or not logged in
- ❌ **Blank page** → There's an error (check console)

---

## 🛠️ Solutions

### Solution 1: You're Logged in as Landlord

**Quick Fix - Create Tenant Account:**
```javascript
// Run this in console
localStorage.removeItem('loggedInUser');
alert('Logged out! Now register as a TENANT');
window.location.href = '/register';
```

Then:
1. Fill the registration form
2. **Select "Tenant" as role** ⚠️ IMPORTANT
3. Complete registration
4. Login
5. Try Payment Tracker again

---

### Solution 2: Not Logged In

```javascript
// Check if you're logged in
if (!localStorage.getItem('loggedInUser')) {
  alert('You are not logged in! Redirecting to login...');
  window.location.href = '/';
}
```

**Fix:** Login or register first

---

### Solution 3: Allow Landlords to See Payments (Optional)

If you want landlords to also access payment tracker, edit the file:

**File:** `src/pages/PaymentTracker.jsx`

**Line 20-22:** Change this:
```javascript
// Early return for authentication
if (!user || user.role !== "tenant") {
  return <Navigate to="/" replace />;
}
```

**To this:**
```javascript
// Early return for authentication
if (!user) {
  return <Navigate to="/" replace />;
}
```

This removes the tenant-only restriction.

---

## 🧪 Create Test Tenant Account

Run this script to create a test tenant account instantly:

```javascript
// Create test tenant user
const testTenant = {
  id: Date.now(),
  name: "Test Tenant",
  email: "tenant@test.com",
  phone: "1234567890",
  password: "test123",
  role: "tenant", // ← IMPORTANT: Must be "tenant"
  address: "123 Test St",
  avatar: "",
  communicationPreferences: { email: true, sms: false },
  createdAt: new Date().toISOString()
};

// Add to users
const users = JSON.parse(localStorage.getItem('users')) || [];
// Remove if already exists
const filtered = users.filter(u => u.email !== testTenant.email);
filtered.push(testTenant);
localStorage.setItem('users', JSON.stringify(filtered));

// Auto login
localStorage.setItem('loggedInUser', JSON.stringify(testTenant));

console.log('✅ Test tenant created and logged in!');
console.log('Email: tenant@test.com');
console.log('Password: test123');
console.log('Refreshing page...');

setTimeout(() => {
  location.reload();
}, 1000);
```

After running this:
1. Page will refresh
2. You'll be logged in as tenant
3. Try clicking "Pay Rent" button
4. Should work now!

---

## 📊 Verify Payment Data

Check if payment data exists:

```javascript
const payments = localStorage.getItem('paymentHistory');
const upcoming = localStorage.getItem('upcomingPayment');

if (!payments || !upcoming) {
  console.log('⚠️ No payment data found');
  console.log('💡 Payment tracker will auto-generate data on first visit');
} else {
  console.log('✅ Payment data exists:');
  console.log('Past payments:', JSON.parse(payments));
  console.log('Upcoming payment:', JSON.parse(upcoming));
}
```

---

## 🔄 Reset Payment Data

If payment tracker shows wrong data:

```javascript
localStorage.removeItem('paymentHistory');
localStorage.removeItem('upcomingPayment');
console.log('✅ Payment data cleared!');
console.log('Reload the page - new data will be generated');
location.reload();
```

---

## ✅ Complete Diagnosis Script

Run this all-in-one diagnostic:

```javascript
console.clear();
console.log('🔍 PAYMENT TRACKER DIAGNOSTIC\n');

// Check 1: Login status
const user = JSON.parse(localStorage.getItem('loggedInUser'));
if (!user) {
  console.log('❌ NOT LOGGED IN');
  console.log('Solution: Register at /register or login at /');
} else {
  console.log('✅ Logged in as:', user.name);
  console.log('   Email:', user.email);
  console.log('   Role:', user.role);
  
  // Check 2: Tenant check
  if (user.role !== 'tenant') {
    console.log('\n❌ WRONG ROLE');
    console.log('   PaymentTracker requires: tenant');
    console.log('   Your role:', user.role);
    console.log('   Solution: Login as tenant or register tenant account');
  } else {
    console.log('\n✅ Role is correct (tenant)');
  }
}

// Check 3: Payment data
const payments = localStorage.getItem('paymentHistory');
const upcoming = localStorage.getItem('upcomingPayment');
if (payments && upcoming) {
  console.log('\n✅ Payment data exists');
} else {
  console.log('\n⚠️ No payment data (will auto-generate on visit)');
}

// Check 4: Routes
console.log('\n📍 Current path:', window.location.pathname);
console.log('💡 Payment tracker path: /payment-tracker');

// Final recommendation
console.log('\n🎯 RECOMMENDATION:');
if (!user) {
  console.log('   1. Register or login');
  console.log('   2. Make sure to select "Tenant" role');
  console.log('   3. Then try /payment-tracker');
} else if (user.role !== 'tenant') {
  console.log('   1. Logout (or clear loggedInUser)');
  console.log('   2. Login as tenant account');
  console.log('   3. Then try /payment-tracker');
} else {
  console.log('   ✅ Everything looks good!');
  console.log('   Try: window.location.href = "/payment-tracker"');
}
```

---

## 🎯 Most Likely Issue

Based on common problems:

**You're logged in as LANDLORD, not TENANT**

Quick fix:
1. Open `/profile` page
2. Check what your role is
3. If it says "Landlord", you need a tenant account
4. Use the "Create Test Tenant Account" script above

OR

Logout and register again, selecting **Tenant** as the role.

---

**Need more help?** Share:
1. What you see in console when running diagnostic script
2. Your current path (window.location.pathname)
3. Your user role (from localStorage)
