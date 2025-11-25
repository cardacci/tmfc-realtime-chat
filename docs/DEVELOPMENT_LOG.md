# Development Log

## <a id="version-0.0.2"></a>Version 0.0.2

### Features

- Implemented multiple conversation support
    - Added conversation headers with timestamps
    - Separated conversation rendering into `ConversationView` component
- Added Google Calendar integration
    - Calendar events are clickable and open Google Calendar with pre-filled event details
    - Automatic 30-minute duration if no end time is specified

### Code Organization

- Moved `Conversation` interface to centralized types file (`app/types/chat.ts`)
- Created chat utilities module (`app/utils/chat.ts`) with `isUserRole` helper

## <a id="version-0.0.1"></a>Version 0.0.1

### Setup and Documentation

- Created ESLint and Prettier configuration files
- Normalized code formatting (indentation, file structure)
- Created documentation files in `docs/` folder:
    - `INDEX.md` - Documentation index
    - `PROJECT_STRUCTURE.md` - Architecture overview
    - `SETUP.md` - Installation guide

### Code Quality

- Fixed ESLint configuration indentation errors
- Configured automatic JSX transform (no explicit React imports needed)
- Configured Prettier to enforce line endings

### Feature Implementation

- Implemented Server-Sent Events (SSE) connection
    - Created `useChatStream` hook to handle `EventSource` connection
    - Defined TypeScript interfaces for chat events and messages
    - Implemented `Chat` component to visualize the stream
