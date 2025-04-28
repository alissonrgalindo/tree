# Tractian Asset Management Tree

A React application that displays hierarchical asset and location data for facility management. This project provides an interactive tree view of company assets and locations with filtering and search capabilities.

## Features

- Display assets and locations in a hierarchical tree view
- Real-time search filtering
- Filter by energy sensors and critical status
- Interactive tree navigation with keyboard support
- Responsive design
- Proper accessibility attributes for screen readers
- Company/unit selector in the header

## Technology Stack

### Core Technologies

- **React 19** - Latest version of React for improved performance and features
- **TypeScript** - For type safety and improved developer experience
- **Vite** - Fast and efficient build tool with excellent HMR (Hot Module Replacement)
- **TailwindCSS 4** - Utility-first CSS framework for rapid UI development

### Data Management

- **TanStack React Query** - For efficient data fetching, caching, and state management
- **Custom API hooks** - Encapsulated API calls for companies, assets, and locations

### Project Structure

The application is organized into:
- Components: Reusable UI elements (Header, TreeItem, etc.)
- Hooks: Custom React hooks for data fetching
- Utils: Helper functions for tree manipulation
- Types: TypeScript interfaces for data models
- Assets: Icons and images

## Why These Technologies?

- **React 19**: Chosen for its improved rendering performance and robust ecosystem. The latest version offers better component architecture and hooks.

- **TypeScript**: Provides type safety that catches errors at compile time rather than runtime, making the codebase more maintainable and refactorable.

- **Vite**: Much faster build times and development experience compared to alternatives like Create React App, significantly improving developer productivity.

- **TailwindCSS**: Enables rapid UI development without context switching between CSS files. The utility-first approach reduces CSS bundle size and prevents style conflicts.

- **TanStack React Query**: Simplifies data fetching with built-in caching, refetching, and loading states, reducing boilerplate code and improving user experience.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## Project Structure

```
src/
├── assets/          # Icons and images
├── components/      # UI components
├── hooks/           # Custom React hooks for data fetching
├── types/           # TypeScript interfaces
├── utils/           # Helper functions
├── App.tsx          # Main application component
└── main.tsx         # Entry point
```
