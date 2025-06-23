# Trendify - Modern Clothing E-Commerce Platform

**Trendify** is an AI-powered MERN stack e-commerce web application tailored for selling clothing and fashion products. Inspired by modern platforms like [Bewakoof.com](https://www.bewakoof.com) and [TheSouledStore.in](https://www.thesouledstore.in), it features a sleek UI/UX, real-time features, and intelligent systems for enhancing user experience and operational efficiency.

---

## 🚀 Features

### 1. User Management & Authentication
- Email, Google, Facebook, and OTP-based login
- Role-Based Access: User, Admin, Vendor, Super Admin
- JWT Authentication, bcrypt.js hashing
- OAuth 2.0 integration (Google, Facebook)
- User profile with wishlist and order history

### 2. Dynamic Product Catalog & Categories
- Multi-category support: Men, Women, Kids, Accessories, Footwear
- Filters by brand, size, color, price, discount
- AI-based personalized product recommendations
- Live search with auto-suggestions (Algolia/ElasticSearch)

### 3. Product Pages with Reviews & Ratings
- Detailed product view with images, specs, offers
- User-generated reviews with image uploads
- AI-moderated spam detection & sentiment analysis
- Delivery estimator and stock availability

### 4. Secure Shopping Cart & Checkout
- Cart operations with Redux Toolkit
- AI-based coupon suggestions & discounts
- Multiple payment options: UPI, Cards, COD, PayPal, BNPL
- Razorpay, Stripe integration for secure payments
- Auto tax calculation and invoice generation

### 5. Order Management & Tracking
- Real-time order tracking (Shiprocket API)
- Refund & cancellation system
- AI-powered delivery time prediction
- Email/SMS alerts using Nodemailer & Twilio

### 6. Admin Panel
- Manage products (CRUD with variations/inventory)
- View/edit/cancel/refund orders
- User management (roles, suspension)
- Analytics: Sales, revenue, user activity (Chart.js, D3.js)

### 7. AI-Powered Features
- Product recommendations using collaborative filtering
- Outfit suggestions powered by Style AI
- Voice/image-based smart search (TensorFlow.js, Google Vision API)

### 8. Wishlist & Save for Later
- Wishlist management with real-time updates via WebSockets
- Alerts for wishlist item discounts
- Wishlist-based recommendation engine

### 9. Customer Support & Chatbot
- AI Chatbot (Dialogflow or Rasa) for instant help
- Live chat using Socket.io
- Ticket-based support system

### 10. Security & Performance
- Role-Based Access Control (RBAC)
- CSRF protection, rate limiting, JWT secured APIs
- CDN caching (Cloudflare), Redis for performance

---

## 🛠️ Tech Stack

| Category           | Technology                                      |
|--------------------|-------------------------------------------------|
| Frontend           | React.js, Redux Toolkit, Tailwind CSS           |
| Backend            | Node.js, Express.js                             |
| Database           | MongoDB Atlas                                   |
| Authentication     | JWT, OAuth 2.0 (Google, Facebook)               |
| Payment Gateways   | Razorpay, Stripe, PayPal                        |
| Search             | Algolia, ElasticSearch                          |
| AI & ML            | TensorFlow.js, Google Vision API                |
| Chatbot            | Dialogflow, Rasa                                |
| Cloud & DevOps     | AWS S3, Docker, Kubernetes                      |
| Security           | JWT, OAuth2.0, AES Encryption                   |

---![Screenshot 2025-06-23 104637](https://github.com/user-attachments/assets/cbfd0ee9-747f-4a2e-ac77-0e214fb1721e)
![Screenshot 2025-06-23 104721](https://github.com/user-attachments/assets/a38e8397-68e8-48ec-9d87-3ebf8ccf3dde)
![Screenshot 2025-06-23 105300](https://github.com/user-attachments/assets/d8f0e94d-37bb-49e2-8d06-411d8007bdeb)
![Screenshot 2025-06-23 104756](https://github.com/user-attachments/assets/31a00194-9975-45e4-9fad-dc6d837e10ae)
![Screenshot 2025-06-23 104931](https://github.com/user-attachments/assets/b76b4fb6-6d76-4e01-80fc-de7fd5e4563f)
![Screenshot 2025-06-23 105204](https://github.com/user-attachments/assets/2a62e2d5-a68d-4fb1-b164-50c7c100d471)
![Screenshot 2025-06-23 105230](https://github.com/user-attachments/assets/188be273-9dd4-48dd-8638-9d35e257a992)
![Screenshot 2025-06-23 105300](https://github.com/user-attachments/assets/1d5b16a4-a183-4859-b82d-3400c9baeaac)

## 📈 Entity-Relationship Diagram (ERD)

```text
[User] --- (places) ---> [Order]
[User] --- (adds to) ---> [Cart]
[User] --- (writes) ---> [Review]
[Product] --- (belongs to) ---> [Category]
[Order] --- (has) ---> [Payment]
[Admin] --- (manages) ---> [Inventory]
