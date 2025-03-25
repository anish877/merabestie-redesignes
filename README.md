# 🎁 E-Commerce Platform - Gift Card Store

## 🚀 Overview
This is a fully functional eCommerce platform built using **React.js** for the frontend and **MongoDB** for the backend. The platform is designed to sell gift cards and physical products, featuring seamless payment integration with **Razorpay** and order fulfillment through **Shiprocket**. The admin panel is highly dynamic, offering full control over products, orders, users, and settings.

## 🛠 Tech Stack
- **Frontend:** React.js, Redux Toolkit, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB
- **Authentication:** JWT (JSON Web Token)
- **Payments:** Razorpay
- **Shipping:** Shiprocket API
- **Deployment:** Vercel (Frontend) & Render/Heroku (Backend)

## ✨ Features
### 🎁 User Features:
- Browse and purchase a variety of **gift cards & products**
- **Secure payments** via Razorpay
- **Track orders** with Shiprocket integration
- **User authentication & account management**
- **Discount codes and promotions**

### 🛠 Admin Dashboard:
- **Manage Products:** Add, edit, and delete products dynamically
- **User Management:** View and control user accounts
- **Order Processing:** Track and fulfill orders with real-time updates
- **Payment Insights:** Monitor transactions and revenue analytics
- **Shipping Integration:** Automate deliveries via Shiprocket
- **Coupons & Discounts:** Create special offers for customers
- **Role-Based Access:** Assign roles for admin and staff

## 📸 Screenshots
| Home Page | Featured Items | Shop Page |
|-----------|---------------|-------------|
| <img width="1512" alt="Screenshot 2025-03-25 at 12 27 23 PM" src="https://github.com/user-attachments/assets/b5b77b4f-76fb-4764-aa90-5f470e78e921" /> | <img width="1512" alt="Screenshot 2025-03-25 at 12 27 31 PM" src="https://github.com/user-attachments/assets/67595f37-f0d8-4eac-bf34-18bd483137b5" /> | <img width="1512" alt="Screenshot 2025-03-25 at 12 27 49 PM" src="https://github.com/user-attachments/assets/9441818b-46fe-4b7c-b1fd-2e560c14c0fe" />
 |

| Product Page | Cart | Checkout |
|-----------|---------|----------------|
| <img width="1512" alt="Screenshot 2025-03-25 at 12 28 07 PM" src="https://github.com/user-attachments/assets/8f464821-5675-4f1a-bcb6-b4a48a7f6544" /> | <img width="1512" alt="Screenshot 2025-03-25 at 12 28 36 PM" src="https://github.com/user-attachments/assets/bb6c8e7d-64cf-4e26-9977-0b21336cd52e" /> | <img width="1511" alt="Screenshot 2025-03-25 at 12 28 46 PM" src="https://github.com/user-attachments/assets/777faa74-ff84-4281-82f4-a1d04500ec38" /> |


## 💾 Installation
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/yourrepo.git
cd yourrepo
```

### 2️⃣ Install Dependencies
#### Backend
```bash
cd backend
npm install
```
#### Frontend
```bash
cd ../frontend
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in both the `backend` and `frontend` folders.
#### Backend (`.env`)
```env
MONGO_URI=your_mongo_db_url
JWT_SECRET=your_secret_key
RAZORPAY_KEY=your_razorpay_key
SHIPROCKET_API_KEY=your_shiprocket_key
```
#### Frontend (`.env`)
```env
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_RAZORPAY_KEY=your_razorpay_key
```

### 4️⃣ Run the Application
#### Backend
```bash
npm start
```
#### Frontend
```bash
npm start
```

## 🚀 Deployment
### Frontend (Vercel)
```bash
vercel --prod
```
### Backend (Render/Heroku)
```bash
git push heroku main
```

## 📌 Contributing
Feel free to fork the repository and submit pull requests. Contributions are always welcome!

## 📄 License
This project is licensed under the MIT License.

## 📞 Contact
For any queries or collaborations, contact me at **your.email@example.com**.
