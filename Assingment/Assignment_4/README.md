# ConnectX - Real-Time Chat Application

ConnectX is a real-time messaging application with a 4-column desktop layout adhering to a strict neutral charcoal/graphite monochrome aesthetic with emerald green indicators.

## 🎨 Color Palette & Design Constraints
- **Strict Constraint**: NO blue, NO indigo, NO violet, NO purple anywhere in backgrounds, buttons, borders, or focus rings.
- **Nav Rail**: `#121212`
- **Sidebar**: `#171717`
- **Main Chat Feed**: `#141414`
- **Right Panel (Group Info)**: `#171717`
- **Surface Elevated / Hover**: `#242424` / `#2A2A2A`
- **Message Bubbles**: `#262626` (Incoming), `#333333` (Outgoing)
- **Send Button**: `#525252`
- **Subtle Borders**: `#262626`
- **Typography**: `#F5F5F5` (Primary), `#A3A3A3` (Secondary), `#737373` (Muted)
- **Status Online & Unread Badge**: `#22C55E`

---

## 🏛️ Layout Architecture (4 Columns)
1. **Left Nav Rail (68px)**:
   - App chat logo in rounded dark container
   - Nav items: Chats, Groups, Settings
   - Bottom user initial badge and logout button
2. **Chat List Sidebar (300px)**:
   - "Messages" header + compose button
   - Search input (`#242424`)
   - "Groups" section with unread badges
   - "Direct Messages" section with dynamic green online status indicators
3. **Active Conversation (flex-1)**:
   - Header with avatar, title, member count, and action buttons
   - Scrollable message feed with centered 'Today' divider
   - Incoming & outgoing message bubbles with timestamps and double-check receipts
   - File attachment cards with icon, file size, and download button
   - Typing indicator animation
   - Composer bar with emoji picker, file attachment, mic button, and `#525252` send button
4. **Group Info Drawer (280px)**:
   - Hero header with large group initial avatar
   - Member list with online/offline status dots
   - Shared files list with download buttons

---

## 🚀 How to Run

### 1. Start the Backend Server (Port 5000)
```bash
cd server
npm install
npm run dev # or npm start
```

### 2. Start the Frontend Application (Port 8080)
```bash
cd client-app
npm install
npm run dev
```
Open **[http://localhost:8080](http://localhost:8080)** in your browser.
