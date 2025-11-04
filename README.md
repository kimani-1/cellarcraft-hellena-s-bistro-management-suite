# CellarCraft: Hellena's Bistro Management Suite

A visually striking, luxury liquor store management system combining vintage aesthetics with a modern, intuitive UI for inventory, sales, and customer management.

CellarCraft is a bespoke, luxury management system designed for Hellena's Bistro, a premium boutique liquor store. It merges a vintage European wine cellar aesthetic with a hyper-modern, minimalist UI, creating an experience akin to 'Gatsby's cellar meets Tesla's interface.' The system is a comprehensive suite covering all aspects of store management, from live sales dashboards and visual inventory control to a sophisticated point-of-sale, customer loyalty programs, and in-depth analytics. Every interaction is designed to be intuitive, visually striking, and efficient, empowering staff and management to deliver an exceptional customer experience while optimizing business operations.

[cloudflarebutton]

## ✨ Key Features

-   **Dashboard Overview**: Real-time KPIs, low-stock alerts, and quick actions.
-   **Inventory Management**: A visual grid-based system for managing stock with advanced filtering and tracking.
-   **Point of Sale (POS)**: A stylized, touch-friendly checkout interface with Mpesa STK push integration.
-   **Customer Management**: A CRM module for managing customer profiles, purchase history, and a tiered loyalty program.
-   **Analytics & Reporting**: A comprehensive dashboard for analyzing sales, profit margins, and customer behavior.
-   **Supplier Management**: A module for managing vendors, purchase orders, and restocking schedules.
-   **E-commerce Integration**: Synchronize inventory and sales between the physical store and an online platform.
-   **Event Scheduling**: Manage wine tastings and other promotional events, including RSVP and guest list management.
-   **Admin & Settings**: An admin panel for managing staff roles, access controls, and system configurations.

## 🚀 Technology Stack

-   **Frontend**: React, Vite, TypeScript, Tailwind CSS, Shadcn/UI
-   **Backend**: Hono on Cloudflare Workers
-   **State Management**: Zustand
-   **UI/Animation**: Framer Motion, Lucide React
-   **Data Visualization**: Recharts
-   **Forms**: React Hook Form with Zod for validation
-   **Storage**: Cloudflare Durable Objects

## 📂 Project Structure

This project is structured as a full-stack application within a single repository, with clear separation of concerns:

-   `src/`: Contains the React frontend application.
    -   `pages/`: Top-level page components.
    -   `components/`: Reusable UI components, including the Shadcn/UI library.
    -   `lib/`: Utility functions and API client.
-   `worker/`: Contains the Hono backend application running on Cloudflare Workers.
    -   `index.ts`: The main worker entry point.
    -   `user-routes.ts`: Defines the API routes.
    -   `entities.ts`: Defines data models and business logic using an entity pattern.
    -   `core-utils.ts`: Core utilities for interacting with Durable Objects.
-   `shared/`: Contains TypeScript types and mock data shared between the frontend and backend.

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Bun](https://bun.sh/) installed on your machine.
-   A Cloudflare account and the [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and authenticated.

### Installation & Running Locally

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd cellarcraft_hellenas_bistro
    ```

2.  **Install dependencies:**
    This project uses `bun` for package management.
    ```bash
    bun install
    ```

3.  **Run the development server:**
    This command starts the Vite development server for the frontend and the Wrangler development server for the backend API, all concurrently.
    ```bash
    bun dev
    ```
    The application will be available at `http://localhost:3000`.

## 🛠️ Development

-   **Frontend**: All frontend code is located in the `src` directory. Pages are in `src/pages`, and reusable components are in `src/components`.
-   **Backend API**: The Hono API is in the `worker` directory. To add or modify API endpoints, edit `worker/user-routes.ts`.
-   **Data Models**: To add or modify data structures, update the entity classes in `worker/entities.ts` and the corresponding types in `shared/types.ts` to maintain end-to-end type safety.
-   **Styling**: The project uses Tailwind CSS with Shadcn/UI components. Customize Tailwind in `tailwind.config.js` and global styles in `src/index.css`.

## ☁️ Deployment

This application is designed to be deployed to the Cloudflare global network.

1.  **Build the application:**
    This command bundles the frontend and backend code for production.
    ```bash
    bun build
    ```

2.  **Deploy to Cloudflare:**
    This command deploys your application using the Wrangler CLI.
    ```bash
    bun deploy
    ```

Alternatively, you can deploy directly from your GitHub repository using the button below.

[cloudflarebutton]