# Tenant-Landlord Communication Platform

## 🏠 Project Overview
A comprehensive frontend-focused platform that facilitates seamless communication between tenants and landlords, streamlining maintenance requests, rent payments, and messaging.

## ✨ Features Implemented

### 1. **Intuitive Maintenance Request System**
- ✅ 4-step wizard form with progress tracking
- ✅ Category selection (Plumbing, Electrical, HVAC, Appliances, Structural, Other)
- ✅ Urgency level selector (Low, Medium, High) with color coding
- ✅ Auto-suggestions for common issues
- ✅ Drag-and-drop image upload
- ✅ Real-time validation with error messages
- ✅ Character counter for descriptions

### 2. **Issue Tracking Dashboard**
- ✅ **Tenant View**: Personalized dashboard with request status (Pending, In Progress, Completed)
- ✅ **Landlord View**: Filterable table with status updates
- ✅ Visual indicators (colored badges, progress bars)
- ✅ Request timeline tracking
- ✅ Statistics cards for quick overview

### 3. **Instant Messaging System**
- ✅ Real-time chat interface between tenant and landlord
- ✅ Message status indicators (Sent ✓, Delivered ✓✓, Read ✓✓)
- ✅ Timestamps for all messages
- ✅ Responsive message bubbles
- ✅ Message history persistence

### 4. **Maintenance History & Reports**
- ✅ Complete history of all maintenance requests
- ✅ Status-based filtering
- ✅ Detailed request information table
- ✅ Color-coded status badges

### 5. **Rent Payment Tracker**
- ✅ Payment history table
- ✅ Calendar view with payment dates highlighted
- ✅ Upcoming payment reminders
- ✅ "Mark as Paid" functionality
- ✅ Total paid summary
- ✅ Status badges (Paid, Pending, Overdue)

### 6. **Responsive Design**
- ✅ Mobile-first approach
- ✅ Touch-friendly interactions
- ✅ Adaptive UI for tablets and desktops
- ✅ Hamburger menu for mobile navigation

### 7. **User Profiles & Customization**
- ✅ Avatar upload with preview
- ✅ Editable profile fields (Name, Email, Phone, Address)
- ✅ Communication preferences
- ✅ Role-based property information
- ✅ Password change UI

### 8. **Notifications System**
- ✅ Bell icon with unread count badge
- ✅ Dropdown notification panel
- ✅ Mark as read functionality
- ✅ Clear all notifications
- ✅ Persistent storage

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## 📱 How to Use

### Registration (First Time Users)
1. Navigate to `http://localhost:5173/`
2. Click on "Register" link at the bottom
3. Fill in the registration form:
   - Choose role (Tenant or Landlord)
   - Enter full name, email, phone number
   - Provide address
   - Create a password (minimum 6 characters)
   - Confirm password
4. Click "Create Account"
5. You'll be redirected to login page
6. Your account is now created!

### Login (Existing Users)
1. Navigate to `http://localhost:5173/`
2. Enter your registered email and password
3. Click "Login"
4. You'll be redirected to your dashboard based on your role
5. **Note**: You must register first before logging in!

### Tenant Features
- **Dashboard** (`/tenant`): View maintenance requests, upcoming payments, and messages
- **Submit Maintenance Request** (`/maintenance-form`): Report issues with detailed form
- **View History** (`/maintenance-history`): Track all submitted requests
- **Payments** (`/payment-tracker`): Manage rent payments and view history
- **Messages** (`/messages`): Chat with landlord
- **Profile** (`/profile`): Update personal information

### Landlord Features
- **Dashboard** (`/landlord`): Overview of all properties, tenants, and requests
- **Manage Requests**: Filter and update maintenance request statuses
- **View Payments**: Monitor rent payment statuses
- **Messages** (`/messages`): Communicate with tenants
- **Profile** (`/profile`): Manage landlord information and properties

## 🗂️ Project Structure

```
src/
├── pages/
│   ├── Login.jsx                 # User login page
│   ├── Register.jsx              # User registration/signup page
│   ├── TenantDashboard.jsx       # Tenant overview dashboard
│   ├── LandlordDashboard.jsx     # Landlord management dashboard
│   ├── MaintenanceForm.jsx       # Request submission form
│   ├── MaintenanceHistory.jsx    # Request history table
│   ├── PaymentTracker.jsx        # Payment management
│   ├── Messages.jsx              # Chat interface
│   └── Profile.jsx               # User profile management
├── components/
│   ├── Navbar.jsx                # Top navigation bar
│   ├── Sidebar.jsx               # Side navigation menu
│   ├── ChatBox.jsx               # Reusable chat component
│   ├── Notification.jsx          # Notification dropdown
│   └── MaintenanceForm.jsx       # Legacy form component
├── App.jsx                       # Main app with routing
├── main.jsx                      # React entry point
└── index.css                     # Tailwind CSS imports
```

## 💾 Data Storage

All data is stored in browser localStorage:

- `users`: Array of registered users (credentials and profile data)
- `loggedInUser`: Current user session data
- `maintenanceRequests`: Array of maintenance requests
- `messages`: Chat message history
- `payments`: Payment records
- `notifications`: User notifications

## 🎨 Technologies Used

- **React 19**: UI framework
- **React Router DOM**: Navigation and routing
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **Vite**: Build tool and dev server
- **LocalStorage**: Client-side data persistence

## 🔑 Key Components

### Authentication
- Complete registration system with validation
- Role-based access control (Tenant/Landlord)
- Email and password validation
- Duplicate email prevention
- Safe localStorage parsing with error handling
- Navigate component for redirects
- Secure login with credential verification

### Forms
- Multi-step wizard with progress tracking
- Real-time validation
- Image upload with drag-and-drop
- Auto-suggestions

### Dashboard
- Real-time data from localStorage
- Quick action buttons
- Statistics cards
- Responsive grid layouts

### Messaging
- Real-time chat simulation
- Message status tracking
- Auto-scroll to latest message
- Timestamp formatting

## 📊 Features Summary

| Feature | Tenant | Landlord | Status |
|---------|--------|----------|--------|
| Registration/Signup | ✅ | ✅ | Complete |
| Login Authentication | ✅ | ✅ | Complete |
| Dashboard | ✅ | ✅ | Complete |
| Maintenance Requests | ✅ | ✅ | Complete |
| Messaging | ✅ | ✅ | Complete |
| Payments | ✅ | ✅ | Complete |
| Notifications | ✅ | ✅ | Complete |
| Profile Management | ✅ | ✅ | Complete |
| Mobile Responsive | ✅ | ✅ | Complete |

## 🎯 Future Enhancements (Optional)

- [ ] Multi-language support
- [ ] AI Chatbot integration
- [ ] Voice command support
- [ ] Export reports to PDF/CSV
- [ ] Real-time backend integration
- [ ] Push notifications (browser API)
- [ ] Maintenance scheduling calendar
- [ ] Payment gateway integration

## 🐛 Troubleshooting

**Blank screen on load:**
- Clear localStorage: Open browser console, run `localStorage.clear()`
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

**Routes not working:**
- Ensure dev server is running
- Check that react-router-dom is installed

**Tailwind styles not applying:**
- Verify tailwind.config.js and postcss.config.js are in the project root
- Restart dev server

## 📝 Notes

- This is a frontend-only demo using localStorage for data persistence
- For production, integrate with a backend API and proper encryption
- Authentication uses localStorage (passwords stored in plain text - for demo only)
- **Security Warning**: In production, NEVER store passwords in localStorage or plain text!
- Data persists only in the current browser
- Users must register before logging in
- Duplicate email registration is prevented

## 👨‍💻 Development

To add new features:
1. Create component in `src/pages/` or `src/components/`
2. Add route to `App.jsx`
3. Update `Sidebar.jsx` if adding to navigation
4. Use localStorage for data persistence
5. Follow existing Tailwind CSS patterns

---

**Built with ❤️ for better tenant-landlord communication**
