# ClipNote

A real-time collaborative workspace. Create a room, share the code, and start working together instantly. No account required.

## Features

- **Real-Time Collaboration** - Every keystroke syncs instantly across all connected users via Socket.IO
- **Monaco Editor** - Full VS Code editor with syntax highlighting, search, replace, undo/redo, and more
- **Image Board** - Drag, drop, paste, or upload images. Everyone in the room sees them instantly
- **No Account Required** - Create or join a room with a simple code. No signup, no login, no authentication
- **Dark & Light Mode** - Toggle between dark and light themes. Preference saved in localStorage
- **Ephemeral by Design** - Rooms exist only in server memory. When empty, they disappear forever
- **Fully Responsive** - Works perfectly on desktop, tablet, and mobile

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for building
- **Tailwind CSS** for styling
- **shadcn/ui** component primitives
- **Framer Motion** for animations
- **Monaco Editor** (VS Code editor)
- **Lucide React** icons
- **Socket.IO Client**
- **react-hot-toast** notifications

### Backend
- **Node.js** with TypeScript
- **Express** HTTP server
- **Socket.IO** WebSocket server
- **In-memory storage** (no database)

## Folder Structure

```
clipnote/
├── client/                  # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # shadcn/ui primitives
│   │   │   ├── LandingPage.tsx
│   │   │   ├── CreateRoom.tsx
│   │   │   ├── JoinRoom.tsx
│   │   │   ├── Room.tsx
│   │   │   ├── Toolbar.tsx
│   │   │   ├── StatusBar.tsx
│   │   │   └── ImageBoard.tsx
│   │   ├── hooks/
│   │   │   └── useTheme.ts
│   │   ├── lib/
│   │   │   ├── socket.ts
│   │   │   └── utils.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── server/                  # Express + Socket.IO backend
│   ├── src/
│   │   ├── index.ts
│   │   ├── roomManager.ts
│   │   └── types.ts
│   ├── package.json
│   └── tsconfig.json
├── shared/                  # Shared TypeScript types
│   └── types.ts
├── render.yaml              # Render deployment config
└── README.md
```

## Installation

### Prerequisites
- Node.js 18+
- npm

### Clone and Install

```bash
git clone <repo-url>
cd clipnote

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment Variables

```bash
# server/.env
PORT=3001
CLIENT_URL=http://localhost:5173

# client/.env
VITE_SERVER_URL=http://localhost:3001
```

## Run Locally

```bash
# Terminal 1: Start the server
cd server
npm run dev

# Terminal 2: Start the client
cd client
npm run dev
```

The client runs on `http://localhost:5173` and the server on `http://localhost:3001`.

## Build for Production

```bash
# Build server
cd server
npm run build

# Build client
cd client
npm run build
```

## Deploy on Render

1. Push the repository to GitHub
2. Go to [render.com](https://render.com) and connect your repository
3. Use the provided `render.yaml` for Blueprint deployment
4. Set the environment variables:
   - Server: `PORT=3001`, `CLIENT_URL=<your-client-url>`
   - Client: `VITE_SERVER_URL=<your-server-url>`

Alternatively, create two services manually:

### Web Service (Server)
- **Build Command**: `cd server && npm install && npm run build`
- **Start Command**: `cd server && npm start`

### Static Site (Client)
- **Build Command**: `cd client && npm install && npm run build`
- **Publish Directory**: `client/dist`

## Screenshots

<!-- Add screenshots here -->

| Page | Preview |
|------|---------|
| Landing | ![]() |
| Create Room | ![]() |
| Join Room | ![]() |
| Editor | ![]() |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+F` | Search |
| `Ctrl+H` | Replace |
| `Ctrl+Shift+C` | Copy entire workspace |
| `Ctrl+O` | Import .txt/.md file |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |

## Future Improvements

- [ ] Rich text editing
- [ ] Code syntax highlighting
- [ ] Audio/video calls
- [ ] Persistent storage option
- [ ] Export to PDF
- [ ] Drawing canvas
- [ ] Room password protection
- [ ] File sharing beyond images
- [ ] Chat sidebar
- [ ] Cursor position awareness

## License

MIT
