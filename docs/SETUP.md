# Installation and Execution Guide

This guide will help you set up and run the real-time chat project with React.js.

## Prerequisites

Before you begin, make sure you have installed:

- **Node.js** (version 18 or higher)
    - Check your version: `node --version`
    - Download from: [nodejs.org](https://nodejs.org/)
- **npm** (version 9 or higher, included with Node.js)
    - Check your version: `npm --version`
- **Git** (optional, for cloning the repository)
    - Check your version: `git --version`

## Installation

### Step 1: Clone or Download the Project

**Option A: Using Git**

```bash
git clone <repository-url>
cd web-technical-test
```

**Option B: Manual Download**

1. Download the repository ZIP file
2. Extract the contents
3. Navigate to the project folder in your terminal

### Step 2: Install Dependencies

Run the following command in the project root:

```bash
npm install
```

This command will install all necessary dependencies listed in `package.json`, including:

- React 19.1.1
- React Router 7.9.2
- Tailwind CSS 4.1.13
- TypeScript 5.9.2
- Vite 7.1.7

### Step 3: Verify Installation

After installation, you should see:

- A `node_modules/` folder created in the project root
- An updated `package-lock.json` file
- A message indicating the number of packages installed

## Running the Project

### Development Mode

To start the development server with hot-reload:

```bash
npm run dev
```

**Expected output:**

```
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Open your browser and visit: **http://localhost:5173/**

The server will automatically reload when you make changes to the code.

### Production Mode

#### 1. Build the Project

```bash
npm run build
```

This command:

- Compiles TypeScript to JavaScript
- Optimizes and minifies the code
- Generates static files in the `build/` folder

#### 2. Run the Production Build

```bash
npm run start
```

This will start the production server with optimized code.

### Type Checking

To check for TypeScript errors without running the application:

```bash
npm run typecheck
```

## Running with Docker (Optional)

If you prefer to use Docker:

### Build the Image

```bash
docker build -t mfc-ai-chat .
```

### Run the Container

```bash
docker run -p 5173:5173 mfc-ai-chat
```

Access the application at: **http://localhost:5173/**

## Available Scripts

| Command             | Description                                 |
| ------------------- | ------------------------------------------- |
| `npm install`       | Installs all project dependencies           |
| `npm run build`     | Builds the application for production       |
| `npm run dev`       | Starts the development server in watch mode |
| `npm run start`     | Runs the production server                  |
| `npm run typecheck` | Checks TypeScript types                     |
