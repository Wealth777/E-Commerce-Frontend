# CampusTrade E-Commerce Frontend - Project Summary

## Overview
CampusTrade is a multi-vendor e-commerce web application targeted at students, built with React. This frontend provides a complete shopping experience with user authentication, product browsing, cart management, and separate dashboards for buyers and vendors.

## Tech Stack
- **React**: Component-based UI library for building interactive interfaces
- **React Router**: Client-side routing for single-page application navigation
- **Redux Toolkit**: State management with simplified Redux setup
- **Axios**: HTTP client for API communication

## Project Structure

The application follows a scalable folder structure designed for maintainability and growth:

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Navbar, Footer, Hero)
│   ├── cards/          # Card components (ProductCard, CategoryCard)
│   └── ui/             # Basic UI elements (Button, Input, Card)
├── pages/              # Page components organized by user role
│   ├── public/         # Public pages (Home, Login, Products)
│   ├── buyer/          # Buyer-specific pages (Dashboard, Orders)
│   └── vendor/         # Vendor-specific pages (Dashboard, Products)
├── store/              # Redux state management
│   ├── authSlice.js    # Authentication state
│   ├── cartSlice.js    # Shopping cart state
│   ├── productSlice.js # Product listing state
│   └── orderSlice.js   # Order management state
├── services/           # API service layer
│   ├── apiClient.js    # Axios configuration with interceptors
│   ├── authService.js  # Authentication API calls
│   ├── productsService.js # Product-related API calls
│   └── ordersService.js # Order management API calls
├── hooks/              # Custom React hooks
│   └── useAuth.js      # Authentication hook
├── utils/              # Utility functions
│   └── helpers.js      # Common helper functions
├── config/             # Configuration constants
│   └── constants.js    # App-wide constants and routes
└── router.jsx          # Route configuration
```

### Why Each Folder Exists
- **components**: Contains reusable UI elements to maintain consistency and reduce code duplication
- **pages**: Organizes page components by user role for clear separation of concerns
- **store**: Centralizes state management using Redux slices for predictable state updates
- **services**: Abstracts API calls into dedicated modules for better maintainability
- **hooks**: Custom hooks encapsulate complex logic and promote reusability
- **utils**: Utility functions for common operations like formatting and validation
- **config**: Centralized configuration prevents hard-coded values throughout the app

## Routing System

### Route Types
- **Public Routes**: Accessible without authentication (Home, Login, Register, Products)
- **Protected Routes**: Require authentication and specific user roles
  - Buyer routes: Dashboard, Orders, Profile, Cart, Checkout
  - Vendor routes: Dashboard, Products, Add Product, Orders, Analytics

### Route Protection Implementation
Route protection is handled by the `ProtectedRoute` component:

```jsx
const ProtectedRoute = ({ children, requiredRole, isPublic }) => {
  const { user, token, isVerifying } = useSelector((state) => state.auth);
  const isAuthenticated = !!token && !!user;

  // Show loading while verifying auth on app load
  if (isVerifying) return <LoadingSpinner />;

  // Redirect authenticated users away from public auth pages
  if (isPublic && isAuthenticated) {
    return <Navigate to={getDashboardRoute(user.role)} />;
  }

  // Require authentication for protected routes
  if (!isPublic && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check role-based access
  if (!isPublic && requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};
```

## Authentication Flow

### Implementation Details
- **Register/Login Forms**: Formik for form state management with Yup validation
- **Token Storage**: JWT tokens stored in localStorage for persistence
- **Auto Login**: Token verification on app load restores user session

### Token Storage Strategy
```javascript
// Store token after successful login
localStorage.setItem('campustrade_token', token);
localStorage.setItem('campustrade_user', JSON.stringify(user));

// Retrieve on app load
const token = localStorage.getItem('campustrade_token');
const user = JSON.parse(localStorage.getItem('campustrade_user'));

// Clear on logout
localStorage.removeItem('campustrade_token');
localStorage.removeItem('campustrade_user');
```

### Protected Route Authentication Check
Routes check authentication by:
1. Verifying token existence in Redux state
2. Confirming user object is present
3. Validating user role matches route requirements
4. Redirecting unauthorized users to appropriate pages

## State Management

### State Structure
```javascript
// Auth State
{
  user: { id, name, email, role },
  token: "jwt_token_string",
  isLoading: false,
  error: null,
  isVerifying: true
}

// Cart State
{
  items: [
    { id, name, price, quantity, vendorId }
  ]
}

// Products State
{
  products: [...],
  categories: [...],
  selectedProduct: null,
  isLoading: false,
  error: null,
  filters: { search, category, priceMin, priceMax }
}

// Orders State
{
  orders: [...],
  selectedOrder: null,
  isLoading: false,
  error: null
}
```

### Actions and Reducers
- **Actions**: Plain objects describing state changes
- **Reducers**: Pure functions that update state based on actions
- **Async Thunks**: Handle API calls and dispatch multiple actions

Example async thunk:
```javascript
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

## Cart System

### Implementation
- **Add to Cart**: Increases quantity if item exists, otherwise adds new item
- **Remove from Cart**: Removes item completely
- **Update Quantity**: Modifies quantity, removes if quantity ≤ 0

### Local State vs Backend Sync Strategy
- **Local Storage**: Cart persists in localStorage for immediate access
- **Backend Sync**: Cart data sent to backend during checkout for validation
- **Strategy Benefits**:
  - Fast UI updates without API calls
  - Offline cart functionality
  - Backend validation prevents tampering
  - Sync ensures accurate pricing and availability

## Dashboards

### Buyer Dashboard
**Components**:
- OrderHistory: List of past orders with status
- ProfileCard: User information display
- QuickActions: Links to cart, wishlist, profile

**Features**:
- View order history with tracking
- Update profile information
- Access wishlist and cart

### Vendor Dashboard
**Components**:
- ProductList: Manage vendor's products
- AddProductForm: Create new product listing
- OrderManagement: Handle incoming orders
- AnalyticsCard: Sales performance metrics

**Features**:
- Add/edit/delete products
- View and update order status
- Sales analytics and reporting

## API Integration

### Centralized API Service
```javascript
// Base configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor - adds auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('campustrade_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor - handles errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token and redirect
      localStorage.removeItem('campustrade_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Error Handling Strategy
- **Global Interceptors**: Handle common errors (401, 500)
- **Component Level**: Try-catch blocks for specific API calls
- **User Feedback**: Toast notifications for success/error messages
- **Fallback UI**: Loading states and error boundaries

## UI Requirements

### Design Principles
- **Clean & Simple**: Minimalist design focused on usability
- **Reusable Components**: Modular components for consistency
- **Responsive Layout**: Mobile-first approach with Tailwind CSS
- **Accessibility**: Proper ARIA labels and keyboard navigation

### Component Library
- **Button**: Multiple variants (primary, secondary, danger)
- **Input**: Form inputs with validation and error states
- **Card**: Content containers with consistent styling
- **Layout Components**: Navbar, Footer, Hero sections

## Code Quality

### Best Practices
- **Functional Components**: Modern React with hooks
- **Custom Hooks**: Encapsulate complex logic (useAuth)
- **Small Components**: Single responsibility principle
- **TypeScript Ready**: JSDoc comments for future migration

### Component Communication
- **Props**: Parent-child data flow
- **Redux**: Global state for cross-component data
- **Context**: Theme and user preferences
- **Events**: Custom events for complex interactions

## Application Flow: Login to Dashboard

1. **User visits app** → App component loads → verifyAuth thunk checks localStorage token
2. **Token valid** → User state restored → Redirect to role-specific dashboard
3. **Token invalid** → Show login page → User enters credentials
4. **Login form submit** → loginUser thunk calls API → Token stored in localStorage
5. **Success** → User state updated → Navigate to dashboard based on role
6. **Dashboard loads** → Fetch user-specific data (orders, products) via Redux thunks
7. **User interacts** → State updates trigger re-renders → API calls sync with backend

## File-by-File Code Summary

### Core Configuration
- `config/constants.js`: App constants, routes, API base URL
- `services/apiClient.js`: Axios setup with interceptors
- `utils/helpers.js`: Utility functions for formatting, validation

### State Management
- `store/authSlice.js`: Authentication state and API thunks
- `store/cartSlice.js`: Cart management with localStorage persistence
- `store/productSlice.js`: Product listing and filtering
- `store/orderSlice.js`: Order management for buyers/vendors

### Components
- `components/Button.jsx`: Reusable button component
- `components/Input.jsx`: Form input with validation
- `components/Card.jsx`: Content container
- `components/ProtectedRoute.jsx`: Route protection wrapper

### Pages
- `pages/public/Home.jsx`: Landing page with featured products
- `pages/public/Login.jsx`: Authentication form
- `pages/buyer/Dashboard.jsx`: Buyer overview and quick actions
- `pages/vendor/Dashboard.jsx`: Vendor management interface

### Services
- `services/authService.js`: Login, register, token verification
- `services/productsService.js`: Product CRUD operations
- `services/ordersService.js`: Order management

### Routing
- `router.jsx`: Complete route configuration with protection

This architecture provides a solid foundation for a scalable e-commerce platform, with clear separation of concerns and maintainable code structure.</content>