# 📮 Complete Postman Testing Guide - Smart Line Management System

## 🚀 Setup Instructions

### Step 1: Create a Postman Environment
1. Open Postman
2. Click **Environments** (left sidebar) → **+** to create new
3. Name it: **"Smart Line Management - Development"**
4. Add these variables:
   - `base_url`: `http://localhost:5000`
   - `token`: (leave empty - will auto-fill after login)
   - `user_id`: (leave empty - will auto-fill after login)
   - `email`: `testuser@example.com` (your test email)
   - `phone_number`: `0912345678` (your test phone)
   - `office_id`: (leave empty - will fill after creating office)
   - `service_id`: (leave empty - will fill after creating service)
   - `ticket_id`: (leave empty - will fill after joining queue)

5. **Save** and select this environment from the dropdown (top right)

### Step 2: Create a Collection
1. Click **Collections** → **+ New Collection**
2. Name it: **"Smart Line Management System"**
3. Create folders inside:
   - Authentication
   - Users
   - Offices
   - Services
   - Queue
   - Admin
   - Notifications

---

## 🔐 PART 1: AUTHENTICATION

### 1.1 Health Check (Optional - Verify Server is Running)
**Method:** `GET`  
**URL:** `{{base_url}}/`  
**Headers:** None

**Expected Response (200):**
```
Smart Line Management System API is Running...
```

**📝 Instructions:**
- Click **Send**
- Should return success message if server is running

---

### 1.2 Register New User
**Method:** `POST`  
**URL:** `{{base_url}}/api/auth/register`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
    "email": "{{email}}",
    "fullname": "John Doe",
    "password": "password123",
    "confirm_password": "password123",
    "phone_number": "{{phone_number}}"
}
```

**Expected Response (201):**
```json
{
    "message": "User registered successfully!",
    "user": {
        "email": "testuser@example.com",
        "fullname": "John Doe",
        "phone_number": "0912345678"
    }
}
```

**📝 Instructions:**
1. Create new request in **Authentication** folder
2. Name it: **"1. Register User"**
3. Set method to `POST`
4. Enter URL: `{{base_url}}/api/auth/register`
5. Go to **Headers** → Add `Content-Type: application/json`
6. Go to **Body** → Select **raw** → Choose **JSON**
7. Paste the JSON body above
8. Click **Send**
9. ✅ Verify you get success message

**⚠️ Important:** Save the email and phone_number you used - you'll need them for login!

---

### 1.3 Login
**Method:** `POST`  
**URL:** `{{base_url}}/api/auth/login`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
    "email": "{{email}}",
    "password": "password123"
}
```

**Expected Response (200):**
```json
{
    "message": "Login Successfully!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "user_id": "65f1234567890abcdef12345",
        "email": "testuser@example.com",
        "fullname": "John Doe",
        "phone_number": "0912345678",
        "role": "Customer"
    }
}
```

**📝 Instructions:**
1. Create new request: **"2. Login"**
2. Set method to `POST`
3. Enter URL: `{{base_url}}/api/auth/login`
4. Add header: `Content-Type: application/json`
5. Add JSON body with email and password
6. Click **Send**
7. **⚠️ IMPORTANT:** Copy the `token` from response
8. Paste it into your environment variable `token`
9. Save the `user_id` in environment variable `user_id`

**💡 Pro Tip:** Add this to **Tests** tab to auto-save token:
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
    pm.environment.set("user_id", jsonData.user.user_id);
}
```

---

### 1.4 Get My Profile (Test Authentication)
**Method:** `GET`  
**URL:** `{{base_url}}/api/users/profile`  
**Headers:**
```
Authorization: Bearer {{token}}
```

**Expected Response (200):**
```json
{
    "_id": "65f1234567890abcdef12345",
    "email": "testuser@example.com",
    "fullname": "John Doe",
    "phone_number": "0912345678",
    "role": "Customer",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**📝 Instructions:**
1. Create new request: **"3. Get My Profile"**
2. Set method to `GET`
3. Enter URL: `{{base_url}}/api/users/profile`
4. Go to **Authorization** tab → Select **Bearer Token** → Enter `{{token}}`
   OR
   Go to **Headers** → Add `Authorization: Bearer {{token}}`
5. Click **Send**
6. ✅ Verify you get your user data

---

### 1.5 Update My Profile
**Method:** `PATCH`  
**URL:** `{{base_url}}/api/users/update`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```
**Body (raw JSON):**
```json
{
    "fullname": "John Updated Doe",
    "phone_number": "0998765432"
}
```

**Expected Response (200):**
```json
{
    "message": "Profile updated successfully!",
    "user": {
        "_id": "65f1234567890abcdef12345",
        "email": "testuser@example.com",
        "fullname": "John Updated Doe",
        "phone_number": "0998765432",
        "role": "Customer"
    }
}
```

**📝 Instructions:**
1. Create request: **"4. Update Profile"**
2. Set method to `PATCH`
3. Add headers and JSON body
4. Click **Send**

---

### 1.6 Forgot Password
**Method:** `POST`  
**URL:** `{{base_url}}/api/auth/forgot-password`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
    "email": "{{email}}"
}
```

**Expected Response (200):**
```json
{
    "message": "Reset code generated! Check your email.",
    "code": "1234"
}
```

**📝 Instructions:**
1. Create request: **"5. Forgot Password"**
2. Set method to `POST`
3. Add header and JSON body
4. Click **Send**
5. **Copy the `code`** from response - you'll need it for next steps

---

### 1.7 Verify Reset Code
**Method:** `POST`  
**URL:** `{{base_url}}/api/auth/verify-reset-code`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
    "email": "{{email}}",
    "code": "1234"
}
```

**Expected Response (200):**
```json
{
    "message": "Reset code verified successfully."
}
```

**📝 Instructions:**
1. Use the code from forgot-password step
2. Create request: **"6. Verify Reset Code"**
3. Click **Send**

---

### 1.8 Reset Password
**Method:** `POST`  
**URL:** `{{base_url}}/api/auth/reset-password`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
    "email": "{{email}}",
    "code": "1234",
    "newPassword": "newpassword123"
}
```

**Expected Response (200):**
```json
{
    "message": "Password has been reset successfully."
}
```

**📝 Instructions:**
1. Create request: **"7. Reset Password"**
2. Use email, code, and set new password
3. Click **Send**
4. ✅ Now try logging in with the new password!

---

### 1.9 Logout
**Method:** `POST`  
**URL:** `{{base_url}}/api/auth/logout`  
**Headers:**
```
Authorization: Bearer {{token}}
```

**Expected Response (200):**
```json
{
    "message": "Logout successful"
}
```

**📝 Instructions:**
1. Create request: **"8. Logout"**
2. Add Authorization header
3. Click **Send**
4. ✅ Token is now invalidated

---

## 🏢 PART 2: OFFICE MANAGEMENT (Admin Only)

**⚠️ To test Admin endpoints, you need an Admin user:**
1. Register a new user
2. Manually change role in database OR create admin user through registration
3. Login as admin
4. Use admin token for these requests

### 2.1 Get All Offices (Authenticated)
**Method:** `GET`  
**URL:** `{{base_url}}/api/offices`  
**Headers:**
```
Authorization: Bearer {{token}}
```

**Expected Response (200):**
```json
[
    {
        "_id": "65f1234567890abcdef12346",
        "office_name": "Main Office",
        "location": "Addis Ababa"
    }
]
```

**📝 Instructions:**
1. Create request: **"Get All Offices"** in Offices folder
2. Set method to `GET`
3. Add Authorization header
4. Click **Send**
5. ✅ Should return list of offices (might be empty initially)

---

### 2.2 Add Office (Admin Only)
**Method:** `POST`  
**URL:** `{{base_url}}/api/offices/add`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{admin_token}}
```
**Body (raw JSON):**
```json
{
    "office_name": "Branch Office 1",
    "location": "Addis Ababa, Bole"
}
```

**Expected Response (201):**
```json
{
    "_id": "65f1234567890abcdef12346",
    "office_name": "Branch Office 1",
    "location": "Addis Ababa, Bole"
}
```

**📝 Instructions:**
1. Create request: **"Add Office"**
2. Set method to `POST`
3. Enter URL: `{{base_url}}/api/offices/add`
4. Add headers and JSON body
5. Click **Send**
6. **⚠️ IMPORTANT:** Copy the `_id` from response → Save as `office_id` in environment
7. You'll need this `office_id` for creating services

---

### 2.3 Update Office (Admin Only)
**Method:** `PUT`  
**URL:** `{{base_url}}/api/offices/{{office_id}}`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{admin_token}}
```
**Body (raw JSON):**
```json
{
    "office_name": "Updated Office Name",
    "location": "Updated Location"
}
```

**Expected Response (200):**
```json
{
    "_id": "65f1234567890abcdef12346",
    "office_name": "Updated Office Name",
    "location": "Updated Location"
}
```

---

### 2.4 Delete Office (Admin Only)
**Method:** `DELETE`  
**URL:** `{{base_url}}/api/offices/{{office_id}}`  
**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Expected Response (200):**
```json
{
    "message": "Office deleted successfully"
}
```

---

## 🔧 PART 3: SERVICE MANAGEMENT

### 3.1 List All Services (Public - No Auth Required)
**Method:** `GET`  
**URL:** `{{base_url}}/api/services`  
**Headers:** None

**Expected Response (200):**
```json
[
    {
        "_id": "65f1234567890abcdef12347",
        "office_id": "65f1234567890abcdef12346",
        "service_name": "Document Service",
        "avg_wait_time": 15,
        "is_active": true
    }
]
```

**📝 Instructions:**
1. Create request: **"List All Services"** in Services folder
2. No authentication needed
3. Click **Send**

---

### 3.2 Get Service by ID (Public)
**Method:** `GET`  
**URL:** `{{base_url}}/api/services/{{service_id}}`  
**Headers:** None

**Expected Response (200):**
```json
{
    "_id": "65f1234567890abcdef12347",
    "office_id": {
        "_id": "65f1234567890abcdef12346",
        "office_name": "Branch Office 1",
        "location": "Addis Ababa, Bole"
    },
    "service_name": "Document Service",
    "avg_wait_time": 15,
    "is_active": true
}
```

---

### 3.3 Get Services by Office (Authenticated)
**Method:** `GET`  
**URL:** `{{base_url}}/api/services/office/{{office_id}}`  
**Headers:**
```
Authorization: Bearer {{token}}
```

**Expected Response (200):**
```json
[
    {
        "_id": "65f1234567890abcdef12347",
        "office_id": "65f1234567890abcdef12346",
        "service_name": "Document Service",
        "avg_wait_time": 15,
        "is_active": true
    }
]
```

---

### 3.4 Add Service (Admin Only)
**Method:** `POST`  
**URL:** `{{base_url}}/api/services/add`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{admin_token}}
```
**Body (raw JSON):**
```json
{
    "office_id": "{{office_id}}",
    "service_name": "Document Service",
    "avg_wait_time": 15
}
```

**Expected Response (201):**
```json
{
    "_id": "65f1234567890abcdef12347",
    "office_id": "65f1234567890abcdef12346",
    "service_name": "Document Service",
    "avg_wait_time": 15,
    "is_active": true
}
```

**📝 Instructions:**
1. **⚠️ IMPORTANT:** You need `office_id` from creating an office first!
2. Create request: **"Add Service"**
3. Add headers and JSON body
4. Click **Send**
5. **Copy the `_id`** → Save as `service_id` in environment
6. You'll need this for queue operations!

---

### 3.5 Update Service (Admin Only)
**Method:** `PUT`  
**URL:** `{{base_url}}/api/services/{{service_id}}`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{admin_token}}
```
**Body (raw JSON):**
```json
{
    "service_name": "Updated Service Name",
    "avg_wait_time": 20
}
```

---

### 3.6 Delete Service (Admin Only)
**Method:** `DELETE`  
**URL:** `{{base_url}}/api/services/{{service_id}}`  
**Headers:**
```
Authorization: Bearer {{admin_token}}
```

---

## 🎫 PART 4: QUEUE MANAGEMENT

### 4.1 Join Queue (Authenticated)
**Method:** `POST`  
**URL:** `{{base_url}}/api/queue/join`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```
**Body (raw JSON):**
```json
{
    "service_id": "{{service_id}}"
}
```
**OR** (if phone_number is different):
```json
{
    "service_id": "{{service_id}}",
    "phone_number": "{{phone_number}}"
}
```

**Expected Response (201):**
```json
{
    "success": true,
    "message": "Successfully joined the queue!",
    "data": {
        "_id": "65f1234567890abcdef12348",
        "user_id": "65f1234567890abcdef12345",
        "service_id": "65f1234567890abcdef12347",
        "ticket_number": "DO-101",
        "phone_number": "0912345678",
        "position": 1,
        "status": "Waiting",
        "createdAt": "2024-01-15T10:30:00.000Z"
    }
}
```

**📝 Instructions:**
1. **⚠️ PREREQUISITE:** You need a `service_id` (create a service first!)
2. Create request: **"Join Queue"** in Queue folder
3. Set method to `POST`
4. Add headers and JSON body with `service_id`
5. Click **Send**
6. **Copy the ticket `_id`** → Save as `ticket_id` in environment
7. ✅ You should receive SMS notification (if SMS service is configured)

---

### 4.2 Get My Queue Status (Authenticated)
**Method:** `GET`  
**URL:** `{{base_url}}/api/queue/my-status`  
**Headers:**
```
Authorization: Bearer {{token}}
```

**Expected Response (200):**
```json
[
    {
        "ticket_id": "65f1234567890abcdef12348",
        "service_name": "Document Service",
        "ticket_number": "DO-101",
        "status": "Waiting",
        "ticketNumber": "DO-101",
        "position": 1,
        "estimatedWaitTime": 0
    }
]
```

**📝 Instructions:**
1. Create request: **"Get My Queue Status"**
2. Add Authorization header
3. Click **Send**
4. ✅ Shows all your active tickets

---

### 4.3 Get Office Queue (Authenticated)
**Method:** `GET`  
**URL:** `{{base_url}}/api/queue/office/{{service_id}}`  
**Headers:**
```
Authorization: Bearer {{token}}
```

**Expected Response (200):**
```json
{
    "service": {
        "_id": "65f1234567890abcdef12347",
        "service_name": "Document Service",
        "avg_wait_time": 15
    },
    "current_serving": null,
    "queue": [
        {
            "_id": "65f1234567890abcdef12348",
            "user_id": {
                "_id": "65f1234567890abcdef12345",
                "fullname": "John Doe",
                "email": "testuser@example.com"
            },
            "ticket_number": "DO-101",
            "position": 1,
            "status": "Waiting"
        }
    ]
}
```

**📝 Instructions:**
1. Create request: **"Get Office Queue"**
2. Use `service_id` in URL
3. Add Authorization header
4. Click **Send**
5. ✅ Shows current queue status for the service

---

### 4.4 Cancel My Ticket (Authenticated)
**Method:** `PATCH`  
**URL:** `{{base_url}}/api/queue/cancel/{{ticket_id}}`  
**Headers:**
```
Authorization: Bearer {{token}}
```

**Expected Response (200):**
```json
{
    "message": "Ticket cancelled successfully."
}
```

**📝 Instructions:**
1. Create request: **"Cancel My Ticket"**
2. Use `ticket_id` in URL
3. Add Authorization header
4. Click **Send**

---

### 4.5 Update Ticket Status (Public - for system)
**Method:** `PATCH`  
**URL:** `{{base_url}}/api/queue/status/{{ticket_id}}`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
    "status": "Serving"
}
```
(Status options: `Waiting`, `Serving`, `Completed`, `Cancelled`)

**Expected Response (200):**
```json
{
    "success": true,
    "message": "Ticket marked as Serving",
    "updatedTicket": { ... }
}
```

---

## 👨‍💼 PART 5: ADMIN OPERATIONS

**⚠️ All Admin endpoints require Admin role!**

### 5.1 Get Analytics (Public - No Auth)
**Method:** `GET`  
**URL:** `{{base_url}}/api/admin/analytics`  
**Headers:** None

**Expected Response (200):**
```json
[
    {
        "status": "Waiting",
        "count": 5
    },
    {
        "status": "Serving",
        "count": 1
    },
    {
        "status": "Completed",
        "count": 10
    }
]
```

---

### 5.2 Get All Tickets (Admin Only)
**Method:** `GET`  
**URL:** `{{base_url}}/api/admin/tickets`  
**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Expected Response (200):**
```json
[
    {
        "_id": "65f1234567890abcdef12348",
        "user_id": {
            "_id": "65f1234567890abcdef12345",
            "fullname": "John Doe",
            "email": "testuser@example.com",
            "phone_number": "0912345678"
        },
        "service_id": {
            "_id": "65f1234567890abcdef12347",
            "service_name": "Document Service"
        },
        "ticket_number": "DO-101",
        "position": 1,
        "status": "Waiting"
    }
]
```

---

### 5.3 Get All Users (Admin Only)
**Method:** `GET`  
**URL:** `{{base_url}}/api/admin/users`  
**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Expected Response (200):**
```json
[
    {
        "_id": "65f1234567890abcdef12345",
        "email": "testuser@example.com",
        "fullname": "John Doe",
        "phone_number": "0912345678",
        "role": "Customer"
    }
]
```

---

### 5.4 Call Next Customer (Admin Only)
**Method:** `PATCH`  
**URL:** `{{base_url}}/api/admin/next`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{admin_token}}
```
**Body (raw JSON):**
```json
{
    "service_id": "{{service_id}}"
}
```

**Expected Response (200):**
```json
{
    "message": "Next customer called",
    "ticket": {
        "_id": "65f1234567890abcdef12348",
        "ticket_number": "DO-101",
        "status": "Serving"
    }
}
```

**📝 Instructions:**
1. Create request: **"Call Next Customer"** in Admin folder
2. Add headers and JSON body with `service_id`
3. Click **Send**
4. ✅ Next customer in queue is now being served

---

### 5.5 Complete Ticket (Admin Only)
**Method:** `PATCH`  
**URL:** `{{base_url}}/api/admin/complete/{{ticket_id}}`  
**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Expected Response (200):**
```json
{
    "message": "Service completed",
    "ticket": {
        "_id": "65f1234567890abcdef12348",
        "status": "Completed"
    }
}
```

---

### 5.6 Change User Role (Admin Only)
**Method:** `PATCH`  
**URL:** `{{base_url}}/api/admin/users/{{user_id}}/role`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{admin_token}}
```
**Body (raw JSON):**
```json
{
    "role": "Admin"
}
```
(Role options: `Customer`, `Admin`, `Student`)

**Expected Response (200):**
```json
{
    "message": "Role updated",
    "user": {
        "_id": "65f1234567890abcdef12345",
        "role": "Admin"
    }
}
```

---

### 5.7 Update Service Status (Admin Only)
**Method:** `PATCH`  
**URL:** `{{base_url}}/api/admin/services/{{service_id}}`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{admin_token}}
```
**Body (raw JSON):**
```json
{
    "is_active": false
}
```

---

### 5.8 Update Ticket Status (Admin Only)
**Method:** `PATCH`  
**URL:** `{{base_url}}/api/admin/tickets/{{ticket_id}}/status`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{admin_token}}
```
**Body (raw JSON):**
```json
{
    "status": "Completed"
}
```

---

### 5.9 Delete All Service Tickets (Admin Only)
**Method:** `DELETE`  
**URL:** `{{base_url}}/api/admin/tickets/{{service_id}}`  
**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Expected Response (200):**
```json
{
    "message": "Successfully cleared 5 waiting tickets."
}
```

**⚠️ Note:** This deletes all waiting tickets for a service!

---

### 5.10 Delete Specific Ticket (Admin Only)
**Method:** `DELETE`  
**URL:** `{{base_url}}/api/admin/services/{{service_id}}/tickets/{{ticket_id}}`  
**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Expected Response (200):**
```json
{
    "message": "Ticket deleted successfully"
}
```

---

## 🔔 PART 6: NOTIFICATIONS

### 6.1 Send Notification
**Method:** `POST`  
**URL:** `{{base_url}}/api/notifications/create`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
    "user_id": "{{user_id}}",
    "message": "Your ticket is ready!",
    "type": "InApp"
}
```
(Type options: `SMS`, `InApp`)

**Expected Response (201):**
```json
{
    "message": "Notification created successfully",
    "data": {
        "_id": "65f1234567890abcdef12349",
        "user_id": "65f1234567890abcdef12345",
        "message": "Your ticket is ready!",
        "type": "InApp",
        "status": "Pending",
        "created_at": "2024-01-15T10:30:00.000Z"
    }
}
```

---

### 6.2 Get User Notifications
**Method:** `GET`  
**URL:** `{{base_url}}/api/notifications/{{user_id}}`  
**Headers:** None

**Expected Response (200):**
```json
[
    {
        "_id": "65f1234567890abcdef12349",
        "user_id": "65f1234567890abcdef12345",
        "message": "Your ticket is ready!",
        "type": "InApp",
        "status": "Pending",
        "created_at": "2024-01-15T10:30:00.000Z"
    }
]
```

---

### 6.3 Update Notification Status
**Method:** `PUT`  
**URL:** `{{base_url}}/api/notifications/status/{{notification_id}}`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
    "status": "Sent"
}
```
(Status options: `Sent`, `Failed`, `Pending`, `Read`)

---

## 👤 PART 7: USER MANAGEMENT

### 7.1 Get User Profile by ID (Public)
**Method:** `GET`  
**URL:** `{{base_url}}/api/users/{{user_id}}`  
**Headers:** None

**Expected Response (200):**
```json
{
    "_id": "65f1234567890abcdef12345",
    "email": "testuser@example.com",
    "fullname": "John Doe",
    "phone_number": "0912345678",
    "role": "Customer"
}
```

---

### 7.2 Get All Users (Admin Only)
**Method:** `GET`  
**URL:** `{{base_url}}/api/users/all`  
**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Expected Response (200):**
```json
[
    {
        "_id": "65f1234567890abcdef12345",
        "email": "testuser@example.com",
        "fullname": "John Doe",
        "phone_number": "0912345678",
        "role": "Customer"
    }
]
```

---

## 🧪 COMPLETE TESTING WORKFLOW

### Recommended Testing Order:

1. **Setup & Health Check**
   - [ ] Health check endpoint
   - [ ] Setup Postman environment variables

2. **Authentication Flow**
   - [ ] Register new user
   - [ ] Login and save token
   - [ ] Get my profile (verify token works)
   - [ ] Update profile
   - [ ] Forgot password
   - [ ] Verify reset code
   - [ ] Reset password
   - [ ] Login with new password
   - [ ] Logout

3. **Office Management (As Admin)**
   - [ ] Create office → Save `office_id`
   - [ ] Get all offices
   - [ ] Update office
   - [ ] (Optional) Delete office

4. **Service Management**
   - [ ] List all services (public)
   - [ ] Create service (admin) → Save `service_id`
   - [ ] Get service by ID
   - [ ] Get services by office
   - [ ] (Optional) Update/Delete service

5. **Queue Management**
   - [ ] Join queue → Save `ticket_id`
   - [ ] Get my queue status
   - [ ] Get office queue
   - [ ] (Optional) Cancel my ticket

6. **Admin Operations**
   - [ ] Get analytics
   - [ ] Get all tickets
   - [ ] Get all users
   - [ ] Call next customer
   - [ ] Complete ticket
   - [ ] Change user role
   - [ ] (Optional) Update service status, delete tickets

7. **Notifications**
   - [ ] Send notification
   - [ ] Get user notifications
   - [ ] Update notification status

---

## 💡 POSTMAN TIPS & TRICKS

### Auto-Save Token After Login
In your **Login** request, go to **Tests** tab and add:
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
    pm.environment.set("user_id", jsonData.user.user_id);
    console.log("✅ Token and user_id saved to environment");
}
```

### Auto-Save Office ID After Creating Office
In **Add Office** request, **Tests** tab:
```javascript
if (pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("office_id", jsonData._id);
    console.log("✅ Office ID saved: " + jsonData._id);
}
```

### Auto-Save Service ID After Creating Service
In **Add Service** request, **Tests** tab:
```javascript
if (pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("service_id", jsonData._id);
    console.log("✅ Service ID saved: " + jsonData._id);
}
```

### Auto-Save Ticket ID After Joining Queue
In **Join Queue** request, **Tests** tab:
```javascript
if (pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("ticket_id", jsonData.data._id);
    console.log("✅ Ticket ID saved: " + jsonData.data._id);
}
```

### Pre-request Script (For Collections)
Add this to your **Collection** → **Pre-request Script** to automatically add token:
```javascript
// Auto-add token to all requests in collection
if (pm.environment.get("token")) {
    pm.request.headers.add({
        key: "Authorization",
        value: "Bearer " + pm.environment.get("token")
    });
}
```

### Test Assertions
Add tests to verify responses. Example in **Tests** tab:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has token", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('token');
});

pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});
```

---

## 🚨 COMMON ERRORS & SOLUTIONS

### 401 Unauthorized
**Cause:** Missing or invalid token  
**Solution:** 
- Login again to get fresh token
- Check Authorization header format: `Bearer {{token}}`
- Verify token is saved in environment

### 403 Forbidden
**Cause:** User doesn't have required role (Admin)  
**Solution:** 
- Login as Admin user
- Or change user role to Admin using admin endpoint

### 404 Not Found
**Cause:** Wrong URL or resource doesn't exist  
**Solution:** 
- Check URL is correct
- Verify resource ID exists (office_id, service_id, etc.)
- Check MongoDB database for actual IDs

### 400 Bad Request
**Cause:** Missing required fields or invalid data  
**Solution:** 
- Check request body matches expected format
- Verify all required fields are present
- Check email format is valid
- Verify passwords match in registration

### 500 Internal Server Error
**Cause:** Server-side error  
**Solution:** 
- Check server logs for details
- Verify MongoDB connection
- Check if all required fields are valid

### Duplicate Key Error (Email already exists)
**Cause:** Trying to register with existing email  
**Solution:** 
- Use a different email address
- Or login with existing credentials

---

## ✅ FINAL CHECKLIST

Before considering testing complete:

- [ ] Successfully registered a user
- [ ] Successfully logged in and got token
- [ ] Successfully retrieved my profile
- [ ] Successfully created an office (as admin)
- [ ] Successfully created a service (as admin)
- [ ] Successfully joined a queue
- [ ] Successfully retrieved queue status
- [ ] Successfully called next customer (as admin)
- [ ] Successfully completed a ticket (as admin)
- [ ] All error cases tested (invalid token, wrong role, etc.)

---

## 🎉 You're All Set!

Your backend is now fully tested! If you encounter any issues, check:
1. Server is running (`node server.js`)
2. MongoDB is connected
3. Environment variables are set correctly
4. Token is valid and not expired
5. User has correct role for admin endpoints

**Happy Testing! 🚀**
