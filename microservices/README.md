# Microservices migration

This folder contains the microservice scaffolds for the E-commerce backend.

## Services
- Auth: `microservices/auth-service` (auth is fully migrated here)
- Product: `microservices/product-service`
- Order: `microservices/order-service`
- Wishlist: `microservices/wishlist-service`
- Review: `microservices/review-service`
- Category: `microservices/category-service`
- Coupon: `microservices/coupon-service`
- Address: `microservices/address-service`
- Admin Dashboard: `microservices/admin-dashboard-service`
- Gateway: `microservices/gateway`

> The monolith no longer handles auth routes. Auth requests go through `auth-service`.

## Quick start
1. Install dependencies for each service:
   - `cd microservices/auth-service && npm install`
   - `cd microservices/product-service && npm install`
   - `cd microservices/order-service && npm install`
   - `cd microservices/wishlist-service && npm install`
   - `cd microservices/review-service && npm install`
   - `cd microservices/category-service && npm install`
   - `cd microservices/coupon-service && npm install`
   - `cd microservices/address-service && npm install`
   - `cd microservices/admin-dashboard-service && npm install`
   - `cd microservices/gateway && npm install`

2. Copy `.env.example` to `.env` in each service directory and set values.

3. Start services:
   - `cd microservices/auth-service && npm run dev`
   - `cd microservices/product-service && npm run dev`
   - `cd microservices/order-service && npm run dev`
   - `cd microservices/wishlist-service && npm run dev`
   - `cd microservices/review-service && npm run dev`
   - `cd microservices/category-service && npm run dev`
   - `cd microservices/coupon-service && npm run dev`
   - `cd microservices/address-service && npm run dev`
   - `cd microservices/admin-dashboard-service && npm run dev`
   - `cd microservices/gateway && npm run dev`

4. Use the gateway at `http://localhost:3000`.

## Notes
- The gateway forwards requests from the frontend to the correct service.
- Each service connects to the same MongoDB instance for now.
- Keep service ports consistent with gateway environment variables.
