# Gateway

This gateway routes frontend requests to the appropriate microservice.

## Services
- Auth: `http://localhost:5001` (all auth requests are proxied here)
- Product: `http://localhost:5002`
- Order: `http://localhost:5003`
- Wishlist: `http://localhost:5004`
- Review: `http://localhost:5005`
- Category: `http://localhost:5006`
- Coupon: `http://localhost:5007`
- Address: `http://localhost:5008`
- Admin Dashboard: `http://localhost:5009`

> Auth endpoints are no longer handled by the monolith; they are forwarded to `auth-service`.

## Run
1. `npm install`
2. create a `.env` from `.env.example`
3. `npm run dev`
