# E-Commerce Frontend

A React + Vite storefront for a multi-role e-commerce marketplace.

This frontend is built to support:
- public shopping pages for guests,
- authenticated buyer behavior (cart, checkout, orders, wishlist),
- vendor management (products, orders, analytics),
- founder administration (users, analytics).

## Features

- Role-based access control with protected routes (`buyer`, `vendor`, `founder`)
- Public landing pages: Home, Products, Product details, About, Contact, policies
- Buyer workflow: Dashboard, Profile, Cart, Checkout, Orders, Wishlist
- Vendor workflow: Dashboard, Product management, Add product, Orders, Analytics
- Founder workflow: Dashboard, Users management, Analytics
- State management with Redux Toolkit
- API integration via Axios with bearer token support
- Light / dark theme toggle persisted in `localStorage`
- Toast notifications with `react-toastify`
- Responsive UI using Tailwind CSS and animation support via Framer Motion

## Technology stack

- React 19
- Vite
- Redux Toolkit
- React Router v7
- Tailwind CSS
- Axios
- Formik + Yup
- Framer Motion
- React Toastify

## Project architecture

### Entry points
- `src/main.jsx` — application bootstrap, Redux `Provider`, and root render
- `src/App.jsx` — top-level routing, theme provider, layout wrapper

### State management
- `src/store/index.js` — root store configuration
- `src/store/authSlice.js` — auth state, login/logout, persisted token/role
- `src/store/productSlice.js` — product list and details state
- `src/store/cartSlice.js` — cart state management
- `src/store/orderSlice.js` — order history and checkout state
- `src/store/notificationSlice.js` — toast notification state

### API client
- `src/api/apiClient.js` — centralized Axios instance
- Uses `http://localhost:6778/api` as the base URL
- Automatically attaches `Authorization: Bearer <token>` header when a token exists
- Exposes helper sets for `buyerAPI`, `vendorAPI`, and `founderAPI`

### UI and routes
- Layout components: `Navbar`, `Footer`, `Hero`, `ProductCard`, `CategoryCard`
- `ThemeContext` handles theme state, persistence, and dark-mode styling
- `ProtectedRoute` enforces authentication and required role checks

## Routes

### Public routes
- `/`
- `/login`
- `/register`
- `/products`
- `/product/:id`
- `/aboutus`
- `/contactus`
- `/privacy`
- `/terms`
- `/cookies`
- `/vendor-guidelines`
- `/sitemap`

### Buyer routes
- `/buyer/dashboard`
- `/buyer/profile`
- `/cart`
- `/checkout`
- `/buyer/orders`
- `/buyer/wishlist`

### Vendor routes
- `/vendor/dashboard`
- `/vendor/products`
- `/vendor/products/add`
- `/vendor/orders`
- `/vendor/analytics`

### Founder routes
- `/founder/dashboard`
- `/founder/users`
- `/founder/analytics`

## Installation

```bash
npm install
npm run dev
```

### Build and preview

```bash
npm run build
npm run preview
```

### Linting

```bash
npm run lint
```

## Notes

- Auth state is persisted in `localStorage` under `token`, `role`, and `user`
- Theme preference is persisted in `localStorage` under `theme`
- Invalid or unauthorized access redirects users to `/login` or `/`
- Catch-all route redirects unknown paths to the home page

## Directory overview

- `src/api/` — API client and request helpers
- `src/components/` — shared UI components and layout
- `src/context/` — theme provider and custom hooks
- `src/pages/` — page-level views grouped by public/buyer/vendor/founder
- `src/store/` — Redux slices and store configuration
- `src/assets/` — static images and assets

---

This README documents the frontend layer of the e-commerce project, its structure, routes, and how it integrates with the backend API.