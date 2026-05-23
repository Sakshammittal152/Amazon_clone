# Amazon Clone - Full Stack E-Commerce Platform

This is a full-stack e-commerce web application built for the **SDE Intern Fullstack Assignment**.

The goal of this project is to create a working Amazon-style shopping experience. Users can browse products, search and filter by category, view product details, manage cart items, place orders, view order history, use wishlist, and receive order confirmation emails.

## Tech Stack

**Frontend**
- React.js
- Vite
- React Router
- Tailwind CSS
- Lucide React icons

**Backend**
- Node.js
- Express.js
- JWT for login/signup
- Nodemailer for email notifications

**Database**
- MySQL

## Core Features

### 1. Product Listing Page
- Products are shown in a responsive Amazon-style grid.
- Each product card shows image, name, price, stock status, rating, and Add to Cart button.
- Search bar can search products by name.
- Category filter supports All, Electronics, Kitchen, Home, Gaming, Books, and Fashion.
- Grid layout is responsive:
  - 4 products on laptop/desktop
  - 2 products on tablet
  - 1 product on mobile

### 2. Product Detail Page
- Product detail page has an image carousel with multiple images.
- Shows product name, price, rating, description, specifications, and stock availability.
- Includes Add to Cart, Buy Now, and Wishlist buttons.
- Product images are scaled inside fixed boxes so the layout stays clean.

### 3. Shopping Cart
- Users can view all cart items.
- Users can update product quantity.
- Users can remove items from the cart.
- Cart summary shows subtotal, shipping, and total amount.

### 4. Order Placement
- Checkout page has a shipping address form.
- User reviews shipping details and order summary before placing the order.
- Place Order creates an order in the database.
- After order placement, user is redirected to an order confirmation page.
- Confirmation page displays the generated order ID.
- Stock is validated before order creation.

## Bonus Features

- Responsive design for mobile, tablet, and desktop.
- Login and Signup functionality.
- Default shopper support, so shopping can be tested without login.
- Wishlist functionality.
- Order history page with order ID, date, status, items, and total.
- Email notification on order placement using Nodemailer.

## Amazon-Style UI

The UI is inspired by Amazon's layout and user experience:
- Fixed dark navbar.
- Amazon-style logo area.
- Category dropdown inside search bar.
- Product grid cards.
- Product detail layout with image gallery and purchase panel.
- Cart summary panel.
- Footer with matching dark color.

## Database Design

The database is designed with proper relationships.

Main tables:
- `users`
- `products`
- `product_images`
- `carts`
- `wishlist`
- `orders`
- `order_items`

Important relationships:
- One product can have many images.
- One user can have many cart items.
- One user can have many wishlist items.
- One user can place many orders.
- One order can have many order items.

Product images are stored in a separate `product_images` table instead of storing image JSON inside the `products` table. This keeps the schema easier to understand and more normalized.

## Sample Data

The database is seeded with products across multiple categories:
- Electronics
- Kitchen
- Home
- Gaming
- Books
- Fashion

Images can be local files placed inside:

```text
client/public/images
```

Image paths in MySQL should look like:

```text
/images/image1.webp
```

## Assumptions

- A default user is available for quick testing.
- Login is not required to test core shopping features.
- Real login/signup is also supported.
- Email works only when valid SMTP details are added in `server/.env`.
- This is an assignment/demo project, not a production payment system.

## Setup Instructions

### 1. Install Dependencies

Run from the project root:

```bash
npm install
npm run install:all
```

### 2. Create MySQL Database

Run `database/schema.sql` first, then run `database/seed.sql`.

Using MySQL command line:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p amazon_clone < database/seed.sql
```

Using MySQL Workbench:
- Open `database/schema.sql` and run it.
- Open `database/seed.sql` and run it.

### 3. Configure Environment Variables

Create this file:

```text
server/.env
```

Example:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=my_secret_key

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=amazon_clone

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
MAIL_FROM="Amazon Clone <your_email@gmail.com>"
```

### 4. Run the Project

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

## Useful Commands

Build frontend:

```bash
npm run build
```

Run backend only:

```bash
npm run dev --prefix server
```

Run frontend only:

```bash
npm run dev --prefix client
```

## Deployment

Suggested deployment options:
- Frontend: Vercel or Netlify
- Backend: Render or Railway
- Database: Railway MySQL, PlanetScale, Clever Cloud, or any MySQL hosting provider

Add deployed links here:

```text
GitHub Repository:
Deployed Frontend:
Deployed Backend:
```

## AI Tools Usage

AI tools were used during development for guidance, debugging, and code improvement. I understand the project structure and can explain the implementation, including frontend components, backend routes, database schema, authentication, cart flow, order flow, and email notification setup.

## Evaluation Criteria Covered

**Functionality**  
All core features are implemented: listing, search, filter, detail page, cart, checkout, order placement, and confirmation.

**UI/UX**  
The app follows Amazon-style UI patterns such as navbar, search bar, product cards, detail page layout, cart summary, and responsive grid.

**Database Design**  
The schema uses separate relational tables with proper foreign key relationships.

**Code Quality**  
Code is organized into frontend, backend, and database folders. Components and routes are separated by responsibility.

**Code Modularity**  
Reusable React components are used for navbar, footer, product cards, product grid, and toast messages. Backend routes are separated by feature.

**Code Understanding**  
The code is written in simple structure so each part can be explained clearly during evaluation.

## Author

Saksham Mittal
