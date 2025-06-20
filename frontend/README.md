# Photo Shoot App - Frontend

A React TypeScript frontend for the Photo Shoot booking application.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Header.tsx      # Application header with navigation
├── pages/              # Page components
│   └── Home.tsx        # Home page component
├── services/           # API services
│   └── api.ts          # API client for backend communication
├── hooks/              # Custom React hooks
│   └── useApi.ts       # Hook for API calls with loading/error states
├── types/              # TypeScript type definitions
│   └── index.ts        # Application types and interfaces
├── utils/              # Utility functions
│   └── dateUtils.ts    # Date formatting and manipulation utilities
├── styles/             # CSS styles
│   └── global.css      # Global styles and component styling
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── vite-env.d.ts       # Vite environment types
```

## Features

- **TypeScript**: Full type safety throughout the application
- **Component-based architecture**: Reusable and maintainable components
- **API integration**: Ready-to-use API service for backend communication
- **Custom hooks**: Reusable logic for API calls and state management
- **Responsive design**: Mobile-friendly layout
- **Modern styling**: Clean and professional UI

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Backend Integration

The frontend is configured to communicate with the backend API running on `http://localhost:3000`. Make sure your backend server is running before testing API functionality.

## Key Components

### Header Component
- Navigation menu with links to different pages
- Responsive design for mobile devices

### Home Page
- Hero section with call-to-action
- Features grid showcasing photography services

### API Service
- Centralized API client for all backend requests
- Error handling and response formatting
- Support for all CRUD operations

### Custom Hooks
- `useApi`: Manages API calls with loading and error states
- Reusable across components for consistent API handling

## Styling

The application uses CSS modules and global styles for a clean, modern design. The color scheme is based on a professional dark blue theme with good contrast and accessibility.

## Next Steps

- Add routing with React Router
- Implement booking form components
- Add user authentication
- Create booking management pages
- Add image upload functionality
- Implement real-time notifications
